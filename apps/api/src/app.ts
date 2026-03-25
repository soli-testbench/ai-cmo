import { Hono } from "hono";
import { cors } from "hono/cors";
import { AppError, logger } from "@chief-mog/lib";
import { loggerMiddleware } from "./middleware/logger.js";
import { authMiddleware } from "./middleware/auth.js";
import { healthRoutes } from "./routes/health.js";
import { projectRoutes } from "./routes/projects.js";
import { analysisRoutes } from "./routes/analysis.js";
import { opportunityRoutes } from "./routes/opportunities.js";

const app = new Hono();

// Global error handler
app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json({ error: { code: err.code, message: err.message } }, err.statusCode as any);
  }
  // Duck-type check for cross-module AppError instances
  if (err && typeof err === "object" && "code" in err && "statusCode" in err) {
    const appErr = err as unknown as AppError;
    return c.json({ error: { code: appErr.code, message: appErr.message } }, appErr.statusCode as any);
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
