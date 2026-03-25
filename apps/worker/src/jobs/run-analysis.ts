import { getAllAgents } from "@chief-mog/agents";
import { logger } from "@chief-mog/lib";
import type { RunAgentResult } from "./run-agent.js";
import { runAgent } from "./run-agent.js";

export interface RunAnalysisInput {
  projectId: string;
  agentId?: string;
}

export interface RunAnalysisResult {
  projectId: string;
  agentResults: RunAgentResult[];
  totalOpportunities: number;
}

export async function runAnalysis(input: RunAnalysisInput): Promise<RunAnalysisResult> {
  const { projectId, agentId } = input;
  const agents = agentId ? [{ id: agentId }] : getAllAgents().map((a) => ({ id: a.id }));

  logger.info(`Starting analysis for project ${projectId}`, {
    agentCount: agents.length,
  });

  const results: RunAgentResult[] = [];

  for (const agent of agents) {
    const result = await runAgent({ projectId, agentId: agent.id });
    results.push(result);
  }

  const totalOpportunities = results.reduce((sum, r) => sum + r.opportunityCount, 0);

  logger.info(`Analysis complete for project ${projectId}`, {
    totalOpportunities,
    completed: results.filter((r) => r.status === "completed").length,
    failed: results.filter((r) => r.status === "failed").length,
  });

  return { projectId, agentResults: results, totalOpportunities };
}
