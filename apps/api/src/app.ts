import { isAppError, logger } from "@chief-mog/lib";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { authMiddleware } from "./middleware/auth.js";
import { loggerMiddleware } from "./middleware/logger.js";
import { analysisRoutes } from "./routes/analysis.js";
import { healthRoutes } from "./routes/health.js";
import { opportunityRoutes } from "./routes/opportunities.js";
import { projectRoutes } from "./routes/projects.js";

const app = new Hono();

app.onError((err, c) => {
  if (isAppError(err)) {
    // biome-ignore lint/suspicious/noExplicitAny: Hono expects specific status code literals
    return c.json({ error: { code: err.code, message: err.message } }, err.statusCode as any);
  }
  logger.error("Unhandled error", { error: String(err) });
  return c.json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" } }, 500);
});

// Global middleware
app.use("*", cors());
app.use("*", loggerMiddleware);

// Public routes
app.route("/", healthRoutes);

// Protected routes
app.use("/api/*", authMiddleware);
app.route("/api", projectRoutes);
app.route("/api", analysisRoutes);
app.route("/api", opportunityRoutes);

export { app };
