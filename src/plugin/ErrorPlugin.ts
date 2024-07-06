import Elysia from "elysia";
import {
  AuthorizationError,
  ForbiddenError,
  ConflictedError,
  sendErrorResponse,
} from "../util/Error";

export const ErrorPlugin = (app: Elysia) =>
  app
    .error("AUTHORIZATION_ERROR", AuthorizationError)
    .error("FORBIDDEN", ForbiddenError)
    .error("CONFLICTED", ConflictedError)
    .onError(({ code, error, set }) => {
      switch (code) {
        case "CONFLICTED": {
          set.status = 409;
          return sendErrorResponse("CONFLICTED", error.message);
        }
        case "FORBIDDEN": {
          set.status = 403;
          return sendErrorResponse("FORBIDDEN", error.message);
        }
        case "AUTHORIZATION_ERROR": {
          set.status = 401;
          return sendErrorResponse("AUTHORIZATION_ERROR", error.message);
        }
        default: {
          if (code === "NOT_FOUND") {
            set.status = 404;
            return sendErrorResponse("NOT_FOUND", error.message);
          } else if (code === "VALIDATION") {
            set.status = 400;
            console.log(error);
            return sendErrorResponse("VALIDATION", "Validation Error :(");
          } else if (code === "PARSE") {
            set.status = 422;
            return sendErrorResponse("PARSE", "Invalid JSON :(");
          } else if (code === "UNKNOWN") {
            set.status = 520;
            return sendErrorResponse("UNKNOWN", "Unknown Error :(");
          } else {
            set.status = 500;
            return new Response(sendErrorResponse("UNKNOWN", error.message));
          }
        }
      }
    });
