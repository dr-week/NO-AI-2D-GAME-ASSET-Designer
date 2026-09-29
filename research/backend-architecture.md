# Local backend architecture

Reviewed: 2026-09-29. Keep backend optional and local-first. No account, cloud service, or
database administration for the single-studio workflow.

## Shape

```text
Svelte UI → feature IO adapter → Vite dev proxy → loopback Node API → SQLite file
                                                   └─ validate template schema
```

| Path | Responsibility |
|---|---|
| `backend/src/server.ts` | Loopback HTTP routes and bounded JSON handling. |
| `backend/src/database.ts` | SQLite connection and versioned schema migration. |
| `backend/src/landscapeTemplateRepository.ts` | Validated template list/upsert/delete and atomic bulk upsert. |
| `backend/src/config.ts` | Loopback port and OS user-data location. |
| `vite.config.ts` | Development proxy under `/api/backend`. |
| `scripts/start-local-backend.ps1` | Optional local service launcher. |

The first API slice exposes `GET /health` and CRUD/import routes at
`/api/v1/landscape-templates`. SQLite stores versioned JSON recipes, not rendered SVG or image
blobs. Parameterized SQL and the existing template validator guard writes. Requests are capped
at 2 MB. The service binds to `127.0.0.1` only.

## Runtime and limits

- Node.js 24.15+; no new package. SQLite uses built-in `node:sqlite`; TypeScript runs through
  Node's type stripping for this service.
- Node documents `node:sqlite` as Release Candidate in Node 24.15. Keep its use behind the
  repository adapter and recheck stability before packaging the backend as a required runtime.
- Synchronous SQLite operations fit this low-volume local API; keep heavy rendering and model
  inference out of request handlers.
- Database path: `%LOCALAPPDATA%/2DMaker/2dmaker.sqlite` on Windows; XDG data path on Linux;
  Application Support on macOS. `TWO_D_MAKER_DATA_DIR` overrides it.
- The landscape UI still uses IndexedDB. Do not switch stores until one-time migration and
  offline fallback semantics are implemented. Character/image projects remain browser-local.

## Next boundary

Connect the landscape template IO adapter to this API, migrate existing IndexedDB records once,
and keep offline edits recoverable without silently diverging stores. Keep route and repository
feature-specific; add a generic project table only when a second persisted entity needs it. The
implementation is divided in the [five-section task plan](../docs/tasks/2026-09-29-landscape-template-backend-integration.md).

## References

- [Node.js 24 SQLite API](https://nodejs.org/download/release/latest-v24.x/docs/api/sqlite.html)
- [SQLite: appropriate uses](https://www.sqlite.org/whentouse.html)
- [Backend implementation status](../docs/status.md)
