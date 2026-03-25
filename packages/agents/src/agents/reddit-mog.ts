import type { Opportunity } from "@chief-mog/types";
import { generateId } from "@chief-mog/lib";
import type { Agent, AgentContext, AnalysisResult, IngestResult } from "../interface.js";
import { registerAgent } from "../registry.js";

class RedditMogAgent implements Agent {
  id = "reddit-mog";
  name = "Reddit MOG";
  description = "Monitors Reddit discussions to identify brand mentions, sentiment trends, and community-driven opportunities.";

  async ingest(context: AgentContext): Promise<IngestResult> {
    return {
      agentId: this.id,
      data: {
        subreddits: [
          { name: `r/${context.companyProfile.industry.toLowerCase()}`, subscribers: 245000, relevantPosts: 12 },
          { name: "r/startups", subscribers: 890000, relevantPosts: 5 },
        ],
        mentions: {
          total: 34,
          positive: 18,
          neutral: 11,
          negative: 5,
        },
        topDiscussions: [
          { title: "Best tools for small teams?", upvotes: 342, comments: 89 },
          { title: "Frustrated with current solutions", upvotes: 187, comments: 56 },
        ],
      },
      timestamp: new Date(),
    };
  }

  async analyze(context: AgentContext, data: IngestResult): Promise<AnalysisResult> {
    return {
      agentId: this.id,
      insights: [
        `Reddit discussions show a growing frustration with existing ${context.companyProfile.industry} solutions, with 187+ upvotes on complaint threads indicating unmet user needs.`,
        `Brand sentiment on Reddit is net positive (53% positive, 32% neutral, 15% negative) but engagement in relevant subreddits remains low, missing an organic community-building opportunity.`,
      ],
      confidence: 0.78,
      metadata: {
        subredditsMonitored: 2,
        totalMentions: 34,
        sentimentScore: 0.53,
      },
    };
  }

  async generateOpportunities(context: AgentContext, analysis: AnalysisResult): Promise<Opportunity[]> {
    return [
      {
        id: generateId(),
        projectId: context.projectId,
        agentId: this.id,
        type: "reddit",
        title: "Reddit community engagement opportunity in frustrated user threads",
        description:
          "High-engagement Reddit threads reveal user frustration with existing solutions. Participating authentically in these discussions and addressing pain points could drive organic brand awareness and position the company as a responsive, community-focused alternative.",
        score: 68,
        metadata: {
          topThreadUpvotes: 342,
          relevantSubreddits: 2,
          sentimentBreakdown: { positive: 18, neutral: 11, negative: 5 },
        },
        status: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async summarize(context: AgentContext, opportunities: Opportunity[]): Promise<string> {
    return `Reddit MOG analysis for ${context.companyProfile.name} found ${opportunities.length} community engagement opportunity. Active discussions in relevant subreddits indicate user frustration with current ${context.companyProfile.industry} solutions. Brand sentiment is net positive but community participation is low, presenting an opportunity for authentic engagement that could drive organic growth and improve brand perception.`;
  }
}

export const redditMogAgent = new RedditMogAgent();
registerAgent(redditMogAgent);
