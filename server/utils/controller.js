import {
  setResponseStatus,
  getMethod,
  defineEventHandler,
  setCookie,
  getCookie,
} from "h3";

import {
  MethodNotAllowedError,
  InternalServerError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ServiceError,
  UnauthorizedError,
} from "~~/infra/errors.js";

import session from "./session.js";
import user from "./user.js";

const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000;

function onNoMatchHandler(event) {
  const publicErrorObject = new MethodNotAllowedError();
  setResponseStatus(event, publicErrorObject.statusCode);
  return publicErrorObject.toJSON();
}

function onErrorHandler(error, event) {
  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof ForbiddenError ||
    error instanceof ServiceError
  ) {
    setResponseStatus(event, error.statusCode);
    return error.toJSON();
  }

  if (error instanceof UnauthorizedError) {
    clearSessionToken(event);
    setResponseStatus(event, error.statusCode);
    return error.toJSON();
  }

  const publicErrorObject = new InternalServerError({
    cause: error,
  });
  console.error(publicErrorObject);

  setResponseStatus(event, publicErrorObject.statusCode);
  return publicErrorObject.toJSON();
}

function handle(handlers) {
  return defineEventHandler(async (event) => {
    try {
      await injectAnonymousOrUser(event);

      if (typeof handlers === "object") {
        const method = getMethod(event).toLowerCase();
        const targetHandler = handlers[method];

        if (!targetHandler) {
          return onNoMatchHandler(event);
        }

        if (Array.isArray(targetHandler)) {
          let result;
          for (const handler of targetHandler) {
            result = await handler(event);
          }
          return result;
        }

        return await targetHandler(event);
      }

      return await handlers(event);
    } catch (error) {
      return onErrorHandler(error, event);
    }
  });
}

function setSessionCookie(sessionToken, event) {
  setCookie(event, "session_id", sessionToken, {
    path: "/",
    maxAge: EXPIRATION_IN_MILLISECONDS / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  });
}

function clearSessionToken(event) {
  setCookie(event, "session_id", "invalid", {
    path: "/",
    maxAge: -1,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
}

async function injectAnonymousOrUser(event) {
  const sessionToken = getCookie(event, "session_id");

  if (sessionToken) {
    try {
      const sessionObject = await session.findOneValidByToken(sessionToken);
      const userObject = await user.findOneById(sessionObject.user_id);

      event.context.user = userObject;
      return;
    } catch {
      // ignore invalid/expired session error and proceeds at anonymously.
    }
  }

  injectAnonymousUser(event);
}

function injectAnonymousUser(event) {
  event.context.user = {
    features: ["read:status", "create:session", "create:user"],
  };
}

function canRequest(feature) {
  return function canRequestMiddleware(event) {
    const userTryingToRequest = event.context.user;

    if (userTryingToRequest?.features?.includes(feature)) {
      return;
    }

    throw new ForbiddenError({
      message: "You do not have permission to run this action.",
      action: `Verify if you user has the feature: "${feature}"`,
    });
  };
}

const controller = {
  onNoMatchHandler,
  onErrorHandler,
  handle,
  setSessionCookie,
  clearSessionToken,
  injectAnonymousOrUser,
  canRequest,
};

export default controller;
