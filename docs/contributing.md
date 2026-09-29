# Contributing

Keep changes small. Give each rule and state one owner. Coordinate file overlap; do not
overwrite active work. Guidance stays flexible when a task needs a different approach.
Use the [documentation map](README.md) to update the authoritative record for each change.

## 1. Before editing

- Read `README.md`, `docs/requirements.md`, `docs/design.md`, and relevant feature docs.
- Check the contribution index for active file ownership before editing; coordinate overlap in the task thread.
- Search for existing types, helpers, and behavior before adding another version.
- Run `node scripts/new-contribution.mjs "Short title"` to create and index a numbered record.
  Allocation is serialized; replace its placeholder with exact paths and mark overlapping files as claimed.

## 2. While editing

- Keep UI, domain rules, and file/storage boundaries with their feature owners.
- Reuse code and browser APIs. Add shared code only when real callers need one owner.
- Validate imported/persisted data. Keep controls accessible and failures recoverable.
- Update the contribution record when scope, files, status, or checks change.
- Update requirements/UI docs only when behavior or status changed.
- For bundled or modified artwork, follow [asset intake](roadmap/free-2d-assets.md) and add its provenance to the asset catalog. If rights are unclear, link the source instead of bundling it.

## 3. Finish

- Run `npm run verify` for code changes. Record results and any failure in the contribution record.
- Mark record complete; list remaining limits and exact files changed.
- Do not claim performance or browser coverage without measurements.

Local user data stays local unless product scope changes. No empty folders, contributor-name
folders, duplicate logic, or mandatory approval gates.

Repository workflow skill: [`skills/2dmaker-development/SKILL.md`](../skills/2dmaker-development/SKILL.md).
