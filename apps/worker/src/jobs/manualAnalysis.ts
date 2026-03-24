import { eq } from 'drizzle-orm';
import { getDb, agentRuns } from '@ai-cmo/db';
import { getAllAgents } from '@ai-cmo/agents';
import { createLogger } from '@ai-cmo/lib';
import { executeAgentRun } from './agentExecution.js';

const log = createLogger('worker:manualAnalysis');

/**
 * Poll the database for pending agent runs and process them.
 */
export async function processJobs(): Promise<void> {
  const db = getDb();

  const pendingRuns = await db
    .select()
    .from(agentRuns)
    .where(eq(agentRuns.status, 'pending'))
    .limit(10);

  if (pendingRuns.length === 0) {
    return;
  }

  log.info(`Found ${pendingRuns.length} pending job(s)`);

  for (const run of pendingRuns) {
    try {
      // Mark as running
      await db.update(agentRuns).set({ status: 'running' }).where(eq(agentRuns.id, run.id));

      // Determine which agents to run
      const agents =
        run.agentName === 'all'
          ? getAllAgents()
          : getAllAgents().filter((a) => a.name === run.agentName);

      for (const agent of agents) {
        await executeAgentRun(agent, run);
      }

      // Mark as completed
      await db
        .update(agentRuns)
        .set({
          status: 'completed',
          completedAt: new Date(),
          resultSummary: `Executed ${agents.length} agent(s) successfully`,
        })
        .where(eq(agentRuns.id, run.id));

      log.info(`Job ${run.id} completed`);
    } catch (err) {
      log.error(`Job ${run.id} failed`, { error: String(err) });

      // Mark as failed with retry logic
      const shouldRetry = run.status !== 'retrying';
      await db
        .update(agentRuns)
        .set({
          status: shouldRetry ? 'retrying' : 'failed',
          errorMessage: String(err),
        })
        .where(eq(agentRuns.id, run.id));
    }
  }
}
