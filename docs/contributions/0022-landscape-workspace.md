# 0022 · Landscape workspace
Status: complete
Owner: Codex

## Files
- `src/app/App.svelte` — side navigation and workspace routing.
- `src/features/landscape/model/scene.ts` — deterministic SVG scene generator.
- `src/features/landscape/ui/LandscapeWorkspace.svelte` — preset, palette, preview, and export.
- `src/lib/Icon.svelte` — navigation and landscape icons.
- `docs/tasks/2026-09-28-landscape-workspace.md` — scope and handoff.
- `docs/contributions/README.md` — index this record.

## Checks
- `npm run verify` — pass; type-check, 22 tests, production build.

## Limits
- First step: editable vector landscape from deterministic scene presets; no image import or AI inference.
