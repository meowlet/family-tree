export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
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
