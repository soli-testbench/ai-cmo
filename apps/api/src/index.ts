import { logger } from "@chief-mog/lib";
import { serve } from "@hono/node-server";
import { app } from "./app.js";

// Fail fast in production if critical security env vars are missing
if (process.env.NODE_ENV === "production") {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be set in production — refusing to start without it.");
  }
  if (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === "*") {
    throw new Error("CORS_ORIGIN must be set to a specific origin in production — refusing to start with wildcard.");
  }
}

const port = Number(process.env.API_PORT) || 3001;

serve({ fetch: app.fetch, port }, () => {
  logger.info(`API server listening on port ${port}`);
});
