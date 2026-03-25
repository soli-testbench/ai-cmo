#!/bin/bash
set -euo pipefail

# Chief MOG Officer — Dev Environment Bootstrap
# Safe to run multiple times (idempotent)

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_ROOT"

echo "==> Bootstrapping Chief MOG Officer dev environment..."

# 1. Copy .env.example to .env if it doesn't exist
if [ -f .env.example ] && [ ! -f .env ]; then
  echo "==> Creating .env from .env.example"
  cp .env.example .env
else
  echo "==> .env already exists or no .env.example found, skipping"
fi

# 2. Install npm dependencies if node_modules is missing or stale
if [ -f package.json ]; then
  if [ ! -d node_modules ] || [ package.json -nt node_modules ]; then
    echo "==> Installing npm dependencies..."
    npm install
  else
    echo "==> node_modules up to date, skipping npm install"
  fi
fi

# 3. Start Docker services (PostgreSQL + Redis) if docker-compose.yml exists
if [ -f docker-compose.yml ] || [ -f compose.yml ]; then
  if command -v docker &> /dev/null; then
    echo "==> Starting Docker services (PostgreSQL + Redis)..."
    docker compose up -d 2>/dev/null || docker-compose up -d 2>/dev/null || echo "WARNING: Docker compose failed — ensure Docker is running"

    # Wait for PostgreSQL to be ready
    echo "==> Waiting for PostgreSQL to accept connections..."
    for i in $(seq 1 30); do
      if docker compose exec -T postgres pg_isready -U postgres &>/dev/null 2>&1; then
        echo "==> PostgreSQL is ready"
        break
      fi
      if [ "$i" -eq 30 ]; then
        echo "WARNING: PostgreSQL did not become ready in 30 seconds"
      fi
      sleep 1
    done
  else
    echo "WARNING: Docker not found — install Docker to run PostgreSQL and Redis locally"
  fi
fi

# 4. Build shared packages (needed before apps can compile)
if [ -f turbo.json ]; then
  echo "==> Building shared packages..."
  npx turbo build --filter='./packages/*' 2>/dev/null || echo "WARNING: Package build failed — this may be expected on first run before all code is written"
fi

# 5. Run database migrations if the migrate script exists
if npm run --silent db:migrate --if-present 2>/dev/null; then
  echo "==> Database migrations applied"
else
  echo "==> No db:migrate script found or migration failed — skipping"
fi

echo "==> Bootstrap complete! Run 'npm run dev' to start all services."
