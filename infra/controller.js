import {
  setResponseStatus,
  getMethod,
  defineEventHandler,
  setCookie,
} from "h3";

import {
  MethodNotAllowedError,
  InternalServerError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ServiceError,
  UnauthorizedError,
} from "./errors.js";

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
    error instanceof ServiceError ||
    error instanceof UnauthorizedError
  ) {
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
      if (typeof handlers === "object") {
        const method = getMethod(event).toLowerCase();
        const targetHandler = handlers[method];

        if (!targetHandler) {
          return onNoMatchHandler(event);
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

const controller = {
  onNoMatchHandler,
  onErrorHandler,
  handle,
  setSessionCookie,
};

export default controller;
