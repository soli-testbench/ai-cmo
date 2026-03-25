import { Queue } from "bullmq";
import { logger } from "@chief-mog/lib";
import { createRedisConnection } from "../lib/redis.js";

export function setupScheduledJobs(): Queue {
  const connection = createRedisConnection();

  const scheduledQueue = new Queue("scheduled-daily", { connection });

  scheduledQueue
    .upsertJobScheduler("daily-analysis", {
      pattern: "0 6 * * *",
    }, {
      name: "daily-analysis",
      data: {},
    })
    .then(() => {
      logger.info("Scheduled daily analysis job (6:00 UTC)");
    })
    .catch((err) => {
      logger.error("Failed to schedule daily analysis", { error: String(err) });
    });

  return scheduledQueue;
}
