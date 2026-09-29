# 0027 · Landscape template storage
Status: complete
Owner: Codex

## Files
- `src/features/landscape/model/templates.ts` — versioned recipe contract and JSON validation.
- `src/features/landscape/io/templateStore.ts` — IndexedDB repository.
- `tests/landscapeTemplates.test.mjs` — contract and backup validation.
- `package.json` — include focused test in verification.
- `docs/tasks/README.md`, `docs/tasks/2026-09-28-template-database-architecture.md` — queue and status.
- `docs/contributions/README.md` — index this record.

## Checks
- `npm run verify` — pass; type-check, 27 tests, production build.

## Limits
- IndexedDB operations are implemented; user-facing template controls are the next task.
