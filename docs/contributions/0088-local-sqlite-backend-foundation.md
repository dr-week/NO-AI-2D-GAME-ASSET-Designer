# 0088 · Local SQLite backend foundation
Status: complete
Owner: Codex

## Files
- `backend/src/` — loopback API, SQLite v1 migration, and validated landscape-template repository.
- `scripts/start-local-backend.ps1`, `vite.config.ts`, `tsconfig.node.json` — launch, proxy, and type-check the optional service.
- `research/backend-architecture.md`, `docs/design.md`, `docs/status.md`, `docs/tasks/README.md`, `scripts/README.md` — record boundaries, current gap, and next slice.

## Checks
- `npm run check` — pass; zero errors/warnings
- `npm run build` — pass; existing 3D chunk warning
- `GET /health`, `GET /api/v1/landscape-templates` — pass on loopback SQLite service

## Limits
- The template UI still uses IndexedDB; SQLite adapter migration is the next task. `node:sqlite` is release candidate in Node 24.15.
