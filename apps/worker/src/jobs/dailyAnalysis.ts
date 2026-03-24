import { getDb, projects, agentRuns } from '@ai-cmo/db';
import { createLogger } from '@ai-cmo/lib';

const log = createLogger('worker:dailyAnalysis');

/**
 * Queue daily analysis jobs for all active projects.
 * Called by the scheduler on a daily interval.
 */
export async function queueDailyAnalysis(): Promise<void> {
  const db = getDb();
  const allProjects = await db.select().from(projects);

  log.info(`Queueing daily analysis for ${allProjects.length} project(s)`);

  for (const project of allProjects) {
    const runId = crypto.randomUUID();
    await db.insert(agentRuns).values({
      id: runId,
      projectId: project.id,
      agentName: 'all',
      status: 'pending',
    });

    log.info(`Queued daily analysis run ${runId} for project ${project.id}`);
  }
}
