# 0016 · Character System 1 contract
Status: complete
Owner: Codex

## Files
- `src/features/laya/model/characterQuestions.ts` — define bounded typed choice questions.
- `src/features/laya/model/characterDecision.ts` — validate answers and map them to existing controls.
- `tests/layaDecision.test.mjs` — cover valid, invalid, and low-confidence decisions.
- `package.json` — add the focused test to `verify`.
- `docs/design.md`, `docs/requirements.md`, `docs/issues.md`, `docs/status.md`, `README.md` — record integration boundary and current limits.
- `research/laya-integration.md` — summarize compatibility and runtime trade-offs.
- `docs/tasks/2026-09-28-laya-character-decisions.md` — task scope.
- `docs/contributions/README.md` — [done] index this record.

## Checks
- `npm run verify` — pass; 18 tests pass, type-check and production build pass.

## Limits
- Adapter contract only; no model weights, inference runtime, or UI hookup. Those remain separate future scope.
