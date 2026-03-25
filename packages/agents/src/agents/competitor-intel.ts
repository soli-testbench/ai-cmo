import { generateId } from "@chief-mog/lib";
import type { Opportunity } from "@chief-mog/types";
import type { Agent, AgentContext, AnalysisResult, IngestResult } from "../interface.js";
import { registerAgent } from "../registry.js";

class CompetitorIntelAgent implements Agent {
  id = "competitor-intel";
  name = "Competitor Intel";
  description =
    "Tracks competitor activities, pricing changes, product launches, and strategic movements to identify competitive advantages.";

  async ingest(context: AgentContext): Promise<IngestResult> {
    return {
      agentId: this.id,
      data: {
        competitors: context.competitors.map((c) => ({
          name: c.name,
          recentChanges: ["Updated pricing page", "Launched new feature"],
          trafficTrend: "declining",
        })),
        pricingChanges: [
          {
            competitor: "Competitor A",
            change: "Increased enterprise tier by 15%",
            date: "2026-03-15",
          },
        ],
        productLaunches: [
          { competitor: "Competitor B", product: "AI-powered analytics", date: "2026-03-10" },
        ],
        marketShare: {
          leader: "Competitor A",
          leaderShare: 0.32,
          yourShare: 0.12,
          totalCompetitors: 8,
        },
      },
      timestamp: new Date(),
    };
  }

  async analyze(context: AgentContext, _data: IngestResult): Promise<AnalysisResult> {
    return {
      agentId: this.id,
      insights: [
        `Competitor A recently increased enterprise pricing by 15%, creating a window for ${context.companyProfile.name} to capture price-sensitive enterprise customers with competitive positioning.`,
        `Competitor B launched AI-powered analytics, signaling a market shift toward AI features that ${context.companyProfile.name} should consider addressing in its roadmap.`,
        `Overall competitor traffic is declining across the sector, suggesting market consolidation and an opportunity to absorb dissatisfied users from weaker competitors.`,
      ],
      confidence: 0.88,
      metadata: {
        competitorsTracked: context.competitors.length || 2,
        pricingChanges: 1,
        productLaunches: 1,
        marketShareGap: 0.2,
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
        type: "competitor",
        title: "Competitor pricing increase opens enterprise market window",
        description:
          "Competitor A raised enterprise tier pricing by 15%, creating an immediate opportunity to target their price-sensitive enterprise customers with a compelling value proposition and migration incentives.",
        score: 91,
        metadata: {
          competitor: "Competitor A",
          priceIncrease: "15%",
          segment: "enterprise",
          urgency: "high",
        },
        status: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        projectId: context.projectId,
        agentId: this.id,
        type: "competitor",
        title: "Declining competitor traffic signals market consolidation opportunity",
        description:
          "Multiple competitors are experiencing declining web traffic, suggesting user dissatisfaction. Targeted campaigns aimed at competitor users could accelerate market share growth during this consolidation period.",
        score: 65,
        metadata: {
          affectedCompetitors: 3,
          avgTrafficDecline: "12%",
          timeframe: "last 90 days",
        },
        status: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async summarize(context: AgentContext, opportunities: Opportunity[]): Promise<string> {
    return `Competitor Intel analysis for ${context.companyProfile.name} identified ${opportunities.length} competitive opportunities. A major competitor's 15% enterprise price increase creates an immediate window for customer acquisition, while broader market consolidation with declining competitor traffic presents a longer-term growth opportunity. The competitive landscape is shifting, and proactive positioning could significantly improve market share from the current 12%.`;
  }
}

export const competitorIntelAgent = new CompetitorIntelAgent();
registerAgent(competitorIntelAgent);
