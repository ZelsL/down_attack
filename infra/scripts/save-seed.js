import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import prettier from "prettier";
import database from "../database.js";

if (fs.existsSync(".env")) {
  dotenvExpand.expand(dotenv.config());
}

const HIT_BOOLEAN_FLAGS = [
  "is_sa",
  "is_fg",
  "is_if",
  "is_down_attack",
  "is_air_attack",
  "is_down_smash",
  "is_air_smash",
  "is_knockback",
  "is_knockdown",
  "is_stun",
  "is_floating",
  "is_stiffness",
  "is_bound",
  "is_grapple",
  "is_freezing",
];

function formatHitForSeed(hit) {
  const formatted = {
    description: hit.description || null,
    damage_percent: Number(hit.damage_percent) || 0,
    hit_count: Number(hit.hit_count) || 1,
  };

  for (const flag of HIT_BOOLEAN_FLAGS) {
    if (hit[flag] === true) {
      formatted[flag] = true;
    }
  }

  return formatted;
}

function formatSkillForSeed(row) {
  const selfBuffs =
    row.self_buffs &&
    typeof row.self_buffs === "object" &&
    !Array.isArray(row.self_buffs)
      ? row.self_buffs
      : {};

  const targetDebuffs =
    row.target_debuffs &&
    typeof row.target_debuffs === "object" &&
    !Array.isArray(row.target_debuffs)
      ? row.target_debuffs
      : {};

  return {
    id: Number(row.id),
    name: row.name,
    command: row.command || null,
    class_name: row.class_name,
    skill_spec: row.skill_spec,
    cooldown: Number(row.cooldown) || 0,
    crit_hit_rate: Number(row.crit_hit_rate) || 0,
    pvp_damage: Number(row.pvp_damage) || 0,
    icon_path: row.icon_path || "/icons/default_skill.webp",
    is_sa: Boolean(row.is_sa),
    is_fg: Boolean(row.is_fg),
    is_if: Boolean(row.is_if),
    is_down_attack: Boolean(row.is_down_attack),
    is_air_attack: Boolean(row.is_air_attack),
    is_down_smash: Boolean(row.is_down_smash),
    is_air_smash: Boolean(row.is_air_smash),
    is_knockback: Boolean(row.is_knockback),
    is_knockdown: Boolean(row.is_knockdown),
    is_stun: Boolean(row.is_stun),
    is_floating: Boolean(row.is_floating),
    is_stiffness: Boolean(row.is_stiffness),
    is_bound: Boolean(row.is_bound),
    is_grapple: Boolean(row.is_grapple),
    is_freezing: Boolean(row.is_freezing),
    self_buffs: selfBuffs,
    target_debuffs: targetDebuffs,
    tags: Array.isArray(row.tags) ? row.tags : [],
    hits: Array.isArray(row.hits) ? row.hits.map(formatHitForSeed) : [],
  };
}

async function saveSeed() {
  const client = await database.getNewClient();

  try {
    const results = await client.query(`
      SELECT
        skills.*,
        COALESCE(
          json_agg(skills_hits.* ORDER BY skills_hits.created_at ASC, skills_hits.id ASC)
            FILTER (WHERE skills_hits.id IS NOT NULL),
          '[]'
        ) AS hits
      FROM
        skills
      LEFT JOIN
        skills_hits ON skills.id = skills_hits.skill_id
      GROUP BY
        skills.id;
    `);

    if (results.rowCount < 100) {
      console.error(
        `⚠️ Aborting: Database currently has only ${results.rowCount} skills (likely cleared by tests). Run "npm run db:seed" before editing/saving seeds.`,
      );
      process.exitCode = 1;
      return;
    }

    const seedsPath = path.resolve("infra", "seeds", "skills.json");
    let existingOrderMap = new Map();

    if (fs.existsSync(seedsPath)) {
      const existingRaw = await fsp.readFile(seedsPath, "utf-8");
      const existingList = JSON.parse(existingRaw);
      existingList.forEach((skill, idx) => {
        existingOrderMap.set(Number(skill.id), idx);
      });
    }

    const formattedSkills = results.rows.map(formatSkillForSeed);

    formattedSkills.sort((a, b) => {
      const idxA = existingOrderMap.has(a.id)
        ? existingOrderMap.get(a.id)
        : Number.MAX_SAFE_INTEGER;
      const idxB = existingOrderMap.has(b.id)
        ? existingOrderMap.get(b.id)
        : Number.MAX_SAFE_INTEGER;

      if (idxA !== idxB) return idxA - idxB;
      return a.id - b.id;
    });

    const prettierConfig = (await prettier.resolveConfig(seedsPath)) || {};
    const jsonOutput = await prettier.format(
      JSON.stringify(formattedSkills, null, 2),
      {
        ...prettierConfig,
        filepath: seedsPath,
      },
    );

    await fsp.writeFile(seedsPath, jsonOutput, "utf-8");
    console.log(
      `✅ Saved ${formattedSkills.length} skills to infra/seeds/skills.json!`,
    );
  } finally {
    await client.end();
  }
}

saveSeed().catch((error) => {
  console.error("❌ Error saving skills seed:", error);
  process.exit(1);
});
