# 0087 · Landscape SVG export boundary
Status: complete
Owner: contributor

## Files
- `src/features/landscape/io/sceneExport.ts` — own SVG download and descriptive scene-recipe filename.
- `src/features/landscape/model/scene.ts` — remove unused composition imports exposed by strict type checking.
- `src/features/landscape/ui/LandscapeWorkspace.svelte` — delegate export to feature I/O.
- `tests/landscapeTemplates.test.mjs` — verify complete filenames and legacy defaults.
- `docs/design.md` — record export boundary owner.

## Checks
- `npm run check` — pass; zero Svelte/TypeScript errors or warnings.
- `npm run test:landscape` — pass; 12 tests.
- `git diff --check` — pass.

## Limits
- Filenames encode scene recipe options; browser download behavior still depends on the browser.
