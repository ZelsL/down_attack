import fs from "node:fs/promises";
import path from "node:path";
import { v5 as uuidv5 } from "uuid";
import { setTimeout } from "node:timers/promises";

const NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

const blankCharactersObject = {
  Warrior: {
    Awakening: "UP9ud0xlWh",
    Succession: "D790U0K7Dd",
  },
  Ranger: {
    Awakening: "cozacBjNJF",
    Succession: "doTuD04Xy3",
  },
  Sorceress: {
    Awakening: "doTbUaJmzZ",
    Succession: "CP9aCuiOvV",
  },
  Berserker: {
    Awakening: "cotaD0JIoX",
    Succession: "UPtbcAwK6v",
  },
  Tamer: {
    Awakening: "DpSAcuJolX",
    Succession: "D7SBc0i7zV",
  },
  Musa: {
    Awakening: "cy9BCrpsb5",
    Succession: "CPtucQSy57",
  },
  Maehwa: {
    Awakening: "DyS0Cm8GxF",
    Succession: "dOsA1RtZjq",
  },
  Valkyrie: {
    Awakening: "cPsu1awsQr",
    Succession: "CytbCuku2b",
  },
  Witch: {
    Awakening: "dysbcFhfgj",
    Succession: "DPsaC25ERn",
  },
  Wizard: {
    Awakening: "cpSaDv5Q5Y",
    Succession: "DptuCRyRWz",
  },
  Kunoichi: {
    Awakening: "D7sBC9aA3C",
    Succession: "Cotb1suC1n",
  },
  Ninja: {
    Awakening: "D7SbDRZtQN",
    Succession: "17Sucrtpnk",
  },
  "Dark Knight": {
    Awakening: "c7Sad9u2ED",
    Succession: "CPSAD90uBU",
  },
  Striker: {
    Awakening: "cPTBCz0f9y",
    Succession: "Up90Eu1A2q",
  },
  Mystic: {
    Awakening: "1oSAfACbKO",
    Succession: "Cyzu2bDDF1",
  },
  Lahn: {
    Awakening: "do9AczaFI1",
    Succession: "UOzAFuUDmB",
  },
  Archer: {
    Ascension: "1os0EuCC88",
  },
  Shai: {
    Ascension: "cPS02BC2D0",
  },
  Guardian: {
    Awakening: "cpsuEBd2Q0",
    Succession: "cpsBv0CHFv",
  },
  Hashashin: {
    Awakening: "DoTAfacHIa",
    Succession: "1PZbebeeyU",
  },
  Nova: {
    Awakening: "CpTuebd3Rv",
    Succession: "dy9AfbCwbL",
  },
  Sage: {
    Awakening: "C7zAEAdi2u",
    Succession: "1ytufB1JwU",
  },
  Corsair: {
    Awakening: "CPs0EA1WMG",
    Succession: "CytbeACwtP",
  },
  Drakania: {
    Awakening: "17z0E0UvGd",
    Succession: "cOtuebDFxm",
  },
  Woosa: {
    Awakening: "cP9AFB1L17",
    Succession: "DPzbfADk8G",
  },
  Maegu: {
    Awakening: "cOsbvb15ni",
    Succession: "dOsbeADLWQ",
  },
  Scholar: {
    Ascension: "1p9ufAUMDV",
  },
  Dosa: {
    Awakening: "dyTaf0U6xI",
    Succession: "C7TaFAcXHv",
  },
  Deadeye: {
    Ascension: "CPsuf0Cmqp",
  },
  Wukong: {
    Ascension: "dy9aE0dyA8",
  },
  Seraph: {
    Ascension: "1yTAeuU73z",
  },
  Agent: {
    Succession: "Dozu2ACNMz",
  },
};

const GARMOTH_API_KEY = process.env.GARMOTH_API_KEY;
const GARMOTH_API_URL =
  process.env.GARMOTH_API_KEY ||
  "https://api.garmoth.com/api/external/gear-planner/getCharacterBuilds";

const flatCharactersList = [];

for (const [className, specs] of Object.entries(blankCharactersObject)) {
  for (const [spec, id] of Object.entries(specs)) {
    flatCharactersList.push({
      className,
      spec,
      id,
    });
  }
}

const CHUNK_SIZE = 11;
const allPresets = [];

for (let i = 0; i < flatCharactersList.length; i += CHUNK_SIZE) {
  const chunk = flatCharactersList.slice(i, i + CHUNK_SIZE);
  const idsParam = chunk.map((char) => char.id).join(",");

  console.log(`Buscando lote ${i / CHUNK_SIZE + 1}... IDs: ${idsParam}`);

  const response = await fetch(`${GARMOTH_API_URL}?ids=${idsParam}`, {
    headers: {
      apiKey: GARMOTH_API_KEY,
    },
  });

  const data = await response.json();
  console.log(`Recebidos ${data.length} personagens do Garmoth.`);

  for (const character of data) {
    const charInfo = chunk.find((c) => c.id === character.url);
    if (!charInfo) continue;

    const { className, spec } = charInfo;
    const combatBuild = character.builds?.find((b) => b.type === "combat");
    const stats = combatBuild?.stats || {};

    const preset = {
      id: uuidv5(`${className}-${spec}-blank-preset`, NAMESPACE),
      user_id: null,
      name: `${className} ${spec} - Blank Preset`,
      class_name: className,
      spec: spec,
      is_public: true,
      hp: Math.round(Number(stats.hp)) || 0,
      ap: Number(stats.ap) || 0,
      aap: Number(stats.aap) || 0,
      adventureap: Number(stats.adventureap) || 0,
      adventureaap: Number(stats.adventureaap) || 0,
      mldr: Math.round(Number(stats.mldr)) || 0,
      radr: Math.round(Number(stats.radr)) || 0,
      madr: Math.round(Number(stats.madr)) || 0,
      acc: Math.round(Number(stats.acc)) || 0,
      meev: Math.round(Number(stats.meev)) || 0,
      raev: Math.round(Number(stats.raev)) || 0,
      maev: Math.round(Number(stats.maev)) || 0,
      bdrp: Number(stats.bdrp) || 0,
      chrp: Number(stats.chrp) || 0,
      chc: Number(stats.chc) || 0,
      abad: Number(stats.abad) || 0,
      adad: Number(stats.adad) || 0,
      aaad: Number(stats.aaad) || 0,
    };

    allPresets.push(preset);
  }

  if (i + CHUNK_SIZE < flatCharactersList.length) {
    console.log("Aguardando 5 segundos para o próximo lote...");
    await setTimeout(5000);
  }
}

const outputPath = path.resolve("infra", "seeds", "presets.json");
await fs.writeFile(outputPath, JSON.stringify(allPresets, null, 2), "utf-8");
console.log(`✨ Sucesso! ${allPresets.length} presets salvos em ${outputPath}`);
