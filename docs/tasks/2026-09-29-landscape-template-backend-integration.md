# Landscape template backend integration

Status: Planned · Priority: Next

Connect the existing landscape template UI to the local SQLite API. Keep current templates recoverable and avoid silent store divergence.

## Work sections

1. **Contract** — Confirm API request/response shapes, validation errors, size limits, and version behavior against `research/backend-architecture.md`.
2. **Migration** — Copy IndexedDB templates to SQLite once; make retry safe and preserve browser data until migration is confirmed.
3. **Adapter** — Route template list/save/delete/import through the feature IO boundary; keep components independent of HTTP and SQLite.
4. **Offline behavior** — Define explicit API-unavailable behavior; retain recoverable edits and reconcile them without silent overwrite or duplicate records.
5. **Verification** — Check CRUD/import, migration retry, offline recovery, and existing template flows; update issues, status, and contribution log.

## Boundaries

- No remote service, account system, generic repository layer, or project-library schema.
- Keep JSON export/import as a user-controlled backup path.
- Reuse existing validators and API; do not duplicate schema rules in UI components.

## Acceptance

- Existing browser templates survive migration and retries.
- Online changes persist through the API; offline failures remain recoverable.
- One authoritative copy is clear after each operation; errors are visible and actionable.
- Browser checks and limits are recorded in the contribution log.
