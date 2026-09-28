# 0078 · Purpose-led 2D motion easing
Status: complete
Owner: Codex

## Files
- `src/features/animation/themeEngine.ts` — define bounded easing by motion purpose.
- `src/features/image-animation/ui/ImageCanvas.svelte`, `src/features/image-animation/io/svgExport.ts` — apply matching easing in preview and SVG export.
- `research/art-direction-foundations.md`, `docs/design.md` — record design flow, constraints, and sources.

## Checks
- `npm run check` — pass; zero errors/warnings
- `npm run build` — pass; existing Three.js chunk-size warning remains

## Limits
- Motion remains CSS-based and lightweight; timing values need visual review on representative artwork.
