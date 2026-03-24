# Developer Setup

## Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0
- **Docker** and **Docker Compose** (for PostgreSQL)

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/soli-testbench/ai-cmo.git
cd ai-cmo

# 2. Install dependencies
pnpm install

# 3. Copy environment config
cp .env.example .env

# 4. Start PostgreSQL
docker compose up -d

# 5. Run database migrations
pnpm db:migrate

# 6. Seed demo data
pnpm db:seed

# 7. Start all services (in separate terminals)
pnpm dev:api     # API server on http://localhost:4000
pnpm dev:worker  # Background worker
pnpm dev:web     # Web UI on http://localhost:3000
```

## Project Structure

```
ai-cmo/
├── apps/
│   ├── web/          # React frontend (Vite)
│   ├── api/          # Express API server
│   └── worker/       # Background job processor
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── config/       # Environment validation (Zod)
│   ├── db/           # Drizzle ORM schema + migrations
│   ├── agents/       # Agent interface + 5 stub agents
│   ├── ui/           # Shared React components
│   └── lib/          # Utilities (logger, helpers)
├── docs/             # Architecture documentation
├── docker-compose.yml
└── .env.example
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev:web` | Start frontend dev server (port 3000) |
| `pnpm dev:api` | Start API server (port 4000) |
| `pnpm dev:worker` | Start background worker |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Run ESLint across the monorepo |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run tests across the monorepo |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check formatting without changes |
| `pnpm db:generate` | Generate Drizzle migrations from schema |
| `pnpm db:migrate` | Run pending database migrations |
| `pnpm db:seed` | Seed demo data into the database |

## Database

The project uses **PostgreSQL** via Docker and **Drizzle ORM** for schema management.

### Managing Migrations

```bash
# Generate a new migration after editing packages/db/src/schema.ts
pnpm db:generate

# Apply pending migrations
pnpm db:migrate
```

### Connecting to the Database

Default credentials (from `.env.example`):
- **Host**: localhost:5432
- **User**: cmo
- **Password**: cmo
- **Database**: ai_cmo

```bash
psql postgresql://cmo:cmo@localhost:5432/ai_cmo
```

## Environment Variables

All environment variables are validated at startup using Zod. See `.env.example` for the full list.

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://cmo:cmo@localhost:5432/ai_cmo` | PostgreSQL connection string |
| `API_PORT` | `4000` | API server port |
| `API_HOST` | `0.0.0.0` | API server host |
| `WORKER_POLL_INTERVAL_MS` | `5000` | Worker job polling interval |
| `LOG_LEVEL` | `info` | Logging level (debug, info, warn, error) |
| `AUTH_SECRET` | `change-me-in-production` | Auth secret (placeholder) |

## Agents

Five stub agents are registered automatically:

1. **SearchMogAgent** — Search trend monitoring
2. **GeoAgent** — Geographic market analysis
3. **RedditMogAgent** — Reddit social listening
4. **CompetitorIntelAgent** — Competitive intelligence
5. **ContentFoundryAgent** — Content generation

All agents implement the common interface: `ingest → analyze → generateOpportunities → summarize`

See [agent-interface.md](./agent-interface.md) for details on implementing new agents.

## CI Pipeline

GitHub Actions runs on every push and PR:
1. **Lint** — ESLint checks
2. **Typecheck** — TypeScript compilation
3. **Test** — Vitest test suite
