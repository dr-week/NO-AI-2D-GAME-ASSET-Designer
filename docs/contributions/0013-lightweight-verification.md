# 0013 · Lightweight verification
Status: complete
Owner: Codex

## Files
- `tests/projectFile.test.mjs`, `tests/layaDecision.test.mjs` — cover project data and bounded System 1 decisions.
- `src/features/image-animation/io/projectFile.ts` — expose a Node-resolvable explicit TypeScript module path.
- `tsconfig.app.json` — allow explicit TypeScript extensions with no-emit checking.
- `package.json` — add individual project tests and optional verification shortcut.
- `README.md` — document shortcut and manual fallback.
- `docs/tasks/2026-09-28-lightweight-verification.md` — smoke checklist and fallback.
- `docs/contributions/README.md` — index this record.
- `docs/contributions/0013-lightweight-verification.md` — record status and checks.

## Checks
- `npm run verify` — pass; 16 tests pass, type-check and build pass.

## Limits
- No browser automation or new dependencies; manual UI smoke check remains available.
