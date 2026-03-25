import { UnauthorizedError } from "@chief-mog/lib";
import { createMiddleware } from "hono/factory";
import { decode, verify } from "hono/jwt";

/**
 * JWT authentication middleware.
 *
 * Required env vars:
 *   JWT_SECRET — HMAC secret used to verify token signatures (HS256).
 *
 * Optional env vars:
 *   JWT_ISSUER   — expected `iss` claim (rejected if present in token but mismatched).
 *   JWT_AUDIENCE — expected `aud` claim (rejected if present in token but mismatched).
 *
 * In development (NODE_ENV=development), a missing JWT_SECRET falls back to
 * "dev-only-secret" so the local dev loop works without extra setup.
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

	// Validate expiry
	if (typeof payload.exp === "number" && payload.exp < Math.floor(Date.now() / 1000)) {
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

function getJwtSecret(): string {
	const secret = process.env.JWT_SECRET;
	if (secret) return secret;

	if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
		return "dev-only-secret";
	}

	throw new Error("JWT_SECRET environment variable is required in non-development environments");
}
