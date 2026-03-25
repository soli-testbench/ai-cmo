import { logger } from "@chief-mog/lib";
import type { Job } from "bullmq";
import { Worker } from "bullmq";
import type { RunAnalysisInput, RunAnalysisResult } from "../jobs/run-analysis.js";
import { runAnalysis } from "../jobs/run-analysis.js";
import { createRedisConnection } from "../lib/redis.js";

export function createAnalysisWorker(): Worker<RunAnalysisInput, RunAnalysisResult> {
  const connection = createRedisConnection();

  const worker = new Worker<RunAnalysisInput, RunAnalysisResult>(
    "analysis",
    async (job: Job<RunAnalysisInput>) => {
      logger.info(`Processing analysis job ${job.id}`, { data: job.data });
      return runAnalysis(job.data);
    },
    {
      connection,
      concurrency: Number(process.env.WORKER_CONCURRENCY) || 5,
    },
  );

  worker.on("completed", (job) => {
    logger.info(`Analysis job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`Analysis job ${job?.id} failed`, { error: String(err) });
  });

  return worker;
}
