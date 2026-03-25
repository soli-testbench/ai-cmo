import { isAppError, logger } from "@chief-mog/lib";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { authMiddleware } from "./middleware/auth.js";
import { loggerMiddleware } from "./middleware/logger.js";
import { rateLimiter } from "./middleware/rate-limit.js";
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

// Global middleware — CORS restricted to explicit origin in non-dev environments
const corsOrigin = getCorsOrigin();
app.use("*", cors({ origin: corsOrigin }));
app.use("*", loggerMiddleware);

// Public routes
app.route("/", healthRoutes);

// Protected routes with rate limiting
app.use("/api/*", rateLimiter({ windowMs: 60_000, maxRequests: 100 }));
app.use("/api/*", authMiddleware);
app.route("/api", projectRoutes);
app.route("/api", analysisRoutes);
app.route("/api", opportunityRoutes);

function getCorsOrigin(): string {
	const explicit = process.env.CORS_ORIGIN;
	if (explicit) return explicit;

	// Only allow wildcard in development/test; default to localhost in production
	const env = process.env.NODE_ENV ?? "development";
	if (env === "development" || env === "test") {
		return "*";
	}
	return "http://localhost:3000";
}

export { app };
