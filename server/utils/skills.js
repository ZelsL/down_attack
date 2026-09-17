import database from "~~/infra/database.js";
import { NotFoundError, ValidationError } from "~~/infra/errors.js";

async function create(skillObject) {
  validateSkill(skillObject);

  const newSkill = await runInsertSkillQuery(skillObject);

  newSkill.hits = [];

  if (Array.isArray(skillObject.hits) && skillObject.hits.length > 0) {
    await deleteHits(newSkill.id);

    for (const hit of skillObject.hits) {
      const createdHit = await runInsertHitQuery(newSkill.id, hit);
      newSkill.hits.push(createdHit);
    }
  }

  return formatSkill(newSkill);

  async function runInsertSkillQuery(skillObject) {
    const skillData = {
      id: skillObject.id,
      name: skillObject.name,
      class_name: skillObject.class_name,
      skill_spec: skillObject.skill_spec,
      cooldown: skillObject.cooldown || 0,
      crit_hit_rate: skillObject.crit_hit_rate || 0,
      pvp_damage: skillObject.pvp_damage || 0,
      icon_path: skillObject.icon_path || "/icons/default_skill.webp",
      is_sa: skillObject.is_sa || false,
      is_fg: skillObject.is_fg || false,
      is_if: skillObject.is_if || false,
      is_down_attack: skillObject.is_down_attack || false,
      is_air_attack: skillObject.is_air_attack || false,
      is_down_smash: skillObject.is_down_smash || false,
      is_knockback: skillObject.is_knockback || false,
      is_stun: skillObject.is_stun || false,
      is_knockdown: skillObject.is_knockdown || false,
      is_floating: skillObject.is_floating || false,
      is_air_smash: skillObject.is_air_smash || false,
      is_stiffness: skillObject.is_stiffness || false,
      is_bound: skillObject.is_bound || false,
      is_grapple: skillObject.is_grapple || false,
      is_freezing: skillObject.is_freezing || false,
      self_buffs: JSON.stringify(skillObject.self_buffs || []),
    };

    const columns = Object.keys(skillData);

    const values = Object.values(skillData);

    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

    const updateSetClause = columns
      .filter((column) => column !== "id")
      .map((column) => `${column} = EXCLUDED.${column}`)
      .join(", ");

    const results = await database.query({
      text: `
        INSERT INTO skills (
          ${columns.join(", ")}
        ) VALUES (
          ${placeholders}
        )
        ON CONFLICT (id) DO UPDATE
        SET
          ${updateSetClause},
          updated_at = timezone('utc', now())
        RETURNING *;
      `,
      values: values,
    });

    return results.rows[0];
  }
}

async function runInsertHitQuery(skillId, hitObject) {
  const values = [
    skillId,
    hitObject.description || null,
    hitObject.damage_percent || 0,
    hitObject.hit_count || 1,
    hitObject.is_sa || false,
    hitObject.is_fg || false,
    hitObject.is_if || false,
    hitObject.is_down_attack || false,
    hitObject.is_air_attack || false,
    hitObject.is_down_smash || false,
    hitObject.is_knockback || false,
    hitObject.is_stun || false,
    hitObject.is_knockdown || false,
    hitObject.is_floating || false,
    hitObject.is_air_smash || false,
    hitObject.is_stiffness || false,
    hitObject.is_bound || false,
    hitObject.is_grapple || false,
    hitObject.is_freezing || false,
  ];

  const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

  const results = await database.query({
    text: `
        INSERT INTO skills_hits (
          skill_id,
          description,
          damage_percent,
          hit_count,
          is_sa,
          is_fg,
          is_if,
          is_down_attack,
          is_air_attack,
          is_down_smash,
          is_knockback,
          is_stun,
          is_knockdown,
          is_floating,
          is_air_smash,
          is_stiffness,
          is_bound,
          is_grapple,
          is_freezing
        ) VALUES (
          ${placeholders}
        )
        RETURNING *;
      `,
    values: values,
  });

  return results.rows[0];
}

async function update(skillId, updateData) {
  const parsedId = parseInt(skillId, 10);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new ValidationError({
      message: "Skill ID must be a positive integer.",
      action: "Please provide a valid integer ID.",
    });
  }

  await findOneById(parsedId);

  if (
    !updateData ||
    typeof updateData !== "object" ||
    Array.isArray(updateData)
  ) {
    throw new ValidationError({
      message: "Invalid update payload.",
      action: "Please provide a valid JSON object with fields to update.",
    });
  }

  validateUpdateSkillData(updateData);

  const allowedColumns = [
    "name",
    "class_name",
    "skill_spec",
    "cooldown",
    "crit_hit_rate",
    "pvp_damage",
    "icon_path",
    "is_sa",
    "is_fg",
    "is_if",
    "is_down_attack",
    "is_down_smash",
    "is_knockback",
    "is_knockdown",
    "is_stun",
    "is_floating",
    "is_air_smash",
    "is_stiffness",
    "is_bound",
    "is_air_attack",
    "is_grapple",
    "is_freezing",
    "self_buffs",
  ];

  const updateEntries = Object.entries(updateData).filter(([key]) =>
    allowedColumns.includes(key),
  );

  if (updateEntries.length > 0) {
    const setClauses = updateEntries.map(
      ([key], index) => `${key} = $${index + 2}`,
    );
    const values = [
      parsedId,
      ...updateEntries.map(([key, value]) =>
        key === "self_buffs" && typeof value === "object"
          ? JSON.stringify(value)
          : value,
      ),
    ];

    await database.query({
      text: `
        UPDATE skills
        SET
          ${setClauses.join(", ")},
          updated_at = timezone('utc', now())
        WHERE id = $1;
      `,
      values: values,
    });
  }

  if (Array.isArray(updateData.hits)) {
    await deleteHits(parsedId);
    for (const hit of updateData.hits) {
      await runInsertHitQuery(parsedId, hit);
    }
  }

  return await findOneById(parsedId);
}

async function findOneById(skillId) {
  const parsedId = parseInt(skillId, 10);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new ValidationError({
      message: "Skill ID must be a positive integer.",
      action: "Please provide a valid integer ID.",
    });
  }

  const results = await database.query({
    text: `
      SELECT
        skills.*,
        COALESCE(
          json_agg(skills_hits.*) FILTER (WHERE skills_hits.id IS NOT NULL),
          '[]'
        ) AS hits
      FROM
        skills
      LEFT JOIN 
        skills_hits ON skills.id = skills_hits.skill_id
      WHERE
        skills.id = $1
      GROUP BY skills.id;
    `,
    values: [parsedId],
  });

  if (results.rowCount === 0) {
    throw new NotFoundError({
      message: `Skill with id '${parsedId}' not found.`,
      action: "Please check if the skill id is correct.",
    });
  }

  return formatSkill(results.rows[0]);
}

async function deleteHits(skillId) {
  await database.query({
    text: `
      DELETE FROM
        skills_hits
      WHERE
        skill_id = $1;
    `,
    values: [skillId],
  });
}

async function deleteOne(skillId) {
  const skillToDelete = await findOneById(skillId);

  await deleteHits(skillToDelete.id);

  await runDeleteQuery(skillToDelete.id);

  return skillToDelete;

  async function runDeleteQuery(id) {
    await database.query({
      text: `
      DELETE FROM
        skills
      WHERE
        id = $1;
        `,
      values: [id],
    });
  }
}

async function findAllByClassName(className) {
  const skillsObject = await runSelectQuery(className);

  return skillsObject;

  async function runSelectQuery(className) {
    const results = await database.query({
      text: `
      SELECT
        skills.*,
        COALESCE(
          json_agg(skills_hits.*) FILTER (WHERE skills_hits.id IS NOT NULL),
          '[]'
        ) AS hits
      FROM
        skills
      LEFT JOIN 
        skills_hits ON skills.id = skills_hits.skill_id
      WHERE
        LOWER(class_name) = LOWER($1)
      GROUP BY skills.id
      ORDER BY skills.id ASC;
      ;`,
      values: [className],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "Class not found.",
        action: "Please check if the class is typed correctly.",
      });
    }

    return results.rows.map(formatSkill);
  }
}

async function findAllBySpec(className, spec) {
  const skillsObject = await runSelectQuery(className, spec);

  return skillsObject;

  async function runSelectQuery(className, spec) {
    const filterMap = {
      magnus: ["Magnus"],
      rabam: ["Secondary Skills"],
      secondary: ["Secondary Skills"],
      absolute: ["Absolute"],
      prime: ["Prime"],

      awakening: ["Awakening", "Absolute", "Secondary Skills", "Magnus"],
      succession: ["Prime", "Absolute", "Secondary Skills", "Magnus"],
      ascension: ["Ascension", "Absolute", "Secondary Skills", "Magnus"],
    };

    const normalizedClass = className.toLowerCase();
    const normalizedSpec = spec.toLowerCase();
    const ascensionsClasses = [
      "scholar",
      "archer",
      "wukong",
      "shai",
      "seraph",
      "deadeye",
    ];
    if (
      !filterMap[normalizedSpec] ||
      (ascensionsClasses.includes(normalizedClass) &&
        normalizedSpec !== "ascension")
    ) {
      throw new NotFoundError({
        message: `Spec '${normalizedSpec}' not found for class '${normalizedClass}'.`,
        action: "Please check if the spec is typed correctly.",
      });
    }

    const results = await database.query({
      text: `
      SELECT
        skills.*,
        COALESCE(
          json_agg(skills_hits.*) FILTER (WHERE skills_hits.id IS NOT NULL),
          '[]'
        ) AS hits
      FROM
        skills
      LEFT JOIN 
        skills_hits ON skills.id = skills_hits.skill_id
      WHERE
        LOWER(class_name) = LOWER($1)
        AND skills.skill_spec = ANY($2)
      GROUP BY skills.id
      ORDER BY skills.id ASC;
      ;`,
      values: [className, filterMap[normalizedSpec]],
    });

    return results.rows.map(formatSkill);
  }
}

function formatHit(hit) {
  return {
    ...hit,
    damage_percent: parseFloat(hit.damage_percent),
    hit_count: parseInt(hit.hit_count, 10),
    created_at: new Date(hit.created_at).toISOString(),
    updated_at: new Date(hit.updated_at).toISOString(),
  };
}

function formatSkill(skill) {
  return {
    ...skill,
    cooldown: parseFloat(skill.cooldown),
    crit_hit_rate: parseFloat(skill.crit_hit_rate),
    pvp_damage: parseFloat(skill.pvp_damage),
    created_at: new Date(skill.created_at).toISOString(),
    updated_at: new Date(skill.updated_at).toISOString(),
    hits: (skill.hits || []).map(formatHit),
  };
}

function validateSkill(skillObject) {
  if (!(skillObject !== null && typeof skillObject === "object")) {
    throw new ValidationError({
      message: "Invalid skill object.",
      action: "Verify if skill object is typed correctly.",
    });
  }

  const mandatoryFields = [
    skillObject.id,
    skillObject.name,
    skillObject.class_name,
    skillObject.skill_spec,
  ];

  for (const field of mandatoryFields) {
    if (field === undefined) {
      throw new ValidationError({
        message: "Invalid skill object.",
        action: "Verify if skill object is typed correctly.",
      });
    }
  }

  validateUpdateSkillData(skillObject);
}

function validateUpdateSkillData(data) {
  const numericColumns = ["cooldown", "crit_hit_rate", "pvp_damage"];
  const booleanColumns = [
    "is_sa",
    "is_fg",
    "is_if",
    "is_down_attack",
    "is_air_attack",
    "is_down_smash",
    "is_knockback",
    "is_stun",
    "is_knockdown",
    "is_floating",
    "is_air_smash",
    "is_stiffness",
    "is_bound",
    "is_grapple",
    "is_freezing",
  ];

  for (const col of numericColumns) {
    if (col in data) {
      const value = data[col];

      if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
        throw new ValidationError({
          message: `Field ${col} must be a valid posite number.`,
          action: `Provide a valid number for ${col}`,
        });
      }
    }
  }

  for (const col of booleanColumns) {
    if (col in data) {
      const value = data[col];
      if (typeof value !== "boolean") {
        throw new ValidationError({
          message: `Field ${col} must be a boolean (true or false)`,
          action: `Provide true or false for "${col}"`,
        });
      }
    }
  }
}

const skills = {
  create,
  update,
  findOneById,
  findAllByClassName,
  deleteHits,
  findAllBySpec,
  delete: deleteOne,
};

export default skills;
