import type { Agent } from '@ai-cmo/agents';
import { getDb, opportunities } from '@ai-cmo/db';
import { createLogger } from '@ai-cmo/lib';

const log = createLogger('worker:agentExecution');

interface RunRecord {
  id: string;
  projectId: string;
}

/**
 * Execute a single agent against a project.
 * Runs the full agent lifecycle: ingest → analyze → generateOpportunities → summarize.
 */
export async function executeAgentRun(agent: Agent, run: RunRecord): Promise<void> {
  const context = {
    projectId: run.projectId,
    companyName: 'Unknown', // Would be fetched from DB in production
    industry: 'Unknown',
    description: 'Unknown',
  };

  log.info(`Executing agent ${agent.name} for project ${run.projectId}`);

  // Run agent lifecycle
  await agent.ingest(context);
  await agent.analyze(context);

  const newOpportunities = await agent.generateOpportunities(context);
  const summary = await agent.summarize(context);

  log.info(`Agent ${agent.name} found ${newOpportunities.length} opportunities: ${summary}`);

  // Persist opportunities
  const db = getDb();
  for (const opp of newOpportunities) {
    await db.insert(opportunities).values({
      ...opp,
      agentRunId: run.id,
    });
  }
}
