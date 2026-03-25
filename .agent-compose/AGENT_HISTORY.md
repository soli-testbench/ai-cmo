## security-fixer — 2026-03-25T02:27:00Z

- **Feedback**: Silent mock fallbacks mask real API failures; auth contract mismatch between web (cookies) and API (Bearer JWT); third-party Google Fonts egress expands supply-chain surface
- **Actions taken**:
  1. `apps/web/src/lib/api-client.ts`: Replaced silent try/catch mock fallbacks with explicit `VITE_MOCK_API=true` env flag gating. Mock data is only returned when explicitly opted in, not on any error. Removed `credentials: "include"` and added `setAuthToken()` + Bearer token Authorization header to align with the API's JWT middleware.
  2. `apps/web/index.html`: Removed Google Fonts `<link>` tags (preconnect + stylesheet) that loaded Inter and JetBrains Mono from fonts.googleapis.com/fonts.gstatic.com.
  3. `apps/web/src/index.css`: Replaced named font families with system font stacks (system-ui for body, ui-monospace for display/mono).
- **Files changed**: `apps/web/src/lib/api-client.ts`, `apps/web/index.html`, `apps/web/src/index.css`
- **Tests run**: yes — all 89 tests pass across 13 turbo tasks (config 5, types 15, lib 13, agents 27, web 12, api 13, worker 4)
- **Outcome**: success
