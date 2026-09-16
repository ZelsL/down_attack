import fs from "node:fs/promises";
import path from "node:path";
import skills from "../../server/utils/skills.js";

async function runSeed() {
  console.log("🌱 Iniciando o seed de skills no banco de dados...\n");

  const seedsPath = path.resolve("infra", "seeds", "skills.json");

  const fileContent = await fs.readFile(seedsPath, "utf-8");
  const skillsData = JSON.parse(fileContent);

  for (const skill of skillsData) {
    await skills.create(skill);
    console.log(` > ✅ Skill inserida: ${skill.name} (${skill.id})`);
  }

  console.log(
    `\n🚀 Sucesso! ${skillsData.length} skills foram adicionadas ao catálogo!`,
  );
}

runSeed().catch((error) => {
  console.error("\n❌ Erro ao rodar o seed:", error);
  process.exit(1);
});
