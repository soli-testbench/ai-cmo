import { createMiddleware } from "hono/factory";
import { UnauthorizedError } from "@chief-mog/lib";

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    throw new UnauthorizedError("Authorization header is required");
  }
  await next();
});
