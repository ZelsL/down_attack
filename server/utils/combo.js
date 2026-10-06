import database from "~~/infra/database.js";
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from "~~/infra/errors.js";
import skills from "./skills.js";
import validator from "./validator.js";
import authorization from "./authorization.js";

async function create(comboObject, user) {
  await validateCombo(comboObject);
  const newCombo = await runInsertQuery(comboObject, user);

  return newCombo;

  async function runInsertQuery(comboObject, user) {
    let comboName = comboObject.name;

    if (!comboName) {
      const countResult = await database.query({
        text: "SELECT name FROM combos WHERE user_id = $1 AND name LIKE 'Combo #%';",
        values: [user.id],
      });
      const comboDefaultNameRegex = /^Combo #(\d+)$/;
      const usedNumbers = countResult.rows
        .map((row) => {
          const match = row.name.match(comboDefaultNameRegex);
          return match ? parseInt(match[1]) : null;
        })
        .filter(Boolean);

      let nextNumber = 1;

      while (usedNumbers.includes(nextNumber)) {
        nextNumber++;
      }

      comboName = `Combo #${nextNumber}`;
    }

    const comboData = {
      user_id: user.id,
      preset_id: comboObject.preset_id || null,
      class_name: comboObject.class_name,
      spec: comboObject.spec || "Awakening",
      name: comboName,
      skills: JSON.stringify(comboObject.skills || []),
    };

    const columns = Object.keys(comboData);
    const values = Object.values(comboData);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

    const results = await database.query({
      text: `
        INSERT INTO
          combos (${columns.join(", ")})
        VALUES (${placeholders})
        RETURNING *;`,
      values,
    });

    return results.rows[0];
  }
}

async function validateCombo(comboObject) {
  if (
    !comboObject ||
    typeof comboObject !== "object" ||
    Array.isArray(comboObject)
  ) {
    throw new ValidationError({
      message: "Invalid combo object.",
      action: "Verify if combo object is typed correctly.",
    });
  }

  const className = comboObject.class_name;
  if (typeof className !== "string" || className.trim().length === 0) {
    throw new ValidationError({
      message: `Invalid class_name: '${className}'.`,
      action:
        "Please provide a valid BDO class name (e.g. Hashashin, Warrior).",
    });
  }

  validator.validateClass(className);

  validator.validateSpec(comboObject.spec);

  if (comboObject.preset_id) validator.validateUUID(comboObject.preset_id);

  if (comboObject.skills) {
    if (!Array.isArray(comboObject.skills)) {
      throw new ValidationError({
        message: "Invalid skills array.",
        action: "Verify if skills array is typed correctly.",
      });
    }
    // Why 42 skills ? Design choice, look's greats in the UI.

    const MAX_SKILLS_PER_COMBO = 42;

    if (comboObject.skills.length > 42) {
      throw new ValidationError({
        message: `Too many skills in combo: ${comboObject.skills.length}`,
        action: `Max ${MAX_SKILLS_PER_COMBO} skills per combo.`,
      });
    }
  }

  if (comboObject.name !== undefined) {
    if (
      typeof comboObject.name !== "string" ||
      comboObject.name.trim().length === 0 ||
      comboObject.name.length > 100
    ) {
      throw new ValidationError({
        message: 'Field "name" must be a string between 1 and 100 characters.',
        action: "Provide a valid name for the combo.",
      });
    }
  }
  if (Array.isArray(comboObject.skills)) {
    const validSkills = await skills.findAllBySpec(
      comboObject.class_name,
      comboObject.spec || "Awakening",
    );
    for (const skill of comboObject.skills) {
      if (typeof skill.id !== "number") {
        throw new ValidationError({
          message: `Invalid skill ID: '${skill.id}'.`,
          action: "Please provide a valid skill ID.",
        });
      }

      if (typeof skill.name !== "string") {
        throw new ValidationError({
          message: `Invalid skill name: '${skill.name}'.`,
          action: "Please provide a valid skill name",
        });
      }

      const idIsValid = validSkills.some((s) => s.id === skill.id);

      if (!idIsValid) {
        throw new ValidationError({
          message: `Invalid skill ID: ${skill.id}`,
          action: "Please provide a valid skill ID.",
        });
      }
      const hits = skill.hits;
      if (Array.isArray(hits)) {
        for (const hit of hits) {
          validator.validateUUID(hit.id);
          const intHitValues = [
            "hit_count",
            "normal_hits",
            "down_hits",
            "back_hits",
            "air_hits",
          ];

          for (const intHit of intHitValues) {
            if (typeof hit[intHit] !== "number") {
              throw new ValidationError({
                message: `Invalid ${intHit} value: ${hit[intHit]};`,
                action: `Please provide a valid ${intHit} value`,
              });
            }
          }

          if (typeof hit.description !== "string") {
            throw new ValidationError({
              message: `Invalid description: ${hit.description};`,
              action: `Please provide a valid description`,
            });
          }

          const totalHits =
            hit.normal_hits + hit.down_hits + hit.back_hits + hit.air_hits;

          if (totalHits > hit.hit_count) {
            throw new ValidationError({
              message: `Hit count (${hit.hit_count}) exceeds total hits (${totalHits})`,
              action: "Please adjust the hit count or check the hit values.",
            });
          }
        }
      }
    }
  }
}

async function findAll({ className, spec, presetId, user }) {
  const userCombos = await runSelectQuery();

  return userCombos;

  async function runSelectQuery() {
    const conditions = ["user_id = $1"];
    const values = [user.id];

    if (className) {
      validator.validateClass(className);
      values.push(className);
      conditions.push(`LOWER(class_name) = LOWER($${values.length})`);
    }

    if (spec) {
      validator.validateSpec(spec);
      values.push(spec);
      conditions.push(`LOWER(spec) = LOWER($${values.length})`);
    }

    if (presetId) {
      validator.validateUUID(presetId, "preset_id");
      values.push(presetId);
      conditions.push(`preset_id = $${values.length}`);
    }

    const results = await database.query({
      text: `
      SELECT * FROM combos
      WHERE ${conditions.join(" AND ")}
      ;`,
      values,
    });

    return results.rows;
  }
}

async function findOneById({ id, user }) {
  validator.validateUUID(id, "combo_id");

  const comboFound = await runSelectQuery();

  return comboFound;

  async function runSelectQuery() {
    const conditions = ["id = $1"];
    const values = [id];

    const canAccessOthers =
      user &&
      (authorization.can(user, "update:combo:others") ||
        authorization.can(user, "read:combo:others") ||
        authorization.can(user, "delete:combo:others"));

    if (user?.id && !canAccessOthers) {
      values.push(user.id);
      conditions.push(`user_id = $${values.length}`);
    }

    const results = await database.query({
      text: `
      SELECT * FROM combos
      WHERE ${conditions.join(" AND ")}
      ;`,
      values,
    });

    if (results.rows.length === 0) {
      throw new NotFoundError({
        message: `Combo with id: ${id} not found.`,
        action: "Verify if you typed correctly the combo id.",
      });
    }

    return results.rows[0];
  }
}

async function update({ comboObject, id, user }) {
  validator.validateUUID(id, "combo_id");
  const updatedCombo = await runUpdateQuery();

  return updatedCombo;

  async function runUpdateQuery() {
    if (
      !comboObject ||
      typeof comboObject !== "object" ||
      Object.keys(comboObject).length === 0
    ) {
      throw new ValidationError({
        message: "No valid fields to update were provided.",
        action: "Please provide at least one valid field to update.",
      });
    }

    const findCombo = await findOneById({
      id,
      user,
    });

    if (!authorization.can(user, "update:combo", findCombo)) {
      throw new ForbiddenError({
        message: "You do not have permission to update this combo.",
        action: 'Verify if your user has the feature: "update:combo:others"',
      });
    }

    const allowedColumns = [
      "name",
      "class_name",
      "spec",
      "skills",
      "preset_id",
    ];

    for (const key of Object.keys(comboObject)) {
      if (!allowedColumns.includes(key)) {
        throw new ValidationError({
          message: `You cannot update ${key}.`,
          action: `Verify if the column ${key} is allowed to update.`,
        });
      }
    }

    const itemsToUpdate = {
      ...findCombo,
      ...comboObject,
    };

    await validateCombo(itemsToUpdate);

    const columns = Object.keys(comboObject);
    const values = columns.map((column) => {
      if (column === "skills") {
        return JSON.stringify(comboObject.skills);
      }
      return comboObject[column];
    });

    const results = await database.query({
      text: `
      UPDATE combos
      SET ${columns.map((column, index) => `${column} = $${index + 2}`).join(", ")},
      updated_at = now()
      WHERE id = $1
      RETURNING *
      ;`,
      values: [id, ...values],
    });

    return results.rows[0];
  }
}

async function deleteOne({ id, user }) {
  validator.validateUUID(id, "combo_id");

  const comboToDelete = await findOneById({ id, user });
  await runDeleteQuery();

  return comboToDelete;

  async function runDeleteQuery() {
    if (!authorization.can(user, "delete:combo", comboToDelete)) {
      throw new ForbiddenError({
        message: "You do not have permission to run this action.",
        action: 'Verify if your user has the feature: "delete:combo:others"',
      });
    }

    await database.query({
      text: `
      DELETE FROM combos
      WHERE id = $1
      ;`,
      values: [id],
    });
  }
}

const combo = {
  create,
  findAll,
  findOneById,
  update,
  delete: deleteOne,
};

export default combo;
