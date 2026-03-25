## security-fixer — 2026-03-25T03:27:26Z

- **Feedback**: CI build failed — TypeScript errors in `apps/worker/src/lib/redis.ts` (TS2352, TS2769, TS2493) due to invalid `ConstructorParameters<typeof IORedis>[0]` cast resolving to empty tuple.
- **Actions taken**:
  1. `apps/worker/src/lib/redis.ts` — Replaced `Record<string, unknown>` opts type with proper `RedisOptions` import from ioredis; replaced invalid `ConstructorParameters<typeof IORedis>[0]` cast with direct `RedisOptions` typed parameter.
- **Files changed**: apps/worker/src/lib/redis.ts
- **Tests run**: yes — 111/111 tests pass (9 test files); 2 web test files fail due to pre-existing module resolution issues (unrelated)
- **Outcome**: success — full monorepo build (9/9 packages) succeeds

## security-fixer — 2026-03-25T03:16:09Z

- **Feedback**: Multiple medium-severity findings: JWT accepts tokens without exp, Redis URL auth/TLS dropped in API and worker, worker does not persist AgentRun to DB, docs mismatch with implementation.
- **Actions taken**:
  1. `apps/api/src/middleware/auth.ts` — Made `exp` claim mandatory; tokens without `exp` are now rejected with 401.
  2. `apps/api/src/lib/queue.ts` — Full REDIS_URL parsing: username, password, TLS (rediss:// protocol), and DB index are now forwarded to BullMQ connection.
  3. `apps/worker/src/lib/redis.ts` — Same full REDIS_URL parsing for the worker's ioredis connection.
  4. `apps/worker/src/jobs/run-agent.ts` — Added DB persistence of AgentRun lifecycle: creates record as "pending", updates to "running", then "completed" or "failed" with results/error.
  5. `docs/dev-setup.md` — Corrected frontend auth section: changed from "httpOnly session cookies" to actual JWT Bearer token model.
  6. `apps/api/__tests__/api.test.ts` — Added test verifying tokens without `exp` are rejected.
  7. `apps/worker/__tests__/worker.test.ts` — Added mocks for `@chief-mog/db` and `drizzle-orm` to support DB persistence in tests.
- **Files changed**: apps/api/src/middleware/auth.ts, apps/api/src/lib/queue.ts, apps/worker/src/lib/redis.ts, apps/worker/src/jobs/run-agent.ts, docs/dev-setup.md, apps/api/__tests__/api.test.ts, apps/worker/__tests__/worker.test.ts
- **Tests run**: yes — 44/44 tests pass (3 test files); 5 other test files fail due to pre-existing missing dependencies in sandbox (unrelated to changes)
- **Outcome**: success
