import { describe, expect, it } from "vitest";
import { envSchema } from "../index.js";

describe("envSchema", () => {
  it("validates correct environment", () => {
    const result = envSchema.safeParse({
      NODE_ENV: "development",
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/chief_mog",
      REDIS_URL: "redis://localhost:6379",
      API_PORT: "3001",
      WEB_PORT: "3000",
      WORKER_CONCURRENCY: "5",
      LOG_LEVEL: "debug",
    });
    expect(result.success).toBe(true);
  });

  it("applies defaults for optional fields", () => {
    const result = envSchema.safeParse({
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/chief_mog",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.NODE_ENV).toBe("development");
      expect(result.data.REDIS_URL).toBe("redis://localhost:6379");
      expect(result.data.API_PORT).toBe(3001);
      expect(result.data.WEB_PORT).toBe(3000);
      expect(result.data.WORKER_CONCURRENCY).toBe(5);
      expect(result.data.LOG_LEVEL).toBe("info");
    }
  });

  it("rejects missing DATABASE_URL", () => {
    const result = envSchema.safeParse({
      NODE_ENV: "development",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid NODE_ENV", () => {
    const result = envSchema.safeParse({
      NODE_ENV: "staging",
      DATABASE_URL: "postgresql://localhost:5432/test",
    });
    expect(result.success).toBe(false);
  });

  it("coerces string ports to numbers", () => {
    const result = envSchema.safeParse({
      DATABASE_URL: "postgresql://localhost:5432/test",
      API_PORT: "8080",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.API_PORT).toBe(8080);
    }
  });
});
