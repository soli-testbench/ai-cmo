import type { ConnectionOptions } from "bullmq";
import { Queue } from "bullmq";

let analysisQueue: Queue | undefined;

export function getAnalysisQueue(): Queue {
  if (!analysisQueue) {
    analysisQueue = new Queue("analysis", {
      connection: parseRedisUrl(process.env.REDIS_URL || "redis://localhost:6379"),
    });
  }
  return analysisQueue;
}

function parseRedisUrl(redisUrl: string): ConnectionOptions {
  const url = new URL(redisUrl);
  const opts: ConnectionOptions = {
    host: url.hostname,
    port: Number(url.port) || 6379,
  };
  if (url.username) opts.username = decodeURIComponent(url.username);
  if (url.password) opts.password = decodeURIComponent(url.password);
  if (url.protocol === "rediss:") opts.tls = {};
  const dbIndex = url.pathname.replace("/", "");
  if (dbIndex) opts.db = Number(dbIndex);
  return opts;
}
