export function sendErrorResponse(errorCode: string, errorMessage: string) {
  const response = {
    code: errorCode,
    message: errorMessage,
  };
  return JSON.stringify(response);
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
  }
}

export class ConflictedError extends Error {
  constructor(message = "Validation Error") {
    super(message);
  }
}

export class AuthorizationError extends Error {
  constructor(message = "Authorization Error") {
    super(message);
  }
}
