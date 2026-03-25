export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super("NOT_FOUND", 404, message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super("VALIDATION_ERROR", 400, message);
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super("UNAUTHORIZED", 401, message);
    this.name = "UnauthorizedError";
  }
}

export function isAppError(err: unknown): err is AppError {
  if (err instanceof AppError) return true;
  return (
    err !== null &&
    typeof err === "object" &&
    "code" in err &&
    "statusCode" in err &&
    "message" in err &&
    typeof (err as AppError).code === "string" &&
    typeof (err as AppError).statusCode === "number"
  );
}
