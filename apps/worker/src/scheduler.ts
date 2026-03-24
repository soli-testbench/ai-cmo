import { createLogger } from '@ai-cmo/lib';

const log = createLogger('worker:scheduler');

const DAILY_INTERVAL_MS = 24 * 60 * 60 * 1000;

/**
 * Start the daily scheduled analysis.
 * In production, this would use a proper cron library or OS-level scheduler.
 * For now, it sets up a simple interval.
 */
export function startScheduler(): void {
  log.info('Daily scheduler started (mock — runs every 24h)');

  setInterval(() => {
    log.info('Daily scheduled analysis triggered');
    // In production: queue daily analysis jobs for all active projects
  }, DAILY_INTERVAL_MS);
}
