import { UnauthorizedError } from "@chief-mog/lib";
import { createMiddleware } from "hono/factory";

// TODO(security): Replace with real token validation (e.g. JWT verification)
// before any deployment beyond local dev. This scaffold placeholder rejects
// missing/malformed headers but does NOT verify token signatures or claims.
export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    throw new UnauthorizedError("Authorization header is required");
  }

  if (!authHeader.startsWith("Bearer ") || authHeader.length < 8) {
    throw new UnauthorizedError("Invalid authorization format");
  }

  const token = authHeader.slice(7);
  if (!token || token === "placeholder") {
    throw new UnauthorizedError("Invalid token");
  }

  await next();
});
