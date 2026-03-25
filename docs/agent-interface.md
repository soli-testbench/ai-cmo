# Agent Interface

This document describes the agent contract, lifecycle, and instructions for creating new agents in the Chief MOG Officer platform.

## Agent Contract

Every agent implements the `Agent` interface:

```typescript
interface AgentContext {
  projectId: string;
  companyProfile: CompanyProfile;
  narrativeModel: NarrativeModel;
  competitors: CompetitorProfile[];
  config: Record<string, unknown>;
}

interface IngestResult {
  source: string;
  rawData: unknown[];
  fetchedAt: Date;
}

interface AnalysisResult {
  insights: string[];
  relevanceScores: Map<string, number>;
  metadata: Record<string, unknown>;
}

interface GeneratedOpportunity {
  type: "search" | "geo" | "reddit" | "competitor" | "content";
  title: string;
  description: string;
  score: number; // 0-100
  metadata: Record<string, unknown>;
}

interface AgentSummary {
  agentId: string;
  runId: string;
  opportunityCount: number;
  topOpportunities: GeneratedOpportunity[];
  executionTimeMs: number;
  summary: string;
}

interface Agent {
  id: string;
  name: string;
  description: string;

  ingest(ctx: AgentContext): Promise<IngestResult>;
  analyze(ctx: AgentContext, data: IngestResult): Promise<AnalysisResult>;
  generateOpportunities(ctx: AgentContext, analysis: AnalysisResult): Promise<GeneratedOpportunity[]>;
  summarize(ctx: AgentContext, opportunities: GeneratedOpportunity[]): Promise<AgentSummary>;
}
```

## Agent Lifecycle

Each agent run follows a four-phase lifecycle:

```
  +----------+     +----------+     +-----------------------+     +-----------+
  |  ingest  | --> | analyze  | --> | generateOpportunities | --> | summarize |
  +----------+     +----------+     +-----------------------+     +-----------+
```

### Phase 1: Ingest

The agent fetches raw data from its designated source (search engine results, geo-location APIs, Reddit threads, competitor websites, content feeds, etc.).

- **Input**: `AgentContext` containing the project's company profile, narrative model, and competitor list.
- **Output**: `IngestResult` with the source identifier, raw data array, and fetch timestamp.
- **Error handling**: If the data source is unavailable, the agent should throw with a descriptive error. The worker marks the run as `failed`.

### Phase 2: Analyze

The agent processes the raw data, looking for patterns, trends, and signals relevant to the project.

- **Input**: `AgentContext` and the `IngestResult` from Phase 1.
- **Output**: `AnalysisResult` with extracted insights, relevance scores, and metadata.
- **Key behavior**: Insights should be concise, actionable strings. Relevance scores map data-item keys to a 0-100 scale.

### Phase 3: Generate Opportunities

The agent converts its analysis into structured `Opportunity` records ready for persistence.

- **Input**: `AgentContext` and the `AnalysisResult` from Phase 2.
- **Output**: Array of `GeneratedOpportunity` objects.
- **Key behavior**: Each opportunity must have a score (0-100), a human-readable title and description, and agent-specific metadata.

### Phase 4: Summarize

The agent produces a summary of the run suitable for inclusion in the daily digest.

- **Input**: `AgentContext` and the generated opportunities.
- **Output**: `AgentSummary` with counts, top opportunities, execution time, and a prose summary.

## Creating a New Agent

Follow these steps to add a new agent:

### Step 1: Create the agent file

Create a new file in `packages/agents/src/`:

```
packages/agents/src/my-new-agent.ts
```

### Step 2: Implement the Agent interface

```typescript
import type { Agent, AgentContext, IngestResult, AnalysisResult, GeneratedOpportunity, AgentSummary } from "./types.js";

export class MyNewAgent implements Agent {
  id = "my-new-agent";
  name = "My New Agent";
  description = "Monitors a new data source for competitive intelligence.";

  async ingest(ctx: AgentContext): Promise<IngestResult> {
    // Fetch data from your source
    const rawData = await fetchFromSource(ctx.companyProfile.keywords);
    return {
      source: "my-source",
      rawData,
      fetchedAt: new Date(),
    };
  }

  async analyze(ctx: AgentContext, data: IngestResult): Promise<AnalysisResult> {
    // Process and score the raw data
    return {
      insights: ["Insight 1", "Insight 2"],
      relevanceScores: new Map([["item-1", 85], ["item-2", 42]]),
      metadata: {},
    };
  }

  async generateOpportunities(ctx: AgentContext, analysis: AnalysisResult): Promise<GeneratedOpportunity[]> {
    // Convert analysis into opportunity records
    return analysis.insights.map((insight, i) => ({
      type: "content" as const,
      title: `Opportunity from ${insight}`,
      description: insight,
      score: 50 + i * 10,
      metadata: {},
    }));
  }

  async summarize(ctx: AgentContext, opportunities: GeneratedOpportunity[]): Promise<AgentSummary> {
    return {
      agentId: this.id,
      runId: ctx.projectId, // replaced with actual runId at runtime
      opportunityCount: opportunities.length,
      topOpportunities: opportunities.slice(0, 3),
      executionTimeMs: 0, // measured by the worker
      summary: `Found ${opportunities.length} opportunities from my new source.`,
    };
  }
}
```

### Step 3: Register the agent

Export the agent from `packages/agents/src/index.ts`:

```typescript
export { MyNewAgent } from "./my-new-agent.js";
```

### Step 4: Add an opportunity type (if needed)

If your agent introduces a new opportunity type, update the `OpportunityType` enum in `packages/types/src/opportunity.ts` and add a matching case in the Drizzle schema (`packages/db/src/schema/`).

### Step 5: Test

Write tests in `packages/agents/src/__tests__/my-new-agent.test.ts` covering each lifecycle phase.

## Stub Agents

The platform ships with five stub agents, each targeting a different data source:

| Agent                  | ID                  | Source                   | Opportunity Type |
| ---------------------- | ------------------- | ------------------------ | ---------------- |
| SearchMogAgent         | `search-mog`        | Search engine results    | `search`         |
| GeoAgent               | `geo`               | Geo-location / local SEO | `geo`            |
| RedditMogAgent         | `reddit-mog`        | Reddit threads           | `reddit`         |
| CompetitorIntelAgent   | `competitor-intel`   | Competitor websites      | `competitor`     |
| ContentFoundryAgent    | `content-foundry`    | Content feeds / trends   | `content`        |

Each stub implements the full `Agent` interface with placeholder logic that returns mock data, allowing end-to-end testing of the pipeline before real integrations are built.
