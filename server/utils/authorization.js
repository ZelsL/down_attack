import { InternalServerError } from "~~/infra/errors";

const availableFeatures = [
  /// USER
  "create:user",
  "read:user",
  "read:user:self",
  "update:user",
  "update:user:others",

  // SESSION

  "create:session",
  "read:session",

  // MIGRATION

  "run:migrations",
  "read:migrations",

  // STATUS

  "read:status",
  "read:status:all",
];

function can(user, feature, resource) {
  validateUser(user);
  validateFeature(feature);

  let authorized = false;

  if (user.features.includes(feature)) {
    authorized = true;
  }

  if (feature === "update:user" && resource) {
    authorized = false;

    if (user.id === resource.id || can(user, "update:user:others")) {
      authorized = true;
    }
  }

  return authorized;
}

function validateUser(user) {
  if (!user || !user.features) {
    throw new InternalServerError({
      cause: "user is required in the authorization model",
    });
  }
}

function validateFeature(feature) {
  if (!feature || !availableFeatures.includes(feature)) {
    throw new InternalServerError({
      cause: "A known feature must be provided in the authorization model.",
    });
  }
}

// function validateResource(resource) {
//   if (!resource) {
//     throw new InternalServerError({
//       cause: "resource is required in authorization.filterOutput().",
//     });
//   }
// }

const authorization = {
  can,
};

export default authorization;
