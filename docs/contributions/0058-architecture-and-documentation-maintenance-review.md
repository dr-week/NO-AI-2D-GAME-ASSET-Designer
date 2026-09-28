# 0058 · Architecture and documentation maintenance review
Status: complete
Owner: Codex

## Files
- `scripts/new-contribution.mjs` — serialize ID allocation with an exclusive lock and release it on completion/failure.
- `scripts/README.md`, `docs/contributing.md`, `docs/contributions/0048-contribution-index-allocation.md` — explain helper usage and stale-lock recovery.
- `docs/ui-ux/08-structure-feedback/script.md`, `docs/ui-ux/01-workspace/script.md` — remove navigation conflict and align current labels with the workflow proposal.
- `docs/tasks/README.md` — remove completed Node/CI item from future work.
- `docs/requirements.md` — clarify planned non-LLM Laya scope.
- `docs/contributions/0058-architecture-and-documentation-maintenance-review.md` — this record.

## Checks
- `node --check scripts/new-contribution.mjs` — pass.
- Markdown links — pass; full local audit recorded after edits.
- Contribution IDs/index/status — pass; full audit recorded after edits.
- `git diff --check` — pass.
- `npm run verify` — not run; no runtime feature code changed.

## Limits
- Forced termination during ID allocation can leave `.index-lock`; recovery steps are in `scripts/README.md`.
