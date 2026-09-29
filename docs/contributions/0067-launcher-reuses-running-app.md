# 0067 · Launcher reuses running app
Status: complete
Owner: Codex

## Files
- `scripts/launch-2dmaker.ps1` — reuse the configured port only when it serves the 2D Maker page.
- `scripts/README.md` — document reuse and unrelated-port behavior.

## Checks
- Existing app on port 5173 — pass; launcher opened it and exited cleanly.
- Existing Vite responses on ports 5173, 5174, and 5175 — HTTP 200.

## Limits
- Crash log was historical; no new Vite crash. Port conflict caused prior launch failures.
