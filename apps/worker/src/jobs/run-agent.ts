import type { AgentContext } from "@chief-mog/agents";
import { getAgent } from "@chief-mog/agents";
import { generateId, logger } from "@chief-mog/lib";

export interface RunAgentInput {
  projectId: string;
  agentId: string;
}

export interface RunAgentResult {
  agentRunId: string;
  agentId: string;
  status: "completed" | "failed";
  opportunityCount: number;
  summary: string;
  error?: string;
}

export async function runAgent(input: RunAgentInput): Promise<RunAgentResult> {
  const { projectId, agentId } = input;
  const agent = getAgent(agentId);
  const agentRunId = generateId();

  if (!agent) {
    return {
      agentRunId,
      agentId,
      status: "failed",
      opportunityCount: 0,
      summary: "",
      error: `Agent ${agentId} not found`,
    };
  }

  // Mock context — in production would load from DB
  const context: AgentContext = {
    projectId,
    companyProfile: {
      id: generateId(),
      projectId,
      name: "Mock Company",
      industry: "Technology",
      description: "A mock company for testing",
      website: null,
      keywords: ["AI", "tech"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    competitors: [],
  };

  try {
    logger.info(`Running agent ${agentId}`, { projectId, agentRunId });
    const ingestResult = await agent.ingest(context);
    const analysisResult = await agent.analyze(context, ingestResult);
    const opportunities = await agent.generateOpportunities(context, analysisResult);
    const summary = await agent.summarize(context, opportunities);

    logger.info(`Agent ${agentId} completed`, {
      projectId,
      agentRunId,
      opportunityCount: opportunities.length,
    });

    return {
      agentRunId,
      agentId,
      status: "completed",
      opportunityCount: opportunities.length,
      summary,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error(`Agent ${agentId} failed`, { projectId, agentRunId, error: errorMessage });

    return {
      agentRunId,
      agentId,
      status: "failed",
      opportunityCount: 0,
      summary: "",
      error: errorMessage,
    };
  }
}
