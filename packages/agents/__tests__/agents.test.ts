import { describe, expect, it } from "vitest";
import { getAllAgents, getAgent } from "../src/index.js";

// Mock generateId to avoid crypto dependency issues in test
import { vi } from "vitest";
vi.mock("@chief-mog/lib", () => ({
  generateId: () => "00000000-0000-0000-0000-000000000000",
}));

// Re-import after mock
const { getAllAgents: getAll, getAgent: get } = await import("../src/index.js");

describe("Agent Registry", () => {
  it("should have 5 registered agents", () => {
    const agents = getAll();
    expect(agents).toHaveLength(5);
  });

  it("should find each agent by id", () => {
    const ids = ["search-mog", "geo", "reddit-mog", "competitor-intel", "content-foundry"];
    for (const id of ids) {
      expect(get(id)).toBeDefined();
    }
  });
});

describe("Agent Interface Compliance", () => {
  const mockContext = {
    projectId: "00000000-0000-0000-0000-000000000001",
    companyProfile: {
      id: "00000000-0000-0000-0000-000000000002",
      projectId: "00000000-0000-0000-0000-000000000001",
      name: "Test Corp",
      industry: "Technology",
      description: "A test company",
      website: null,
      keywords: ["test"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    competitors: [],
  };

  const agents = getAllAgents();

  for (const agent of agents) {
    describe(agent.name, () => {
      it("should have required properties", () => {
        expect(agent.id).toBeTruthy();
        expect(agent.name).toBeTruthy();
        expect(agent.description).toBeTruthy();
      });

      it("should implement ingest", async () => {
        const result = await agent.ingest(mockContext);
        expect(result.agentId).toBe(agent.id);
        expect(result.data).toBeDefined();
        expect(result.timestamp).toBeInstanceOf(Date);
      });

      it("should implement analyze", async () => {
        const ingestResult = await agent.ingest(mockContext);
        const result = await agent.analyze(mockContext, ingestResult);
        expect(result.agentId).toBe(agent.id);
        expect(result.insights.length).toBeGreaterThan(0);
        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
      });

      it("should implement generateOpportunities", async () => {
        const ingestResult = await agent.ingest(mockContext);
        const analysisResult = await agent.analyze(mockContext, ingestResult);
        const opportunities = await agent.generateOpportunities(mockContext, analysisResult);
        expect(opportunities.length).toBeGreaterThan(0);
        for (const opp of opportunities) {
          expect(opp.projectId).toBe(mockContext.projectId);
          expect(opp.agentId).toBe(agent.id);
          expect(opp.title).toBeTruthy();
          expect(opp.score).toBeGreaterThanOrEqual(0);
          expect(opp.score).toBeLessThanOrEqual(100);
        }
      });

      it("should implement summarize", async () => {
        const ingestResult = await agent.ingest(mockContext);
        const analysisResult = await agent.analyze(mockContext, ingestResult);
        const opportunities = await agent.generateOpportunities(mockContext, analysisResult);
        const summary = await agent.summarize(mockContext, opportunities);
        expect(typeof summary).toBe("string");
        expect(summary.length).toBeGreaterThan(0);
      });
    });
  }
});
