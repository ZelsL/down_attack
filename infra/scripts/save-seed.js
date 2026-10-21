import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import prettier from "prettier";
import database from "../database.js";
import seed from "../../server/utils/seed.js";

if (fs.existsSync(".env")) {
  dotenvExpand.expand(dotenv.config());
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
        skills.id
      ORDER BY
        skills.id ASC
    ;`);

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

    const formattedSkills = results.rows.map(seed.formatSkillForSeed);

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
