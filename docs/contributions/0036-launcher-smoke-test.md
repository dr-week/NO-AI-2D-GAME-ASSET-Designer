# 0036 · Launcher smoke test
Status: complete
Owner: Codex

## Files
- `scripts/launch-2dmaker.ps1` — reject occupied ports before starting Vite; allow an explicit port; handle abandoned mutexes; keep errors concise.
- `scripts/README.md` — document default launch and alternate-port usage.

## Checks
- Launcher with port 5173 occupied — pass; clear logged error, no second server.
- Initial run exposed false readiness when an existing server returned HTTP 200; port preflight fixed it.
- Launcher start/stop on port 5174 — pass; HTTP 200; Ctrl+C stopped Vite and released port.
- Duplicate launcher — pass; second invocation exited without opening another browser.
- BAT failure path — pass; displays recovery log path and pauses, then returns nonzero.
- `git diff --check` — pass.

## Limits
- Browser opening and shutdown are checked on this Windows host only.
