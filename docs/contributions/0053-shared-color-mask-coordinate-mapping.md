# 0053 · Shared color mask coordinate mapping
Status: complete
Owner: Codex

## Files
- `src/features/image-animation/model/colorMaskPixels.ts` — own dimension scaling and source-to-mask coordinate mapping.
- `src/features/image-animation/model/imageMasks.ts`, `colorMask.worker.ts` — share identical mapping in fallback and worker.

## Checks
- `npm run check`, `npm run build` — pass.
- Research: [MDN transferable objects](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects); retain worker/fallback ownership boundary.

## Limits
- Runtime browser/memory measurements remain open under I-004.
