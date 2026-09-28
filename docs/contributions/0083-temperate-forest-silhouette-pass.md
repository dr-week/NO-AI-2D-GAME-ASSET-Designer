# 0083 · Temperate forest silhouette pass
Status: complete
Owner: contributor

## Files
- `src/features/landscape/model/environmentArtwork.ts` — replace uniform temperate fir rows with seeded broadleaf/conifer silhouettes, varied scales, and edge groupings.
- `tests/landscapeTemplates.test.mjs` — check repeatability, variation, prop mix, and frame-edge placement.

## Checks
- `npm run check` — pass; zero Svelte/TypeScript errors or warnings.
- `npm run test:landscape` — pass; 10 tests.
- `git diff --check` — pass.

## Limits
- Improves the temperate foreground only; other biome profiles remain unchanged.
- Artistic quality still needs visual review and artist-authored asset options.
