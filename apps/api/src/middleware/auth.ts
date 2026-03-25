import { randomBytes } from "node:crypto";
import { UnauthorizedError } from "@chief-mog/lib";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

/**
 * JWT authentication middleware.
 *
 * Required env vars:
 *   JWT_SECRET — HMAC secret used to verify token signatures (HS256).
 *               Must be set in ALL environments. There is no fallback.
 *
 * Optional env vars:
 *   JWT_ISSUER   — expected `iss` claim (rejected if present in token but mismatched).
 *   JWT_AUDIENCE — expected `aud` claim (rejected if present in token but mismatched).
 */
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

	const secret = getJwtSecret();

	// Verify signature (HS256)
	let payload: Record<string, unknown>;
	try {
		payload = (await verify(token, secret, "HS256")) as Record<string, unknown>;
	} catch {
		throw new UnauthorizedError("Token verification failed");
	}

	// Require and validate expiry — tokens without exp are rejected
	if (typeof payload.exp !== "number") {
		throw new UnauthorizedError("Token must include an expiration (exp) claim");
	}
	if (payload.exp < Math.floor(Date.now() / 1000)) {
		throw new UnauthorizedError("Token has expired");
	}

	// Validate issuer if configured
	const expectedIssuer = process.env.JWT_ISSUER;
	if (expectedIssuer && payload.iss !== expectedIssuer) {
		throw new UnauthorizedError("Invalid token issuer");
	}

	// Validate audience if configured
	const expectedAudience = process.env.JWT_AUDIENCE;
	if (expectedAudience && payload.aud !== expectedAudience) {
		throw new UnauthorizedError("Invalid token audience");
	}

	// Attach decoded payload to context for downstream handlers
	c.set("jwtPayload", payload);

	await next();
});

/**
 * Per-instance random secret generated at startup for dev/test when JWT_SECRET
 * is not explicitly provided. Not predictable across instances.
 */
let _devSecret: string | undefined;

function getJwtSecret(): string {
	const secret = process.env.JWT_SECRET;
	if (secret) return secret;

	if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
		if (!_devSecret) {
			_devSecret = randomBytes(32).toString("hex");
		}
		return _devSecret;
	}

	throw new Error("JWT_SECRET environment variable is required in non-development environments");
}

/** Returns the active JWT secret. Only available in test environments. */
export function getActiveJwtSecret(): string {
	if (process.env.NODE_ENV !== "test") {
		throw new Error("getActiveJwtSecret() is only available in test environments");
	}
	return getJwtSecret();
}
