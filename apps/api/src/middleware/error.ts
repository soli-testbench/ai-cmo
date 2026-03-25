import { createMiddleware } from "hono/factory";
import { AppError, logger } from "@chief-mog/lib";

function isAppError(err: unknown): err is AppError {
  if (err instanceof AppError) return true;
  if (err && typeof err === "object" && "code" in err && "statusCode" in err && "message" in err) {
    return typeof (err as any).code === "string" && typeof (err as any).statusCode === "number";
  }
  return false;
}

export const errorMiddleware = createMiddleware(async (c, next) => {
  try {
    await next();
  } catch (err) {
    if (isAppError(err)) {
      return c.json({ error: { code: err.code, message: err.message } }, err.statusCode as any);
    }
    logger.error("Unhandled error", { error: String(err) });
    return c.json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } }, 500);
  }
});
