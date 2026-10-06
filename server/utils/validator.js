import { validate as uuidValidate } from "uuid";
import { ValidationError } from "~~/infra/errors.js";

const VALID_CLASSES = [
  "warrior",
  "ranger",
  "sorceress",
  "berserker",
  "tamer",
  "musa",
  "maehwa",
  "valkyrie",
  "kunoichi",
  "ninja",
  "wizard",
  "witch",
  "darkknight",
  "striker",
  "mystic",
  "lahn",
  "archer",
  "shai",
  "guardian",
  "hashashin",
  "nova",
  "sage",
  "corsair",
  "drakania",
  "woosa",
  "maegu",
  "scholar",
  "dosa",
  "deadeye",
];

const VALID_SPECS = ["awakening", "succession", "ascension"];

function validateClass(className) {
  if (
    !className ||
    typeof className !== "string" ||
    className.trim().length === 0
  ) {
    throw new ValidationError({
      message: '"class_name" is required and must be a string.',
      action: "Please provide a valid BDO class name.",
    });
  }

  const normalizedClassName = className.toLowerCase().trim();

  if (!VALID_CLASSES.includes(normalizedClassName)) {
    throw new ValidationError({
      message: `Invalid class_name: '${className}'.`,
      action: "Please provide a valid BDO class name (e.g Hashashin, Warrior).",
    });
  }
}

function validateSpec(specName) {
  if (
    !specName ||
    typeof specName !== "string" ||
    !VALID_SPECS.includes(specName.toLowerCase().trim())
  ) {
    throw new ValidationError({
      message: `Invalid spec: '${specName}'.`,
      action: "Valid option are: 'Awakening', 'Succession' or 'Ascension'.",
    });
  }
}
function isUUID(id) {
  return typeof id === "string" && uuidValidate(id);
}

function validateUUID(id, fieldName = "id") {
  if (!isUUID(id)) {
    throw new ValidationError({
      message: `Invalid ${fieldName}: '${id}'.`,
      action: `Please provide a valid UUID for ${fieldName}.`,
    });
  }
}

const validator = {
  validateUUID,
  validateClass,
  validateSpec,
  VALID_CLASSES,
  VALID_SPECS,
  isUUID,
};

export default validator;
