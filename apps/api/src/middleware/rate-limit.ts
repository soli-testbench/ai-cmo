import type { Context } from "hono";
import { createMiddleware } from "hono/factory";

interface RateLimitEntry {
	count: number;
	resetAt: number;
}

/**
 * Resolve the client IP address for rate-limiting.
 *
 * Security: proxy headers (X-Forwarded-For, X-Real-IP) are trivially spoofable.
 * They are only used when TRUST_PROXY is explicitly enabled, which should only be
 * set when the app runs behind a trusted reverse proxy that sanitises these headers.
 *
 * When TRUST_PROXY is not set, we use the socket remote address directly
 * (available via @hono/node-server's `env.incoming`), falling back to "unknown".
 */
function resolveClientIp(c: Context): string {
	const trustProxy = process.env.TRUST_PROXY === "true" || process.env.TRUST_PROXY === "1";

	if (trustProxy) {
		const forwarded = c.req.header("x-forwarded-for")?.split(",")[0]?.trim();
		if (forwarded) return forwarded;

		const realIp = c.req.header("x-real-ip");
		if (realIp) return realIp;
	}

	// For @hono/node-server, the raw Node IncomingMessage is on c.env.incoming
	// biome-ignore lint/suspicious/noExplicitAny: node-server env typing varies
	const incoming = (c.env as any)?.incoming;
	if (incoming?.socket?.remoteAddress) {
		return incoming.socket.remoteAddress;
	}

	return "unknown";
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
		const ip = resolveClientIp(c);

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
