import { setResponseStatus, getMethod, defineEventHandler } from "h3";
import {
  MethodNotAllowedError,
  InternalServerError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ServiceError,
} from "./errors.js";

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

const controller = {
  onNoMatchHandler,
  onErrorHandler,
  handle,
};

export default controller;
