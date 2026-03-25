import { generateId } from "@chief-mog/lib";
import type { Opportunity } from "@chief-mog/types";
import type { Agent, AgentContext, AnalysisResult, IngestResult } from "../interface.js";
import { registerAgent } from "../registry.js";

class ContentFoundryAgent implements Agent {
  id = "content-foundry";
  name = "Content Foundry";
  description =
    "Identifies content gaps and opportunities by analyzing existing content performance and market demand.";

  async ingest(context: AgentContext): Promise<IngestResult> {
    return {
      agentId: this.id,
      data: {
        existingContent: {
          blogPosts: 23,
          landingPages: 8,
          caseStudies: 3,
          avgEngagement: 0.034,
        },
        contentGaps: [
          {
            topic: `${context.companyProfile.industry} best practices`,
            demand: "high",
            competition: "medium",
          },
          { topic: "ROI calculator", demand: "medium", competition: "low" },
          { topic: "Integration guides", demand: "high", competition: "high" },
        ],
        topPerforming: [
          { title: "Getting Started Guide", views: 15200, conversions: 89 },
          { title: "Industry Report 2025", views: 8400, conversions: 42 },
        ],
      },
      timestamp: new Date(),
    };
  }

  async analyze(context: AgentContext, _data: IngestResult): Promise<AnalysisResult> {
    return {
      agentId: this.id,
      insights: [
        `Content gap analysis reveals high demand for "${context.companyProfile.industry} best practices" content with only medium competition, representing a strong opportunity for thought leadership positioning.`,
        `Current content engagement rate of 3.4% is below industry average of 5.2%, suggesting existing content needs optimization alongside new content creation.`,
      ],
      confidence: 0.8,
      metadata: {
        contentPiecesAnalyzed: 34,
        gapsIdentified: 3,
        avgEngagementRate: 0.034,
        industryBenchmark: 0.052,
      },
    };
  }

  async generateOpportunities(
    context: AgentContext,
    _analysis: AnalysisResult,
  ): Promise<Opportunity[]> {
    return [
      {
        id: generateId(),
        projectId: context.projectId,
        agentId: this.id,
        type: "content",
        title: "Content gap in industry best practices with high search demand",
        description:
          "There is significant search demand for best practices content in the target industry with only moderate competition. Creating a comprehensive best practices guide series could establish thought leadership and drive consistent organic traffic.",
        score: 77,
        metadata: {
          topic: `${context.companyProfile.industry} best practices`,
          demandLevel: "high",
          competitionLevel: "medium",
          estimatedMonthlyTraffic: 4200,
        },
        status: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async summarize(context: AgentContext, opportunities: Opportunity[]): Promise<string> {
    return `Content Foundry analysis for ${context.companyProfile.name} identified ${opportunities.length} content opportunity. A significant gap exists in ${context.companyProfile.industry} best practices content where demand is high but competition is moderate. Current content engagement at 3.4% is below the industry benchmark of 5.2%, indicating room for improvement in both new content creation and optimization of existing pieces.`;
  }
}

export const contentFoundryAgent = new ContentFoundryAgent();
registerAgent(contentFoundryAgent);
