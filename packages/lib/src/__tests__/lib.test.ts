import { describe, expect, it, vi } from "vitest";
import {
  AppError,
  createLogger,
  generateId,
  NotFoundError,
  retry,
  sleep,
  UnauthorizedError,
  ValidationError,
} from "../index.js";

describe("Logger", () => {
  it("creates a logger with all methods", () => {
    const log = createLogger("test");
    expect(typeof log.debug).toBe("function");
    expect(typeof log.info).toBe("function");
    expect(typeof log.warn).toBe("function");
    expect(typeof log.error).toBe("function");
  });

  it("logs messages without throwing", () => {
    const log = createLogger("test");
    expect(() => log.info("test message")).not.toThrow();
    expect(() => log.error("error message", { code: 500 })).not.toThrow();
  });
});

describe("Error classes", () => {
  it("AppError has code, statusCode, message", () => {
    const err = new AppError("TEST_ERROR", 500, "test");
    expect(err.code).toBe("TEST_ERROR");
    expect(err.statusCode).toBe(500);
    expect(err.message).toBe("test");
    expect(err).toBeInstanceOf(Error);
  });

  it("NotFoundError defaults to 404", () => {
    const err = new NotFoundError();
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe("NOT_FOUND");
    expect(err).toBeInstanceOf(AppError);
  });

  it("ValidationError defaults to 400", () => {
    const err = new ValidationError();
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe("VALIDATION_ERROR");
  });

  it("UnauthorizedError defaults to 401", () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe("UNAUTHORIZED");
  });

  it("accepts custom messages", () => {
    const err = new NotFoundError("User not found");
    expect(err.message).toBe("User not found");
  });
});

describe("generateId", () => {
  it("returns a valid UUID v4", () => {
    const id = generateId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe("sleep", () => {
  it("delays execution", async () => {
    const start = Date.now();
    await sleep(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(40);
  });
});

describe("retry", () => {
  it("returns on first success", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const result = await retry(fn);
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries on failure then succeeds", async () => {
    const fn = vi.fn().mockRejectedValueOnce(new Error("fail")).mockResolvedValue("ok");
    const result = await retry(fn, { attempts: 3, delayMs: 10 });
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("throws after all attempts exhausted", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("always fail"));
    await expect(retry(fn, { attempts: 2, delayMs: 10 })).rejects.toThrow("always fail");
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
