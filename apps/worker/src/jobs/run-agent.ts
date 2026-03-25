import type { AgentContext } from "@chief-mog/agents";
import { getAgent } from "@chief-mog/agents";
import { agentRuns, db } from "@chief-mog/db";
import { generateId, logger } from "@chief-mog/lib";
import { eq } from "drizzle-orm";

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

  // Create DB record in "pending" state
  const [inserted] = await db
    .insert(agentRuns)
    .values({ projectId, agentId, status: "pending" })
    .returning({ id: agentRuns.id });
  const agentRunId = inserted.id;

  if (!agent) {
    await db
      .update(agentRuns)
      .set({ status: "failed", error: `Agent ${agentId} not found`, completedAt: new Date() })
      .where(eq(agentRuns.id, agentRunId));
    return {
      agentRunId,
      agentId,
      status: "failed",
      opportunityCount: 0,
      summary: "",
      error: `Agent ${agentId} not found`,
    };
  }

  // Mark as "running"
  await db.update(agentRuns).set({ status: "running" }).where(eq(agentRuns.id, agentRunId));

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

    // Mark as "completed" with result
    await db
      .update(agentRuns)
      .set({
        status: "completed",
        completedAt: new Date(),
        result: { opportunityCount: opportunities.length, summary },
      })
      .where(eq(agentRuns.id, agentRunId));

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

    // Mark as "failed" with error
    await db
      .update(agentRuns)
      .set({ status: "failed", completedAt: new Date(), error: errorMessage })
      .where(eq(agentRuns.id, agentRunId));

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
