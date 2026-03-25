import type { Opportunity } from "@chief-mog/types";
import { generateId } from "@chief-mog/lib";
import type { Agent, AgentContext, AnalysisResult, IngestResult } from "../interface.js";
import { registerAgent } from "../registry.js";

class SearchMogAgent implements Agent {
  id = "search-mog";
  name = "Search MOG";
  description = "Monitors search trends and identifies opportunities based on rising queries and keyword gaps.";

  async ingest(context: AgentContext): Promise<IngestResult> {
    return {
      agentId: this.id,
      data: {
        trendingQueries: [
          { query: `${context.companyProfile.name} alternatives`, volume: 12400, trend: "rising" },
          { query: `${context.companyProfile.industry} best tools`, volume: 8900, trend: "stable" },
          { query: `${context.companyProfile.industry} solutions 2026`, volume: 5600, trend: "rising" },
        ],
        keywordGaps: ["enterprise solution", "integration platform", "workflow automation"],
        searchVisibility: 0.42,
      },
      timestamp: new Date(),
    };
  }

  async analyze(context: AgentContext, data: IngestResult): Promise<AnalysisResult> {
    return {
      agentId: this.id,
      insights: [
        `Rising search volume detected for "${context.companyProfile.name} alternatives" with 12,400 monthly searches, indicating growing market interest.`,
        `Keyword gap analysis reveals untapped opportunities in "enterprise solution" and "workflow automation" categories relevant to ${context.companyProfile.industry}.`,
      ],
      confidence: 0.82,
      metadata: {
        queriesAnalyzed: 3,
        gapsFound: 3,
        avgSearchVolume: 8967,
      },
    };
  }

  async generateOpportunities(context: AgentContext, analysis: AnalysisResult): Promise<Opportunity[]> {
    return [
      {
        id: generateId(),
        projectId: context.projectId,
        agentId: this.id,
        type: "search",
        title: "Rising search trends indicate growing demand for alternative solutions",
        description:
          "Search volume for alternative solutions in your industry is increasing steadily. Creating targeted content around these queries could capture significant organic traffic and position your brand as the preferred choice.",
        score: 85,
        metadata: {
          topQuery: `${context.companyProfile.name} alternatives`,
          monthlyVolume: 12400,
          trendDirection: "rising",
        },
        status: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async summarize(context: AgentContext, opportunities: Opportunity[]): Promise<string> {
    return `Search MOG analysis for ${context.companyProfile.name} identified ${opportunities.length} opportunity based on current search trends. Rising query volumes suggest growing market interest in alternative solutions within the ${context.companyProfile.industry} space. Targeting high-volume keyword gaps around enterprise solutions and workflow automation could significantly improve organic visibility and capture demand from competitors.`;
  }
}

export const searchMogAgent = new SearchMogAgent();
registerAgent(searchMogAgent);
