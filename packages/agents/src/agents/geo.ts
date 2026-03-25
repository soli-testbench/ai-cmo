import type { Opportunity } from "@chief-mog/types";
import { generateId } from "@chief-mog/lib";
import type { Agent, AgentContext, AnalysisResult, IngestResult } from "../interface.js";
import { registerAgent } from "../registry.js";

class GeoAgent implements Agent {
  id = "geo";
  name = "Geo Agent";
  description = "Analyzes geographic market data to identify underserved regions and local market opportunities.";

  async ingest(context: AgentContext): Promise<IngestResult> {
    return {
      agentId: this.id,
      data: {
        regions: [
          { name: "Northeast US", penetration: 0.35, growth: 0.12 },
          { name: "Pacific Northwest", penetration: 0.18, growth: 0.22 },
          { name: "Midwest US", penetration: 0.08, growth: 0.31 },
        ],
        localListings: {
          total: 47,
          optimized: 19,
          missingInfo: 28,
        },
        competitorPresence: {
          strongRegions: ["Northeast US", "Southeast US"],
          weakRegions: ["Midwest US", "Pacific Northwest"],
        },
      },
      timestamp: new Date(),
    };
  }

  async analyze(context: AgentContext, data: IngestResult): Promise<AnalysisResult> {
    return {
      agentId: this.id,
      insights: [
        `Midwest US shows the lowest market penetration (8%) but the highest growth rate (31%), representing an untapped geographic opportunity for ${context.companyProfile.name}.`,
        `Local listing optimization is lagging with only 19 of 47 listings fully optimized, creating a gap in local search visibility across key markets.`,
      ],
      confidence: 0.75,
      metadata: {
        regionsAnalyzed: 3,
        avgPenetration: 0.2,
        listingCompleteness: 0.4,
      },
    };
  }

  async generateOpportunities(context: AgentContext, analysis: AnalysisResult): Promise<Opportunity[]> {
    return [
      {
        id: generateId(),
        projectId: context.projectId,
        agentId: this.id,
        type: "geo",
        title: "Geographic market gap in Midwest US with high growth potential",
        description:
          "The Midwest US region shows only 8% market penetration but a 31% growth rate, and competitors have minimal presence there. Expanding local marketing and listing optimization in this region could capture early market share before competitors move in.",
        score: 72,
        metadata: {
          region: "Midwest US",
          currentPenetration: 0.08,
          growthRate: 0.31,
          competitorPresence: "weak",
        },
        status: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async summarize(context: AgentContext, opportunities: Opportunity[]): Promise<string> {
    return `Geo analysis for ${context.companyProfile.name} uncovered ${opportunities.length} geographic opportunity. The Midwest US region stands out as a high-growth market with minimal competitor presence and low current penetration. Additionally, local listing optimization across all regions needs attention, with over half of listings missing key information that affects local search rankings.`;
  }
}

export const geoAgent = new GeoAgent();
registerAgent(geoAgent);
