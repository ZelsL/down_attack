import {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
} from "~~/infra/errors.js";
import database from "~~/infra/database.js";
import validator from "./validator.js";
import authorization from "./authorization.js";

const VALID_SCOPES = ["community", "mine", "official"];
const VALID_TIERS = ["AG", "T1", "T2", "T3", "AOS", "A4", "SEASON"];

const NUMERIC_COLUMNS = [
  "hp",
  "ap",
  "aap",
  "adventureap",
  "adventureaap",
  "mldr",
  "radr",
  "madr",
  "acc",
  "meev",
  "raev",
  "maev",
  "bdrp",
  "chrp",
  "chc",
  "abad",
  "adad",
  "aaad",
];

async function create(presetObject, user) {
  validatePreset(presetObject);

  const newPreset = await runInsertQuery(presetObject, user);

  newPreset.combos = presetObject.combos || [];

  return formatPreset(newPreset);

  async function runInsertQuery(presetObject, user) {
    let presetName = presetObject.name;

    if (!presetName) {
      const countResult = user?.id
        ? await database.query({
            text: `SELECT COUNT(*) FROM presets WHERE user_id = $1;`,
            values: [user.id],
          })
        : await database.query(`SELECT COUNT(*) FROM presets;`);

      const count = parseInt(countResult.rows[0].count, 10);
      presetName = `Preset ${count + 1}`;
    }

    if (presetObject.is_official) {
      if (!authorization.can(user, "update:preset:others")) {
        throw new ForbiddenError({
          message: "You do not have permission to run this action.",
          action: 'Verify if your user has the feature: "update:preset:others"',
        });
      }
    }

    const presetData = {
      user_id: user?.id || null,
      name: presetName,
      class_name: presetObject.class_name,
      spec: presetObject.spec || "Awakening",

      hp: presetObject.hp !== undefined ? presetObject.hp : 10000,
      ap: presetObject.ap || 0,
      aap: presetObject.aap || 0,
      adventureap: presetObject.adventureap || 0,
      adventureaap: presetObject.adventureaap || 0,

      mldr: presetObject.mldr || 0,
      radr: presetObject.radr || 0,
      madr: presetObject.madr || 0,

      acc: presetObject.acc || 0,
      meev: presetObject.meev || 0,
      raev: presetObject.raev || 0,
      maev: presetObject.maev || 0,

      bdrp: presetObject.bdrp || 0,
      chrp: presetObject.chrp || 0,
      chc: presetObject.chc || 0,

      abad: presetObject.abad || 0,
      adad: presetObject.adad || 0,
      aaad: presetObject.aaad || 0,

      is_public:
        presetObject.is_public !== undefined ? presetObject.is_public : true,
      is_official: presetObject.is_official || false,
      tier: presetObject.tier || null,
    };

    const columns = Object.keys(presetData);
    const values = Object.values(presetData);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

    const results = await database.query({
      text: `
      INSERT INTO
        presets (
          ${columns.join(", ")}
        ) VALUES (
          ${placeholders}
        )
      RETURNING *
      ;`,
      values: values,
    });

    return results.rows[0];
  }
}

function validatePreset(presetObject) {
  // Class Validation
  if (!presetObject.class_name || typeof presetObject.class_name !== "string") {
    throw new ValidationError({
      message: '"class_name" is required and must be a string.',
      action: "Please provide a valid BDO class name.",
    });
  }

  validator.validateClass(presetObject.class_name);

  validatePresetData(presetObject);
}

function validatePresetData(presetObject) {
  // Object Validation
  if (
    !presetObject ||
    typeof presetObject !== "object" ||
    Array.isArray(presetObject)
  ) {
    throw new ValidationError({
      message: "Invalid preset object.",
      action: "Verify if preset object is typed correctly.",
    });
  }
  // Spec Validation

  if (presetObject.spec) validator.validateSpec(presetObject.spec);

  // Name Validation
  if (presetObject.name !== undefined) {
    if (
      typeof presetObject.name !== "string" ||
      presetObject.name.trim().length === 0 ||
      presetObject.name.length > 100
    ) {
      throw new ValidationError({
        message: 'Field "name" must be a string between 1 and 100 characters.',
        action: "Provide a valid name for the preset.",
      });
    }
  }

  // Numeric attributes
  for (const col of NUMERIC_COLUMNS) {
    if (col in presetObject) {
      const value = presetObject[col];
      if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
        throw new ValidationError({
          message: `Field "${col}" must be a valid positive number.`,
          action: `Provide a valid number for "${col}".`,
        });
      }
    }
  }

  // Combo Validation
  if (
    presetObject.combos !== undefined &&
    !Array.isArray(presetObject.combos)
  ) {
    throw new ValidationError({
      message: 'Field "combos" must be an array.',
      action: "Provide an array of combos for the preset.",
    });
  }

  // Is public validation
  if (
    presetObject.is_public !== undefined &&
    typeof presetObject.is_public !== "boolean"
  ) {
    throw new ValidationError({
      message: 'Field "is_public" must be a boolean (true or false).',
      action: 'Provide true or false for "is_public".',
    });
  }

  // Class Validation

  const className = presetObject.class_name;

  if (className !== undefined) {
    if (typeof className !== "string" || className.trim().length === 0) {
      throw new ValidationError({
        message: `Invalid class_name: '${className}'.`,
        action:
          "Please provide a valid BDO class name (e.g. Hashashin, Warrior).",
      });
    }
    validator.validateClass(className);
  }

  // is official validation

  if (
    presetObject.is_official !== undefined &&
    typeof presetObject.is_official !== "boolean"
  ) {
    throw new ValidationError({
      message: 'Field "is_official" must be a boolean (true or false).',
      action: 'Provide true or false for "is_official".',
    });
  }

  // tier validation

  validateTier(presetObject.tier);

  if (presetObject.tier !== undefined) {
    if (
      typeof presetObject.tier !== "string" ||
      presetObject.tier.trim().length === 0 ||
      presetObject.tier.length > 50
    ) {
      throw new ValidationError({
        message: 'Field "tier" must be a string between 1 and 50 characters.',
        action: "Provide a valid tier for the preset.",
      });
    }
  }
}

function formatPreset(preset) {
  return {
    ...preset,
    hp: parseInt(preset.hp, 10),
    ap: parseFloat(preset.ap),
    aap: parseFloat(preset.aap),
    adventureap: parseFloat(preset.adventureap),
    adventureaap: parseFloat(preset.adventureaap),
    mldr: parseInt(preset.mldr, 10),
    radr: parseInt(preset.radr, 10),
    madr: parseInt(preset.madr, 10),
    acc: parseInt(preset.acc, 10),
    meev: parseInt(preset.meev, 10),
    raev: parseInt(preset.raev, 10),
    maev: parseInt(preset.maev, 10),
    bdrp: parseFloat(preset.bdrp),
    chrp: parseFloat(preset.chrp),
    chc: parseFloat(preset.chc),
    abad: parseFloat(preset.abad),
    adad: parseFloat(preset.adad),
    aaad: parseFloat(preset.aaad),
    created_at: new Date(preset.created_at).toISOString(),
    updated_at: new Date(preset.updated_at).toISOString(),
    combos: preset.combos || [],
  };
}

async function findAll({ className, spec, scope, user, tier } = {}) {
  validatePresetData({
    class_name: className,
    spec: spec,
  });
  validateScope(scope);
  validateTier(tier);

  if (scope?.toLowerCase().trim() === "mine" && !user?.id) {
    throw new UnauthorizedError({
      message: "User must be authenticated to view their own presets.",
      action: "Please log in to access your presets.",
    });
  }

  const presets = await runSelectQuery({ className, spec, scope, user, tier });

  return presets;

  function validateScope(scope) {
    if (scope) {
      const normalizedScope = scope.toLowerCase().trim();
      if (!VALID_SCOPES.includes(normalizedScope)) {
        throw new ValidationError({
          message: `Invalid scope: '${scope}'.`,
          action:
            "Valid options are: 'community', 'mine', 'official' or omit the scope parameter to view all presets.",
        });
      }
    }
  }

  async function runSelectQuery({ className, spec, scope, user, tier }) {
    const conditions = [];
    const values = [];

    const normalizedScope = scope ? scope.toLowerCase().trim() : "default";

    const officialCondition = `(presets.is_official = true OR (presets.user_id IS NULL AND presets.is_public = true))`;

    switch (normalizedScope) {
      case "mine": {
        values.push(user.id);
        conditions.push(`presets.user_id = $${values.length}`);
        break;
      }
      case "official": {
        conditions.push(officialCondition);
        break;
      }
      case "community": {
        if (user?.id) {
          values.push(user.id);
          conditions.push(
            `(presets.user_id IS NOT NULL AND presets.is_public = true AND presets.is_official = false AND presets.user_id !=
$${values.length})`,
          );
        } else {
          conditions.push(
            `(presets.user_id IS NOT NULL AND presets.is_public = true AND presets.is_official = false)`,
          );
        }
        break;
      }
      case "default": {
        if (user?.id) {
          values.push(user.id);
          conditions.push(
            `(${officialCondition} OR presets.user_id = $${values.length})`,
          );
        } else {
          conditions.push(officialCondition);
        }
        break;
      }
    }

    // Class Filter (optional)
    if (className) {
      values.push(className.toLowerCase().trim());
      conditions.push(`LOWER(presets.class_name) = $${values.length}`);
    }

    // Spec Filter (optional)
    if (spec) {
      values.push(spec.toLowerCase().trim());
      conditions.push(`LOWER(presets.spec) = $${values.length}`);
    }

    // Tier Filter (optional)

    if (tier) {
      values.push(tier.toUpperCase().trim());
      conditions.push(`UPPER(presets.tier) = $${values.length}`);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const results = await database.query({
      text: `
        SELECT
          presets.*,
          COALESCE(
            json_agg(combos.*) FILTER (WHERE combos.id IS NOT NULL),
            '[]'
          ) AS combos
        FROM
          presets
        LEFT JOIN
          combos ON presets.id = combos.preset_id
        ${whereClause}
        GROUP BY presets.id
        ORDER BY presets.class_name ASC, presets.name ASC;
      `,
      values: values,
    });

    return results.rows.map(formatPreset);
  }
}

async function findOneById(id, user) {
  if (!validator.isUUID(id)) {
    throw new NotFoundError({
      message: `Preset with id "${id}" not found.`,
      action: "Verify if you typed id correctly",
    });
  }

  const presetFound = await runSelectQuery(id, user);

  return presetFound;

  async function runSelectQuery(id, user) {
    const conditions = ["presets.id = $1"];
    const values = [id];

    if (user?.id) {
      values.push(user.id);
      conditions.push(
        `(presets.is_public = true OR presets.user_id = $${values.length})`,
      );
    } else {
      conditions.push(`presets.is_public = true`);
    }

    const results = await database.query({
      text: `
      SELECT
        presets.*,
        COALESCE(
          json_agg(combos.*) FILTER (WHERE combos.id IS NOT NULL),
          '[]'
        ) AS combos
      FROM
        presets
      LEFT JOIN
        combos ON presets.id = combos.preset_id
      WHERE
        ${conditions.join(" AND ")}
      GROUP BY
        presets.id
      ;`,
      values: values,
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: `Preset with id "${id}" not found.`,
        action: "Verify if you typed id correctly",
      });
    }

    return formatPreset(results.rows[0]);
  }
}

async function update(id, presetObject, user) {
  validator.validateUUID(id);
  validatePresetData(presetObject);

  const updatedPreset = await runUpdateQuery(id, presetObject, user);

  return updatedPreset;

  async function runUpdateQuery(id, presetObject, user) {
    const findPreset = await findOneById(id, user);

    if (!authorization.can(user, "update:preset", findPreset)) {
      throw new ForbiddenError({
        message: "You do not have permission to update this preset.",
        action: 'Verify if your user has the feature: "update:preset:others"',
      });
    }

    if (
      presetObject.is_official !== undefined &&
      !authorization.can(user, "update:preset:others")
    ) {
      throw new ForbiddenError({
        message:
          "You do not have permission to change official status of a preset.",
        action: 'Verify if your user has the feature: "update:preset:others"',
      });
    }

    const allowedColumns = [
      ...NUMERIC_COLUMNS,
      "name",
      "class_name",
      "spec",
      "is_public",
      "is_official",
      "tier",
    ];
    const allowedKeys = Object.keys(presetObject).filter((key) => {
      return allowedColumns.includes(key);
    });

    const valuesToUpdate = allowedKeys.map((key) => presetObject[key]);

    if (allowedKeys.length === 0) {
      throw new ValidationError({
        message: "No valid fields to update were provided.",
        action: "Try again, with valid field to update",
      });
    }

    const results = await database.query({
      text: `
      UPDATE
        presets
      SET
        ${allowedKeys
          .map((item, index) => {
            return `${item} = $${index + 2}`;
          })
          .join(", ")},
        updated_at = timezone('utc', now())
      WHERE
        id = $1
      RETURNING *
      ;`,
      values: [id, ...valuesToUpdate],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: `Preset with id "${id}" not found.`,
        action: "Verify if you typed id correctly",
      });
    }

    return formatPreset(results.rows[0]);
  }
}

async function deleteOne(id, user) {
  validator.validateUUID(id, `Preset ID`);
  const presetToDelete = await findOneById(id);

  await runDeleteQuery(presetToDelete, user);

  return presetToDelete;

  async function runDeleteQuery(foundPreset, user) {
    if (!authorization.can(user, "delete:preset", foundPreset)) {
      throw new ForbiddenError({
        message: "You do not have permission to run this action.",
        action: 'Verify if your user has the feature: "delete:preset:others"',
      });
    }

    const results = await database.query({
      text: `
      DELETE FROM
        presets
      WHERE
        id = $1
      RETURNING *
      ;`,
      values: [id],
    });

    return results.rows[0];
  }
}

function validateTier(tier) {
  if (tier) {
    const normalizedScope = tier.toUpperCase().trim();
    if (!VALID_TIERS.includes(normalizedScope)) {
      throw new ValidationError({
        message: `Invalid tier: '${tier}'.`,
        action: `Valid options are: ${VALID_TIERS.join(", ")} or omit the tier parameter.`,
      });
    }
  }
}

const preset = {
  create,
  validatePreset,
  findAll,
  findOneById,
  update,
  delete: deleteOne,
};

export default preset;
