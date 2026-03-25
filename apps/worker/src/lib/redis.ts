import { logger } from "@chief-mog/lib";
import type { ConnectionOptions } from "bullmq";
import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export function createRedisConnection(): ConnectionOptions {
  const url = new URL(redisUrl);
  const opts: Record<string, unknown> = {
    host: url.hostname,
    port: Number(url.port) || 6379,
    maxRetriesPerRequest: null,
  };
  if (url.username) opts.username = decodeURIComponent(url.username);
  if (url.password) opts.password = decodeURIComponent(url.password);
  if (url.protocol === "rediss:") opts.tls = {};
  const dbIndex = url.pathname.replace("/", "");
  if (dbIndex) opts.db = Number(dbIndex);

  const connection = new IORedis(opts as ConstructorParameters<typeof IORedis>[0]);

  connection.on("connect", () => {
    logger.info("Redis connected");
  });

  connection.on("error", (err) => {
    logger.error("Redis connection error", { error: String(err) });
  });

  return connection as unknown as ConnectionOptions;
}
