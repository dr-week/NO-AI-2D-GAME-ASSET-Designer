# 0075 · Landscape environments and lighting system
Status: complete
Owner: contributor

## Files
- `src/features/landscape/model/environments.ts` — environment profile catalog, colors, descriptions, stable IDs.
- `src/features/landscape/model/environmentArtwork.ts` — seeded biome silhouettes with edge-group placement.
- `src/features/landscape/model/lighting.ts` — four sky states, celestial bodies, seeded stars/clouds.
- `src/features/landscape/model/scene.ts` — compose independent landform, environment, lighting, color mood, material, and style layers.
- `src/features/landscape/model/templates.ts` — validate and persist optional environment/light while retaining older recipe compatibility.
- `src/features/landscape/ui/LandscapeWorkspace.svelte` — selectors, randomization, scene caption, scrollable tool panel.
- `src/features/landscape/ui/LandscapeTemplatePanel.svelte` — display environment/light when saved recipes load.
- `tests/landscapeTemplates.test.mjs` — SVG repeatability and preset/environment matrix coverage.
- `docs/requirements.md`, `docs/design.md`, `docs/status.md`, `docs/ui-ux/07-landscape/script.md` — landscape scope and data flow.
- `research/art-direction-foundations.md` — compositional rules and research references.

## Checks
- `npm run check` — pass; zero Svelte/TypeScript errors or warnings.
- `npm run test:landscape` — pass; 8 tests including 24 environment/light and 18 preset/environment combinations.
- `git diff --check` — pass on changed landscape, test, docs, and research files.
- Online references reviewed: Getty landscape planes, NASA vegetation indices, Disney visual development/lighting, Pixar color scripts.

## Limits
- Starter SVG art is stylized and not geographically accurate; region-specific profiles need sourced references and artist review.
- No external asset packs were downloaded or bundled.
