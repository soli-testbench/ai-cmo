# Architecture

## Overview

Chief MOG Officer (CMO) is a marketing intelligence platform that uses AI agents to discover, analyze, and surface marketing opportunities. The system is built as a TypeScript monorepo with three main applications and several shared packages.

## System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Web App   │────▶│   API App   │────▶│  PostgreSQL  │
│  (React)    │     │  (Express)  │     │  Database    │
└─────────────┘     └──────┬──────┘     └──────▲──────┘
                           │                    │
                           │  triggers          │
                           ▼                    │
                    ┌─────────────┐             │
                    │   Worker    │─────────────┘
                    │  (Node.js)  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Agents    │
                    │ (5 stubs)   │
                    └─────────────┘
```

## Applications

### `apps/web` — Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v7
- **Purpose**: Dashboard UI for managing projects, viewing opportunities, and triggering analyses

### `apps/api` — Backend API
- **Framework**: Express.js
- **Purpose**: REST API serving the frontend and accepting external integrations
- **Key routes**: Health check, project CRUD, analysis trigger, opportunity listing

### `apps/worker` — Background Jobs
- **Framework**: Node.js with polling loop
- **Purpose**: Processes analysis jobs, executes agents, records results
- **Features**: Job polling, retry logic, scheduled daily runs

## Shared Packages

| Package | Purpose |
|---------|---------|
| `@ai-cmo/types` | Domain model TypeScript types shared across all apps |
| `@ai-cmo/config` | Environment variable validation via Zod |
| `@ai-cmo/db` | Drizzle ORM schema, migrations, seed data |
| `@ai-cmo/agents` | Agent interface definition and 5 stub implementations |
| `@ai-cmo/ui` | Shared React component library (Card, Button, StatusBadge) |
| `@ai-cmo/lib` | Shared utilities: logger, ID generation, helpers |

## Data Flow

1. User creates a project via the web UI
2. API persists the project and company profile to the database
3. User triggers analysis (or daily scheduler fires)
4. API creates an `AgentRun` record with status `pending`
5. Worker polls for pending runs, marks them `running`
6. Worker executes each agent: `ingest → analyze → generateOpportunities → summarize`
7. Opportunities are persisted to the database
8. Run is marked `completed` (or `failed` with retry)
9. Web UI displays opportunities on the dashboard

## Technology Decisions

- **Monorepo**: pnpm workspaces + Turborepo for build orchestration
- **Database**: PostgreSQL via Docker, managed with Drizzle ORM
- **Validation**: Zod for both env config and API request validation
- **Styling**: CSS custom properties (design tokens) for theming
- **CI**: GitHub Actions for lint, typecheck, and test
