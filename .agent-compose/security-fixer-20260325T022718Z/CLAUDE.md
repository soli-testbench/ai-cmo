# Task: undefined
**Type**: undefined | **Size**: undefined | **Priority**: undefined

## Implementation Plan
See **PLAN.md** in this directory for technical approach and architecture (if present).


## Security Review Feedback

The previous submission was **rejected**. Address each finding below before resubmitting.

Security review decision: needs_review

Claude: Branch implements monorepo scaffolding for "Chief MOG Officer" MVP matching the task description exactly: Turborepo+npm workspaces, apps (api/web/worker), shared packages (types/config/db/agents/lib/ui), Drizzle ORM schema, 5 stub agents, React frontend shells, Hono API with JWT auth, BullMQ worker, Docker/docs. SCOPE: exact match to acceptance criteria. SAFETY: (1) No install hooks (preinstall/postinstall/prepare) in any package.json — no supply-chain execution risk. (2) No dynamic code execution (eval, child_process, Function constructor, vm) in application code. (3) Auth middleware enforces JWT with HS256 verification, requires JWT_SECRET in production. (4) No outbound network egress beyond localhost API calls from frontend. (5) SQL migrations are CREATE-only with proper foreign keys and indexes — no destructive DDL. (6) Config rejects default DB credentials in production. The heuristic signals (prompt injection, supply chain) are false positives from the CI workflow YAML file itself containing grep patterns for those keywords, not from application code.
Codex: Task compliance: mostly in scope for MVP scaffolding (monorepo/apps/packages/docs/routes/worker/db seed all present), but with minor deviations: auth is full JWT verification (not just placeholder) and frontend adds third-party font egress. Security posture: no concrete backdoor/exfil/sabotage primitives found (no eval/child_process/install hooks/destructive SQL), but branch is not clearly safe enough for auto-allow due integrity-impacting mock fallbacks and added outbound runtime dependency. Assessment: within scope with minor deviation, but safety is unclear -> needs_review.

Findings:
- [low] apps/api/src/middleware/auth.ts: Acceptable for dev scaffolding. Production requires JWT_SECRET (line 82 throws if missing). No bypass path.
- [low] apps/api/src/middleware/rate-limit.ts: IP spoofable via header in dev. Comment notes Redis-backed limiter needed for production. Acceptable for scaffolding.
- [low] apps/api/src/app.ts: Wildcard CORS restricted to dev/test only. Production defaults to localhost, overridable via CORS_ORIGIN env var.
- [medium] apps/web/src/lib/api-client.ts: Silent fallback can mask auth/availability failures and present fabricated state as real, risking operator decisions and integrity of UI-driven workflows.
- [medium] apps/web/src/lib/api-client.ts: Cross-app auth contract mismatch can cause systemic auth failure and trigger mock fallback behavior, reducing trust in displayed data and controls.
- [low] apps/web/index.html: Introduces new outbound third-party dependency not required by core scaffolding acceptance criteria; expands egress/supply-chain surface.

Recommended actions:
- Add CI security checks for unexpected outbound domains and auth-contract drift.
- Align auth contract between web and API (either Bearer JWT flow or cookie-session middleware) and add integration tests.
- Decide policy for third-party font egress; self-host fonts if external runtime calls are disallowed.
- Ensure JWT_SECRET is set via secrets management before any non-dev deployment
- Remove or gate silent mock fallbacks behind explicit development-only flag and visible UI banner.
- Replace in-memory rate limiter with Redis-backed implementation before production
- Require explicit failure states for analysis trigger/project CRUD instead of synthetic success objects.
- Run full `npm ci && npm test && npm run typecheck` in clean environment before merge.
- Verify package-lock.json integrity matches expected npm registry sources before deploying



## Prior Fix Attempts (6 previous, this is attempt #7)

**IMPORTANT**: Previous attempts to fix this security review have FAILED. Do NOT repeat the same approach.
Do NOT modify any files under `.github/workflows/` — the fork PAT lacks workflow scope so changes will be rejected.

1. **completed** (2026-03-25 02:12:37.39048+00): no details
2. **completed** (2026-03-25 01:58:07.799713+00): no details
3. **failed** (2026-03-25 01:57:53.298925+00): Agent error: Agent process failed: 13: [internal] protocol error: received unsupported compressed output
4. **completed** (2026-03-25 01:37:27.263778+00): no details
5. **failed** (2026-03-25 01:37:11.978963+00): Agent error: Agent process failed: 13: [internal] protocol error: received unsupported compressed output
6. **failed** (2026-03-25 01:35:47.298373+00): Agent error: Agent process failed: 13: [internal] protocol error: received unsupported compressed output
## Changes in This Branch
```
(no diff yet)
```