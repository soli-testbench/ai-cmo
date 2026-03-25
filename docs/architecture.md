# Architecture Overview

Chief MOG Officer is an AI-powered competitive intelligence platform built as a TypeScript monorepo. It ingests market signals through autonomous agents, surfaces opportunities, and generates content assets.

## System Diagram

```
                         +------------------+
                         |     Client       |
                         |  (Browser/SPA)   |
                         +--------+---------+
                                  |
                                  | HTTP/REST
                                  v
                         +--------+---------+
                         |   apps/api       |
                         |   (Hono server)  |
                         +--+----------+----+
                            |          |
               read/write   |          |  enqueue jobs
                            v          v
                  +---------+--+   +---+-----------+
                  | PostgreSQL |   |  Redis/BullMQ  |
                  |  (pg:16)   |   |   (redis:7)    |
                  +---------+--+   +---+-----------+
                            ^          |
               read/write   |          |  dequeue jobs
                            |          v
                         +--+----------+----+
                         |  apps/worker     |
                         |  (BullMQ worker) |
                         +--------+---------+
                                  |
                                  |  runs agents
                                  v
                         +--------+---------+
                         | packages/agents  |
                         | (Agent runners)  |
                         +------------------+
```

## Module Responsibilities

### Applications

| Module         | Responsibility                                                                 |
| -------------- | ------------------------------------------------------------------------------ |
| `apps/api`     | HTTP API server (Hono). Handles authentication, CRUD for all domain entities, triggers agent runs, serves the daily digest. |
| `apps/web`     | Browser SPA. Dashboard for projects, opportunities, assets, and campaign management. |
| `apps/worker`  | Background job processor (BullMQ). Picks up queued agent-run jobs, executes agents, writes results back to the database. |

### Shared Packages

| Package            | Responsibility                                                                  |
| ------------------ | ------------------------------------------------------------------------------- |
| `packages/types`   | Zod schemas and inferred TypeScript types for every domain entity. Single source of truth for validation and type safety. |
| `packages/config`  | Environment variable validation using Zod. Exports a typed `env` object used across all apps. |
| `packages/lib`     | Shared utilities: structured logger, error classes (`AppError`, `NotFoundError`, `ValidationError`, `UnauthorizedError`), `generateId()`, `sleep()`, `retry()`. |
| `packages/db`      | Drizzle ORM schema definitions, database connection (via the `postgres` driver), migration configuration (`drizzle-kit`), and seed script. |
| `packages/agents`  | Agent implementations. Each agent follows a standard interface (ingest, analyze, generateOpportunities, summarize). |
| `packages/ui`      | Shared UI components (placeholder, populated by frontend task).                 |

## Data Flow

1. **User creates a project** via the web app, which calls the API to persist it in PostgreSQL.
2. **Agent runs are scheduled** either on a cron schedule or manually via the API. The API enqueues a job into Redis (BullMQ).
3. **The worker picks up the job**, instantiates the appropriate agent, and runs its lifecycle: `ingest` -> `analyze` -> `generateOpportunities` -> `summarize`.
4. **Opportunities are written** back to PostgreSQL with a relevance score (0-100).
5. **A daily digest** is generated summarizing all new opportunities and agent activity for the day.
6. **The web dashboard** displays opportunities, allows the user to review/act/dismiss them, and manage generated content assets and campaigns.

## Technology Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Language       | TypeScript ~5.7                     |
| Monorepo       | npm workspaces + Turborepo 2.8      |
| API framework  | Hono                                |
| Database       | PostgreSQL 16                       |
| ORM            | Drizzle ORM 0.45                    |
| DB driver      | `postgres` 3.4 (not `pg`)          |
| Queue          | Redis 7 + BullMQ                    |
| Validation     | Zod 4                               |
| Linting        | Biome 2.4                           |
| Testing        | Vitest 4.1                          |
| Runtime        | Node.js 22                          |
| Containerization | Docker (multi-stage), Docker Compose |
