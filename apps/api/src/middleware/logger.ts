import { createMiddleware } from "hono/factory";
import { logger } from "@chief-mog/lib";

export const loggerMiddleware = createMiddleware(async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  logger.info(`${c.req.method} ${c.req.path}`, { status: c.res.status, duration });
});
