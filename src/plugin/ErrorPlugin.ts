import Elysia from "elysia";
import {
  AuthorizationError,
  ForbiddenError,
  ConflictedError,
  getErrorMessage,
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
          return getErrorMessage(error);
        }
        case "FORBIDDEN": {
          set.status = 403;
          return getErrorMessage(error);
        }
        case "AUTHORIZATION_ERROR": {
          set.status = 401;
          return getErrorMessage(error);
        }
        default: {
          if (code === "NOT_FOUND") {
            set.status = 404;
            return getErrorMessage(error);
          } else if (code === "VALIDATION") {
            console.log(new Date());
            set.status = 400;
            console.log(getErrorMessage(error));
            return "Validation Error :(";
          } else if (code === "PARSE") {
            set.status = 422;
            console.log(getErrorMessage(error));
            return "Parse Error :(";
          } else if (code === "UNKNOWN") {
            set.status = 520;
            console.log(getErrorMessage(error));
            return "An unknown error occured :(";
          } else {
            set.status = 500;
            console.log(getErrorMessage(error));
            return new Response(`Internal Server Error`);
          }
        }
      }
    });
