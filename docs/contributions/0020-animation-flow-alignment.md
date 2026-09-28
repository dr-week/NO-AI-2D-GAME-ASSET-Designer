# 0020 · Animation flow alignment
Status: complete
Owner: Codex

## Files
- `src/features/animation/themeEngine.ts` — remove unused theme/variant fields and derive preview values from canonical motion values.
- `src/features/image-animation/ui/ImageAnimationEditor.svelte` — use the lean template API.
- `src/features/image-animation/ui/ImageCanvas.svelte` — share background motion timing.
- `src/features/image-animation/io/svgExport.ts` — match preview background timing.
- `tests/animation.test.mjs` — check canonical motion values and preview timing.
- `docs/design.md`, `docs/status.md` — document delivered behavior and boundary.
- `README.md` — correct the animation module description.
- `docs/contributions/README.md` — index this record.

## Checks
- `npm run check` — pass; zero warnings/errors.
- `npm run verify` — pass; 18 tests and production build.

## Limits
- Keeps supported CSS preview and animated SVG export. Character keyframes and timeline remain future scope.
