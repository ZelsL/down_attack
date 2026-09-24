import {
  ForbiddenError,
  NotFoundError,
  ServiceError,
  ValidationError,
} from "~~/infra/errors.js";

const GARMOTH_API_URL = process.env.GARMOTH_API_URL;
const GARMOTH_API_KEY = process.env.GARMOTH_API_KEY;

async function findAllById(id) {
  validateID(id);
  const rawData = await getCharacterBuilds(id);

  return convertRawBuild(rawData);
}

async function findOneById(id, position) {
  validateID(id);

  const rawData = await getCharacterBuilds(id);

  return convertRawBuild(rawData, position);
}

async function getCharacterBuilds(id) {
  let response;
  try {
    response = await fetch(`${GARMOTH_API_URL}?ids=${id}`, {
      headers: {
        apiKey: GARMOTH_API_KEY,
      },
    });
  } catch (error) {
    throw new ServiceError({
      message: "Garmoth service is unavaible.",
      action: "Please try again after few minutes.",
      cause: error,
    });
  }

  const data = await response.json();

  if (response.status === 401 || response.status === 403) {
    throw new ForbiddenError({
      message: "This garmoth character is private.",
      action:
        "Make sure the character or build is public on Garmoth before importing.",
    });
  }

  if (!Array.isArray(data) || data.length === 0) {
    throw new NotFoundError({
      message: `Not found character with id:'${id}'.`,
      action: "Verify if you typed id correctly.",
    });
  }

  return data;
}

function validateID(id) {
  if (id === undefined) {
    throw new ValidationError({
      message: 'Field "character_id" is required',
    });
  }
}

function convertRawBuild(rawData, position) {
  const character = Array.isArray(rawData) ? rawData[0] : rawData;
  const combatBuilds =
    character?.builds?.filter((build) => build.type === "combat") || [];
  let selectBuild;

  if (position !== undefined) {
    selectBuild = combatBuilds[position] || combatBuilds[0];
    return convertBuildFormat(character, selectBuild);
  }

  const outputList = [];

  for (const combatBuild in combatBuilds) {
    selectBuild = combatBuilds[combatBuild];

    outputList.push(convertBuildFormat(character, selectBuild));
  }

  return outputList;
}

function convertBuildFormat(character, build) {
  const classesMap = {
    6: "Witch",
    19: "Hashashin",
  };
  const specMap = {
    awak: "Awakening",
    succ: "Succession",
  };

  const className = classesMap[character?.class];
  const spec = specMap[character?.spec];

  const buildName = build?.name || character.name || "Garmoth Preset";
  const stats = build?.stats || {};

  const outputObject = {
    name: buildName || "Garmoth Preset",
    class_name: className || "Unknown",
    spec: spec || "Awakening",
    is_public: true,
    combos: [],
    hp: Math.round(Number(stats.hp)) || 0,
    ap: Number(stats.ap) || 0,
    aap: Number(stats.aap) || 0,
    adventureap: Number(stats.adventureap) || 0,
    adventureaap: Number(stats.adventureaap) || 0,
    mldr: Math.round(Number(stats.mldr)) || 0, // Melee DR
    radr: Math.round(Number(stats.radr)) || 0, // Ranged DR
    madr: Math.round(Number(stats.madr)) || 0, // Magic DR
    acc: Math.round(Number(stats.acc)) || 0, // Precisão
    meev: Math.round(Number(stats.meev)) || 0, // Melee Evasion
    raev: Math.round(Number(stats.raev)) || 0, // Ranged Evasion
    maev: Math.round(Number(stats.maev)) || 0, // Magic Evasion
    bdrp: Number(stats.bdrp) || 0, // Back Damage Reduction %
    chrp: Number(stats.chrp) || 0, // Crit Hit Reduction %
    chc: Number(stats.chc) || 0, // Crit Hit Chance
    abad: Number(stats.abad) || 0, // All Back Attack Damage
    adad: Number(stats.adad) || 0, // All Down Attack Damage
    aaad: Number(stats.aaad) || 0, // All Air Attack Damage
  };

  return outputObject;
}

const garmoth = {
  findAllById,
  findOneById,
  convertRawBuild,
};

export default garmoth;
