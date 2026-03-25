import IORedis from "ioredis";
import { logger } from "@chief-mog/lib";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export function createRedisConnection(): IORedis {
  const url = new URL(redisUrl);
  const connection = new IORedis({
    host: url.hostname,
    port: Number(url.port) || 6379,
    maxRetriesPerRequest: null,
  });

  connection.on("connect", () => {
    logger.info("Redis connected");
  });

  connection.on("error", (err) => {
    logger.error("Redis connection error", { error: String(err) });
  });

  return connection;
}
