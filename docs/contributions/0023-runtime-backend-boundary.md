# 0023 · Runtime backend boundary
Status: complete
Owner: Codex

## Files
- `docs/design.md` — clarify static production runtime, browser IO ownership, and future remote-sync boundary; fix platform boundary indentation.
- `docs/contributions/README.md` — index this record.

## Checks
- `rg` scan of `src/`, `vite.config.ts`, and `package.json` for app network clients — no application backend calls found.
- Automated tests — not run; documentation-only change.

## Limits
- No server backend exists to refactor. Remote sync remains out of scope until product requirements need it.


