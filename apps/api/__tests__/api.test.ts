import { beforeAll, describe, expect, it } from "vitest";
import { sign } from "hono/jwt";
import { app } from "../src/app.js";
import { getActiveJwtSecret } from "../src/middleware/auth.js";

let validToken: string;

beforeAll(async () => {
	process.env.NODE_ENV = "test";
	const secret = getActiveJwtSecret();
	validToken = await sign(
		{ sub: "test-user", iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 },
		secret,
		"HS256",
	);
});

function authHeader() {
	return { Authorization: `Bearer ${validToken}` };
}

describe("Health", () => {
	it("GET /health returns 200", async () => {
		const res = await app.request("/health");
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.status).toBe("ok");
	});
});

describe("Auth", () => {
	it("GET /api/projects without auth returns 401", async () => {
		const res = await app.request("/api/projects");
		expect(res.status).toBe(401);
	});

	it("rejects arbitrary non-JWT bearer tokens", async () => {
		const res = await app.request("/api/projects", {
			headers: { Authorization: "Bearer some-arbitrary-string" },
		});
		expect(res.status).toBe(401);
		const body = await res.json();
		expect(body.error.message).toContain("Token verification failed");
	});

	it("rejects expired JWT tokens", async () => {
		const secret = getActiveJwtSecret();
		const expiredToken = await sign(
			{ sub: "test-user", iat: Math.floor(Date.now() / 1000) - 7200, exp: Math.floor(Date.now() / 1000) - 3600 },
			secret,
			"HS256",
		);
		const res = await app.request("/api/projects", {
			headers: { Authorization: `Bearer ${expiredToken}` },
		});
		expect(res.status).toBe(401);
	});

	it("rejects tokens signed with wrong secret", async () => {
		const badToken = await sign(
			{ sub: "test-user", exp: Math.floor(Date.now() / 1000) + 3600 },
			"wrong-secret",
			"HS256",
		);
		const res = await app.request("/api/projects", {
			headers: { Authorization: `Bearer ${badToken}` },
		});
		expect(res.status).toBe(401);
		const body = await res.json();
		expect(body.error.message).toContain("Token verification failed");
	});

	it("accepts valid JWT tokens", async () => {
		const res = await app.request("/api/projects", {
			headers: authHeader(),
		});
		expect(res.status).toBe(200);
	});
});

describe("Projects", () => {
	it("GET /api/projects returns 200 with array", async () => {
		const res = await app.request("/api/projects", { headers: authHeader() });
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(Array.isArray(body)).toBe(true);
	});

	it("POST /api/projects creates project", async () => {
		const res = await app.request("/api/projects", {
			method: "POST",
			headers: { ...authHeader(), "Content-Type": "application/json" },
			body: JSON.stringify({ name: "Test Project", description: "A test" }),
		});
		expect(res.status).toBe(201);
		const body = await res.json();
		expect(body.name).toBe("Test Project");
		expect(body.id).toBeTruthy();
	});

	it("POST /api/projects with invalid body returns 400", async () => {
		const res = await app.request("/api/projects", {
			method: "POST",
			headers: { ...authHeader(), "Content-Type": "application/json" },
			body: JSON.stringify({ name: "" }),
		});
		expect(res.status).toBe(400);
	});

	it("GET /api/projects/:id returns project", async () => {
		const res = await app.request("/api/projects/00000000-0000-0000-0000-000000000001", {
			headers: authHeader(),
		});
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.name).toBe("Acme Corp AI Strategy");
	});

	it("GET /api/projects/:id returns 404 for unknown", async () => {
		const res = await app.request("/api/projects/nonexistent", {
			headers: authHeader(),
		});
		expect(res.status).toBe(404);
	});
});

describe("Analysis", () => {
	it("POST /api/projects/:id/analyze returns queued status", async () => {
		const res = await app.request("/api/projects/00000000-0000-0000-0000-000000000001/analyze", {
			method: "POST",
			headers: authHeader(),
		});
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.status).toBe("queued");
		expect(body.jobId).toBeTruthy();
	});
});

describe("Opportunities", () => {
	it("GET /api/projects/:id/opportunities returns array", async () => {
		const res = await app.request(
			"/api/projects/00000000-0000-0000-0000-000000000001/opportunities",
			{ headers: authHeader() },
		);
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(Array.isArray(body)).toBe(true);
		expect(body.length).toBeGreaterThan(0);
	});
});
