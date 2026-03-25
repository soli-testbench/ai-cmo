import { createMiddleware } from "hono/factory";

interface RateLimitEntry {
	count: number;
	resetAt: number;
}

/**
 * Simple in-memory sliding-window rate limiter.
 *
 * @param windowMs  — time window in milliseconds (default: 60 000 = 1 min)
 * @param maxRequests — max requests per IP per window (default: 100)
 *
 * For production with multiple replicas, replace with a Redis-backed limiter.
 */
export function rateLimiter({ windowMs = 60_000, maxRequests = 100 } = {}) {
	const store = new Map<string, RateLimitEntry>();

	// Periodically prune expired entries to prevent memory leaks
	const pruneInterval = setInterval(
		() => {
			const now = Date.now();
			for (const [key, entry] of store) {
				if (entry.resetAt <= now) {
					store.delete(key);
				}
			}
		},
		windowMs > 60_000 ? 60_000 : windowMs,
	);
	// Allow the process to exit without waiting for the timer
	if (pruneInterval.unref) {
		pruneInterval.unref();
	}

	return createMiddleware(async (c, next) => {
		const ip =
			c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
			c.req.header("x-real-ip") ||
			"unknown";

		const now = Date.now();
		let entry = store.get(ip);

		if (!entry || entry.resetAt <= now) {
			entry = { count: 1, resetAt: now + windowMs };
			store.set(ip, entry);
		} else {
			entry.count++;
		}

		// Set standard rate-limit headers
		c.header("X-RateLimit-Limit", String(maxRequests));
		c.header("X-RateLimit-Remaining", String(Math.max(0, maxRequests - entry.count)));
		c.header("X-RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));

		if (entry.count > maxRequests) {
			return c.json(
				{
					error: {
						code: "RATE_LIMIT_EXCEEDED",
						message: "Too many requests, please try again later",
					},
				},
				429,
			);
		}

		await next();
	});
}
