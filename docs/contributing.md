# Contributing

Keep changes small. Give each rule and state one owner. Coordinate file overlap; do not
overwrite active work. Guidance stays flexible when a task needs a different approach.

## 1. Before editing

- Read `README.md`, `docs/requirements.md`, `docs/design.md`, and relevant feature docs.
- Search for existing types, helpers, and behavior before adding another version.
- Run `node scripts/new-contribution.mjs "Short title"` to create and index a numbered record.
  Allocation is serialized; replace its file placeholder with exact paths and mark overlapping files as claimed.

## 2. While editing

- Keep UI, domain rules, and file/storage boundaries with their feature owners.
- Reuse code and browser APIs. Add shared code only when real callers need one owner.
- Validate imported/persisted data. Keep controls accessible and failures recoverable.
- Update the contribution record when scope, files, status, or checks change.
- Update requirements/UI docs only when behavior or status changed.

## 3. Finish

- Run `npm run verify` for code changes. Record results and any failure in the contribution record.
- Mark record complete; list remaining limits and exact files changed.
- Do not claim performance or browser coverage without measurements.

Local user data stays local unless product scope changes. No empty folders, contributor-name
folders, duplicate logic, or mandatory approval gates.

Repository workflow skill: [`skills/2dmaker-development/SKILL.md`](../skills/2dmaker-development/SKILL.md).
