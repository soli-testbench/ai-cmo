import { logger } from "@chief-mog/lib";
import { createAnalysisWorker } from "./workers/analysis.js";

let analysisWorker: ReturnType<typeof createAnalysisWorker> | undefined;

async function start() {
  logger.info("Starting worker process...");

  try {
    analysisWorker = createAnalysisWorker();
    logger.info("Analysis worker started");
  } catch (err) {
    logger.error("Failed to start workers", { error: String(err) });
    process.exit(1);
  }
}

async function shutdown() {
  logger.info("Shutting down workers...");
  if (analysisWorker) {
    await analysisWorker.close();
  }
  logger.info("Workers shut down");
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

start();
