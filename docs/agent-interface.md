# Agent Interface

## Overview

Agents are the core intelligence layer of Chief MOG Officer. Each agent specializes in a particular data source or analysis domain. All agents implement a common interface to ensure consistent lifecycle management and composability.

## Agent Interface

```typescript
interface Agent {
  readonly name: string;
  readonly description: string;

  ingest(context: AgentContext): Promise<void>;
  analyze(context: AgentContext): Promise<void>;
  generateOpportunities(context: AgentContext): Promise<Opportunity[]>;
  summarize(context: AgentContext): Promise<string>;
}
```

### Lifecycle Methods

| Method | Purpose |
|--------|---------|
| `ingest` | Fetch and cache data from external sources (APIs, web scraping, feeds) |
| `analyze` | Process ingested data to identify patterns, trends, and insights |
| `generateOpportunities` | Produce a list of actionable `Opportunity` objects |
| `summarize` | Return a human-readable summary of the analysis run |

### Agent Context

```typescript
interface AgentContext {
  projectId: string;
  companyName: string;
  industry: string;
  description: string;
}
```

The context provides the agent with project-level information needed to tailor its analysis.

## Registered Agents

### 1. SearchMogAgent
- **Domain**: Search trends
- **Category**: `trending`
- **Purpose**: Monitors search engine trends and identifies content opportunities based on rising queries

### 2. GeoAgent
- **Domain**: Geographic intelligence
- **Category**: `geographic`
- **Purpose**: Identifies geographic market opportunities and regional trends relevant to the company

### 3. RedditMogAgent
- **Domain**: Social listening (Reddit)
- **Category**: `social`
- **Purpose**: Monitors Reddit for relevant discussions, sentiment, and community-driven insights

### 4. CompetitorIntelAgent
- **Domain**: Competitive intelligence
- **Category**: `competitive`
- **Purpose**: Tracks competitor activities, content gaps, and strategic opportunities

### 5. ContentFoundryAgent
- **Domain**: Content generation
- **Category**: `content`
- **Purpose**: Generates content ideas and drafts based on discovered opportunities

## Agent Registry

Agents are registered at import time via the `registerAgent()` function. The registry provides:

```typescript
registerAgent(agent: Agent): void       // Register an agent
getAgent(name: string): Agent | undefined  // Get by name
getAllAgents(): Agent[]                    // Get all registered agents
getAgentNames(): string[]                 // List all agent names
```

## Adding a New Agent

1. Create a new class implementing the `Agent` interface in `packages/agents/src/stubs/`
2. Export it from `packages/agents/src/index.ts`
3. Call `registerAgent(new YourAgent())` in the index module
4. The worker will automatically include it in "all agents" runs

## Current Status

All agents are currently **stub implementations** that return mock data. They implement the full interface contract and can be progressively replaced with real logic.
