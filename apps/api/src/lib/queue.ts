import { Queue } from "bullmq";

let analysisQueue: Queue | undefined;

export function getAnalysisQueue(): Queue {
  if (!analysisQueue) {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    const url = new URL(redisUrl);
    analysisQueue = new Queue("analysis", {
      connection: {
        host: url.hostname,
        port: Number(url.port) || 6379,
      },
    });
  }
  return analysisQueue;
}
