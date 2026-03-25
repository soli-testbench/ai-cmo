import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

const AUTH_HEADER = { Authorization: "Bearer test-token" };

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
});

describe("Projects", () => {
  it("GET /api/projects returns 200 with array", async () => {
    const res = await app.request("/api/projects", { headers: AUTH_HEADER });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  it("POST /api/projects creates project", async () => {
    const res = await app.request("/api/projects", {
      method: "POST",
      headers: { ...AUTH_HEADER, "Content-Type": "application/json" },
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
      headers: { ...AUTH_HEADER, "Content-Type": "application/json" },
      body: JSON.stringify({ name: "" }),
    });
    expect(res.status).toBe(400);
  });

  it("GET /api/projects/:id returns project", async () => {
    const res = await app.request("/api/projects/00000000-0000-0000-0000-000000000001", {
      headers: AUTH_HEADER,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe("Acme Corp AI Strategy");
  });

  it("GET /api/projects/:id returns 404 for unknown", async () => {
    const res = await app.request("/api/projects/nonexistent", {
      headers: AUTH_HEADER,
    });
    expect(res.status).toBe(404);
  });
});

describe("Analysis", () => {
  it("POST /api/projects/:id/analyze returns queued status", async () => {
    const res = await app.request("/api/projects/00000000-0000-0000-0000-000000000001/analyze", {
      method: "POST",
      headers: AUTH_HEADER,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("queued");
    expect(body.jobId).toBeTruthy();
  });
});

describe("Opportunities", () => {
  it("GET /api/projects/:id/opportunities returns array", async () => {
    const res = await app.request("/api/projects/00000000-0000-0000-0000-000000000001/opportunities", {
      headers: AUTH_HEADER,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });
});
