# Contributing

Keep changes small. Give each rule and state one owner. Coordinate file overlap; do not
overwrite active work. Guidance stays flexible when a task needs a different approach.

## 1. Before editing

- Read `README.md`, `docs/requirements.md`, `docs/design.md`, and relevant feature docs.
- Search for existing types, helpers, and behavior before adding another version.
- Add a numbered record in [`docs/contributions/`](contributions/README.md). List exact
  files and mark overlapping files as claimed while work is active.

## 2. While editing

- Keep UI, domain rules, and file/storage boundaries with their feature owners.
- Reuse code and browser APIs. Add shared code only when real callers need one owner.
- Validate imported/persisted data. Keep controls accessible and failures recoverable.
- Update the contribution record when scope, files, status, or checks change.
- Update requirements/UI docs only when behavior or status changed.

## 3. Finish

- Run `npm run check` and `npm run build` for code changes when practical. Record results.
- Mark record complete; list remaining limits and exact files changed.
- Do not claim performance or browser coverage without measurements.

Local user data stays local unless product scope changes. No empty folders, contributor-name
folders, duplicate logic, or mandatory approval gates.
