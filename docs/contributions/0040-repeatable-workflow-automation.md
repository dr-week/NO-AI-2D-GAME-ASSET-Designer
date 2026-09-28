# 0040 · Repeatable workflow automation
Status: complete
Owner: Codex

## Files
- `scripts/new-contribution.mjs` — allocate the next record number, create a handoff, and index it; support a non-writing dry run.
- `skills/2dmaker-development/SKILL.md` — point contributors to existing repo guidance and automation.
- `docs/contributing.md` — use the generator and one verify command.
- `docs/contributions/README.md` — index this handoff.

## Checks
- `node --check scripts/new-contribution.mjs` — pass.
- `node scripts/new-contribution.mjs --dry-run "Workflow automation"` — pass; selected next ID without writing.
- `node scripts/new-contribution.mjs "Repeatable workflow automation"` — pass; created and indexed this record.
- `git diff --check` — pass.

## Limits
- Duplicate IDs and stale index statuses were reconciled in contribution 0039.
