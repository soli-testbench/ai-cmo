# Chief MOG Officer — Scaffolding Plan

## Overview

Scaffold a TypeScript monorepo for the "Chief MOG Officer" MVP: an AI-powered competitive intelligence platform with an API backend, background worker, React frontend, shared packages, and PostgreSQL persistence. This plan covers **scaffolding only** — stub implementations, type shells, and boilerplate so a team can clone and start building features immediately.

## Technology Choices

| Layer | Choice | Version | Rationale |
|---|---|---|---|
| Monorepo | Turborepo + npm workspaces | turbo@2.8 | Industry-standard TS monorepo tooling, fast incremental builds, parallel task execution |
| Language | TypeScript 5.x | ~5.7 | End-to-end type safety across all apps and packages |
| API | Hono on Node.js | hono@4.12, @hono/node-server@1.19 | Lightweight, Web-Standard, excellent TypeScript support, Zod-integrated validation |
| Frontend | React 19 + Vite 8 + React Router 7 + Tailwind 4 + shadcn/ui | react@19, vite@8, react-router@7, tailwindcss@4 | Modern React with file-based routing, fast HMR, utility CSS, accessible components |
| Database | PostgreSQL 16 + Drizzle ORM | drizzle-orm@0.45, drizzle-kit@0.31 | Type-safe schema-as-code, excellent migration story, SQL-first philosophy |
| Worker | BullMQ + Redis | bullmq@5.71 | Battle-tested Node.js job queue with scheduling, retries, concurrency controls |
| Validation | Zod | zod@4.3 | Runtime + compile-time validation, integrates with Hono and Drizzle |
| Testing | Vitest | vitest@4.1 | Vite-native, fast, TypeScript-first |
| Linting/Formatting | Biome | @biomejs/biome@2.4 | All-in-one linter+formatter, fast, replaces ESLint+Prettier |
| Runtime | tsx | tsx@4.21 | For running TS in development (API, worker) |
| Container | Docker Compose | — | PostgreSQL + Redis for local dev |

### Design Direction: "Command Dark"

A dark-mode-first design with a military/operations aesthetic. Think Bloomberg terminal meets modern SaaS dashboard.

- **Typography**: JetBrains Mono (monospace, data-heavy UI) paired with Inter for body text
- **Color palette**: Charcoal (#0D1117) background, slate (#161B22) cards, electric green (#39D353) primary accent, amber (#E3B341) warnings, ice blue (#58A6FF) secondary
- **Layout**: Dense, grid-based, sidebar navigation with a "mission control" feel
- **Components**: Sharp corners (rounded-sm max), high contrast borders, status indicators

## Monorepo Structure

```
/
├── apps/
│   ├── web/               # React SPA (Vite)
│   ├── api/               # Hono HTTP API
│   └── worker/            # BullMQ job processor
├── packages/
│   ├── types/             # Shared domain types (Zod schemas + TS types)
│   ├── db/                # Drizzle schema, migrations, connection, seed
│   ├── agents/            # Agent interface + 5 stub agents
│   ├── config/            # Shared env validation (Zod), constants
│   ├── ui/                # Shared React components (shadcn/ui based)
│   └── lib/               # Shared utilities (logger, errors, date helpers)
├── docs/                  # Architecture docs
├── docker-compose.yml     # PostgreSQL + Redis
├── turbo.json             # Turborepo config
├── package.json           # Root workspace config
├── tsconfig.base.json     # Shared TS config
├── biome.json             # Linting/formatting config
└── Dockerfile             # Multi-stage production build
```

## Domain Model

All domain types live in `packages/types` as Zod schemas with inferred TypeScript types:

- **User** — id, email, name, role, createdAt
- **Project** — id, name, description, companyProfileId, userId, status, createdAt, updatedAt
- **CompanyProfile** — id, name, industry, description, website, keywords, projectId
- **NarrativeModel** — id, projectId, coreNarrative, themes, voiceTone, targetAudiences
- **CompetitorProfile** — id, projectId, name, website, description, strengths, weaknesses
- **Opportunity** — id, projectId, agentId, type, title, description, score, metadata, status, createdAt
- **Asset** — id, projectId, opportunityId, type, title, content, status, createdAt
- **Campaign** — id, projectId, name, description, assets, status, startDate, endDate
- **AgentRun** — id, projectId, agentId, status (pending/running/completed/failed), startedAt, completedAt, result, error
- **DailyDigest** — id, projectId, date, summary, opportunities, agentRuns, createdAt

## Backend API (Hono)

Routes:
- `GET /health` — health check (returns `{ status: "ok", timestamp }`)
- `GET /api/projects` — list projects (stub: returns seeded data)
- `POST /api/projects` — create project (stub: validates input, returns mock)
- `GET /api/projects/:id` — get project detail (stub)
- `POST /api/projects/:id/analyze` — trigger analysis (stub: enqueues BullMQ job)
- `GET /api/projects/:id/opportunities` — list opportunities (stub: returns mock data)

Auth: placeholder middleware that checks for `Authorization` header presence (no real verification).

## Worker (BullMQ)

Queues:
- `analysis` — triggered by API, runs all agents for a project
- `scheduled-daily` — cron job, runs analysis for all active projects

Worker flow:
1. Receive job with `projectId` and optional `agentId`
2. Create `AgentRun` record (status: pending)
3. Execute agent(s) — call `ingest → analyze → generateOpportunities → summarize`
4. Update `AgentRun` record (status: completed/failed)
5. Return result

All agent calls are mock implementations returning stub data.

## Agent Interface

```typescript
interface Agent {
  id: string;
  name: string;
  description: string;
  ingest(context: AgentContext): Promise<IngestResult>;
  analyze(context: AgentContext, data: IngestResult): Promise<AnalysisResult>;
  generateOpportunities(context: AgentContext, analysis: AnalysisResult): Promise<Opportunity[]>;
  summarize(context: AgentContext, opportunities: Opportunity[]): Promise<string>;
}
```

Five stub agents, all returning mock data:
1. **SearchMogAgent** — search trend opportunities
2. **GeoAgent** — geographic/local market opportunities
3. **RedditMogAgent** — Reddit discussion opportunities
4. **CompetitorIntelAgent** — competitive intelligence opportunities
5. **ContentFoundryAgent** — content creation opportunities

## Database Schema

PostgreSQL via Drizzle, tables mapping 1:1 to domain types. Key indexes:
- `projects.userId`
- `opportunities.projectId`
- `agent_runs.projectId`
- `agent_runs.status`

Seed script creates one demo project with company profile, narrative model, 2 competitors, and sample opportunities.

## Task Decomposition

This is an XL task with 4 clearly separable modules:

### Task 1: Monorepo Foundation + Shared Packages + Database + Docs
- Root monorepo config (turborepo, workspaces, tsconfig, biome)
- `packages/types` — all domain Zod schemas and TS types
- `packages/config` — env validation
- `packages/lib` — logger, error classes, utilities
- `packages/db` — Drizzle schema, migrations, connection, seed script
- `docs/` — architecture.md, domain-model.md, agent-interface.md, dev-setup.md
- `docker-compose.yml` — PostgreSQL + Redis
- `Dockerfile` — multi-stage build
- Root scripts (dev, build, lint, typecheck, test)

### Task 2: Backend API + Worker + Agents
- `apps/api` — Hono server with all routes, middleware, auth placeholder
- `apps/worker` — BullMQ worker with queues, job handlers, scheduling
- `packages/agents` — Agent interface + 5 stub agent implementations
- Tests for API routes and agent contract

### Task 3: Frontend Application
- `apps/web` — React + Vite + React Router + Tailwind + shadcn/ui
- `packages/ui` — shared component library (shadcn/ui based)
- App shell, layout, sidebar, navigation
- Page shells: Command Center, Project Creation, Opportunity List
- Design tokens and "Command Dark" theme
- API client stub for connecting to backend

## CI Constraint

The existing `.github/workflows/ci.yml` expects a `Dockerfile` at root. We will provide that Dockerfile but will NOT modify any files under `.github/workflows/` (agent fork token lacks workflow scope). The CI skeleton (lint, typecheck, test) will be documented in dev-setup.md and implemented via `turbo` pipeline commands that the Dockerfile and CI can invoke.

## Sources

- Turborepo docs: https://turborepo.dev/repo/docs
- Drizzle ORM docs: https://orm.drizzle.team/docs/overview
- Hono docs: https://hono.dev/docs/
- BullMQ docs: https://docs.bullmq.io/
- shadcn/ui docs: https://ui.shadcn.com/docs
- React Router: https://reactrouter.com/
- Vite: https://vite.dev/
- Biome: https://biomejs.dev/
