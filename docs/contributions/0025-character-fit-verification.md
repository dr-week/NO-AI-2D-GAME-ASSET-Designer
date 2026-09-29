# 0025 · Character fit verification
Status: complete
Owner: Codex

## Files
- `src/features/character/model/geometry.ts` — reserve enough fit padding for maximum-size character geometry.
- `tests/characterGeometry.test.mjs` — verify T-pose symmetry, arm alignment, connectivity, and fit under joint limits.
- `package.json` — include character geometry tests in `npm run verify`.
- `docs/tasks/2026-09-28-lightweight-verification.md` — record smoke-check coverage and limits.

## Checks
- `npm run verify` — pass; 22 tests pass.
- `git diff --check` — pass.
- Browser smoke check — partial; pose/reset, local command acceptance/rejection, and narrow layout.

## Limits
- Image file import, masks, project dialogs, SVG downloads, feedback-folder writes, and cross-browser behavior remain unverified manually.
