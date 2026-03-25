import { UnauthorizedError } from "@chief-mog/lib";
import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    throw new UnauthorizedError("Authorization header is required");
  }
  await next();
});
