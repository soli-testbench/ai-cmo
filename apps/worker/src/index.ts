import { createLogger } from '@ai-cmo/lib';
import { getConfig } from '@ai-cmo/config';
import { processJobs } from './jobs/manualAnalysis.js';
import { startScheduler } from './scheduler.js';

const log = createLogger('worker');
const config = getConfig();

async function main() {
  log.info('Worker starting...');

  // Start the scheduled daily analysis loop
  startScheduler();

  // Start the job polling loop
  const pollInterval = config.WORKER_POLL_INTERVAL_MS;
  log.info(`Polling for jobs every ${pollInterval}ms`);

  const poll = async () => {
    try {
      await processJobs();
    } catch (err) {
      log.error('Job processing error', { error: String(err) });
    }
    setTimeout(poll, pollInterval);
  };

  await poll();
}

main().catch((err) => {
  log.error('Worker failed to start', { error: String(err) });
  process.exit(1);
});
