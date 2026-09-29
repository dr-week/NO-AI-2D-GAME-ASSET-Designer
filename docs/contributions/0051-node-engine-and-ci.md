# 0051 · Node engine and CI verification
Status: complete
Owner: Codex

## Files
- `package.json`, `package-lock.json` — declare Node.js 24 or newer, matching the Windows launcher requirements.
- `.github/workflows/verify.yml` — run `npm ci` and `npm run verify` on pushes and pull requests with read-only repository permissions.
- `docs/tasks/README.md`, `docs/status.md` — close the configuration task and update runtime status.
- `docs/contributions/README.md` — index the handoff.
- `docs/contributions/0051-node-engine-and-ci.md` — record the handoff.

## Checks
- `npm ci` — pass; 59 packages audited, no vulnerabilities reported.
- `npm run check`, `npm run build` — pass.
- `npm run verify` — awaits first CI run.

## Limits
- No backend server exists; current product uses browser-local storage and APIs. Remote sync remains conditional on product requirements.
- Browser-flow verification remains next; I-001–I-005 need device/browser evidence.
