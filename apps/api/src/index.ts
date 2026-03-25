import { logger } from "@chief-mog/lib";
import { serve } from "@hono/node-server";
import { app } from "./app.js";

const port = Number(process.env.API_PORT) || 3001;

serve({ fetch: app.fetch, port }, () => {
  logger.info(`API server listening on port ${port}`);
});
