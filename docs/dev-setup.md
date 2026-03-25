# Development Setup

This guide walks through setting up the Chief MOG Officer monorepo for local development.

## Prerequisites

- **Node.js 22** -- Install via [nvm](https://github.com/nvm-sh/nvm) or the [official installer](https://nodejs.org/).
- **Docker** and **Docker Compose** -- Required for PostgreSQL and Redis. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) or the Docker Engine.
- **npm** -- Ships with Node.js. Used for workspace management (no yarn/pnpm required).

Verify your setup:

```bash
node --version   # v22.x.x
docker --version # Docker version 27.x or later
npm --version    # 10.x or later
```

## Clone and Install

```bash
git clone <repository-url>
cd chief-mog-officer
npm install
```

`npm install` resolves all workspace dependencies (apps and packages) in a single operation.

## Start Infrastructure Services

Start PostgreSQL and Redis in the background:

```bash
docker compose up -d
```

This starts:
- **PostgreSQL 16** on port `5432` (database: `chief_mog`, user: `postgres`, password: `postgres`)
- **Redis 7** on port `6379`

To view logs:

```bash
docker compose logs -f
```

To stop services:

```bash
docker compose down
```

## Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

The defaults work with the Docker Compose services out of the box:

```
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/chief_mog
REDIS_URL=redis://localhost:6379
API_PORT=3001
WEB_PORT=3000
WORKER_CONCURRENCY=5
LOG_LEVEL=debug
```

## Database Setup

Run migrations to create the schema:

```bash
npm run db:migrate
```

Seed the database with demo data (one project, users, opportunities, etc.):

```bash
npm run db:seed
```

## Running in Development

Start all apps and packages in watch mode:

```bash
npm run dev
```

This delegates to Turborepo, which starts:
- `apps/api` -- API server at `http://localhost:3001`
- `apps/web` -- Web app at `http://localhost:3000`
- `apps/worker` -- Background worker

Each app rebuilds on file changes.

## Running Tests

```bash
npm test
```

Delegates to `turbo test`, which runs Vitest in every package that has a `test` script. To run tests for a specific package:

```bash
npm test --workspace=@chief-mog/types
npm test --workspace=@chief-mog/lib
npm test --workspace=@chief-mog/config
```

## Linting and Formatting

Lint all files:

```bash
npm run lint
```

Format all files:

```bash
npm run format
```

Both use [Biome](https://biomejs.dev/) for linting and formatting.

## Type Checking

```bash
npm run typecheck
```

Runs `tsc --noEmit` across all packages via Turborepo.

## Building

```bash
npm run build
```

Builds all packages and apps. Turborepo handles dependency ordering (shared packages build before apps that depend on them).

## Docker Build

To build the production Docker image:

```bash
docker build -t chief-mog-officer .
```

To run it:

```bash
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/chief_mog \
  -e REDIS_URL=redis://host.docker.internal:6379 \
  chief-mog-officer
```

## Project Structure

```
/
├── apps/
│   ├── api/             # Hono HTTP API server
│   ├── web/             # Frontend SPA
│   └── worker/          # BullMQ background worker
├── packages/
│   ├── types/           # Zod schemas and TypeScript types
│   ├── config/          # Environment variable validation
│   ├── lib/             # Logger, error classes, utilities
│   ├── db/              # Drizzle ORM schema, migrations, seed
│   ├── agents/          # Agent implementations
│   └── ui/              # Shared UI components
├── docs/                # Architecture and development docs
├── docker-compose.yml   # Local PostgreSQL and Redis
├── Dockerfile           # Multi-stage production build
├── turbo.json           # Turborepo task configuration
├── tsconfig.base.json   # Shared TypeScript config
├── biome.json           # Linter and formatter config
├── .env.example         # Environment variable template
└── package.json         # Root workspace config
```

## Security & Auth Model

### Authentication

The API uses **JWT (HS256)** for authentication. Tokens are verified on every request to `/api/*` routes.

| Environment | JWT_SECRET behavior |
|---|---|
| **production** | `JWT_SECRET` env var is **required** — the API refuses to start without it. |
| **development / test** | If `JWT_SECRET` is not set, a random per-instance secret is generated at startup. This means tokens are not portable across restarts, which is intentional. |

**For production deployments:**
- Set `JWT_SECRET` to a strong, randomly generated value (minimum 32 bytes / 256 bits).
- Set `JWT_ISSUER` and `JWT_AUDIENCE` to restrict token scope.
- Set `CORS_ORIGIN` to the exact frontend origin (e.g., `https://app.example.com`). Wildcard (`*`) is rejected in production.

### Database credentials

The `docker-compose.yml` ships with default Postgres credentials (`postgres:postgres`) for local development only. The config validation layer (`packages/config`) rejects these defaults when `NODE_ENV=production`.

### Frontend auth

The web frontend authenticates by sending a JWT **Bearer token** in the `Authorization` header on every API request. Tokens are obtained from the backend auth flow and stored client-side. The API validates the token signature (HS256), expiry (`exp` claim), and optional `iss`/`aud` claims on each request.

### Deployment checklist

1. Set `NODE_ENV=production`
2. Set a strong `JWT_SECRET` (generate with `openssl rand -hex 32`)
3. Set `DATABASE_URL` with strong, unique credentials
4. Set `CORS_ORIGIN` to the production frontend URL
5. Ensure `.env` files are never committed (verified by `.gitignore`)

## Troubleshooting

**Port conflicts**: If ports 5432, 6379, 3000, or 3001 are already in use, either stop the conflicting service or update the ports in `docker-compose.yml` and `.env`.

**Database connection errors**: Make sure Docker Compose is running (`docker compose ps`) and the `DATABASE_URL` in `.env` matches the Compose configuration.

**Module resolution errors**: All packages use ESM (`"type": "module"`). Ensure imports use `.js` extensions (e.g., `import { foo } from "./bar.js"`).
