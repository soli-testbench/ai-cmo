import { describe, expect, it, vi } from "vitest";

// Mock @chief-mog/db
const mockInsert = vi.fn().mockReturnValue({
  values: vi.fn().mockReturnValue({
    returning: vi.fn().mockResolvedValue([{ id: "00000000-0000-0000-0000-000000000000" }]),
  }),
});
const mockUpdate = vi.fn().mockReturnValue({
  set: vi.fn().mockReturnValue({
    where: vi.fn().mockResolvedValue(undefined),
  }),
});
vi.mock("@chief-mog/db", () => ({
  db: {
    insert: mockInsert,
    update: mockUpdate,
  },
  agentRuns: { id: "id" },
}));

// Mock drizzle-orm
vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));

// Mock @chief-mog/lib
vi.mock("@chief-mog/lib", () => ({
  generateId: () => "00000000-0000-0000-0000-000000000000",
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock @chief-mog/agents
vi.mock("@chief-mog/agents", () => {
  const mockAgent = {
    id: "test-agent",
    name: "Test Agent",
    description: "A test agent",
    ingest: vi.fn().mockResolvedValue({
      agentId: "test-agent",
      data: { test: true },
      timestamp: new Date(),
    }),
    analyze: vi.fn().mockResolvedValue({
      agentId: "test-agent",
      insights: ["test insight"],
      confidence: 0.85,
      metadata: {},
    }),
    generateOpportunities: vi.fn().mockResolvedValue([
      {
        id: "00000000-0000-0000-0000-000000000000",
        projectId: "project-1",
        agentId: "test-agent",
        type: "search",
        title: "Test Opportunity",
        description: "A test opportunity",
        score: 80,
        metadata: {},
        status: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
    summarize: vi.fn().mockResolvedValue("Test summary"),
  };

  return {
    getAgent: vi.fn((id: string) => (id === "test-agent" ? mockAgent : undefined)),
    getAllAgents: vi.fn(() => [mockAgent]),
  };
});

describe("runAgent", () => {
  it("should run an agent and return results", async () => {
    const { runAgent } = await import("../src/jobs/run-agent.js");
    const result = await runAgent({ projectId: "project-1", agentId: "test-agent" });
    expect(result.status).toBe("completed");
    expect(result.opportunityCount).toBe(1);
    expect(result.summary).toBe("Test summary");
  });

  it("should handle unknown agent", async () => {
    const { runAgent } = await import("../src/jobs/run-agent.js");
    const result = await runAgent({ projectId: "project-1", agentId: "unknown" });
    expect(result.status).toBe("failed");
    expect(result.error).toContain("not found");
  });
});

describe("runAnalysis", () => {
  it("should run analysis for all agents", async () => {
    const { runAnalysis } = await import("../src/jobs/run-analysis.js");
    const result = await runAnalysis({ projectId: "project-1" });
    expect(result.projectId).toBe("project-1");
    expect(result.agentResults.length).toBeGreaterThan(0);
    expect(result.totalOpportunities).toBeGreaterThan(0);
  });

  it("should run analysis for a specific agent", async () => {
    const { runAnalysis } = await import("../src/jobs/run-analysis.js");
    const result = await runAnalysis({ projectId: "project-1", agentId: "test-agent" });
    expect(result.agentResults).toHaveLength(1);
    expect(result.agentResults[0].agentId).toBe("test-agent");
  });
});
