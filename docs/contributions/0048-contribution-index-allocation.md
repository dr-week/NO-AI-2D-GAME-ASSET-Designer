# 0048 · Contribution index allocation
Status: complete
Owner: Codex

## Files
- `scripts/new-contribution.mjs` — allocate IDs under an atomic directory lock so parallel invocations cannot reuse an ID.
- `docs/contributions/README.md` — index this handoff.

## Checks
- `node --check scripts/new-contribution.mjs` — pass.
- `node scripts/new-contribution.mjs --dry-run "Contribution collision guard"` — pass; selected the next ID without writing.
- `git diff --check` — pass.

## Limits
- Direct edits to the contribution index still require contributor coordination; use the helper for new records.
