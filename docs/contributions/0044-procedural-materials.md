# 0044 · Procedural landscape materials
Status: complete
Owner: Codex

## Files
- `src/features/landscape/model/materials.ts` — bounded seeded SVG grain/ripple patterns and tile-loop data.
- `src/features/landscape/model/scene.ts` — compose optional material into scene SVG.
- `src/features/landscape/model/templates.ts` — validate and preserve optional material settings while accepting older templates.
- `src/features/landscape/ui/LandscapeWorkspace.svelte` — expose material and loop controls.
- `tests/proceduralMaterials.test.mjs`, `package.json` — deterministic and loop-contract tests.
- `research/procedural-2d-art.md`, `docs/requirements.md`, `docs/design.md`, `docs/status.md`, `docs/roadmap/technology-register.md` — record findings and boundaries.

## Checks
- `npm run verify` — pass; 39 tests, Svelte/TypeScript checks, and production build.
- `git diff --check` — pass.

## Limits
- Material textures cover the foreground landscape shape. No editable material authoring, raster export, or cross-feature shared package yet.
