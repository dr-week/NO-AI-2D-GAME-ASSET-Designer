# 0037 · Color mask worker
Status: complete
Owner: Codex

## Files
- `src/features/image-animation/model/colorMaskPixels.ts` — own the single flood-fill implementation and in-place pixel output.
- `src/features/image-animation/model/colorMask.worker.ts` — resize and process image data with `OffscreenCanvas` away from the UI thread.
- `src/features/image-animation/model/imageMasks.ts` — transfer image bitmaps, convert worker output for existing project storage, and preserve the native fallback.
- `src/features/image-animation/ui/ImageAnimationEditor.svelte` — handle asynchronous results, stale-request guards, cancellation, and worker cleanup.

## Checks
- `npm run check` — pass; Svelte and TypeScript report zero errors and warnings.
- Automated tests — not run.

## Limits
- Worker path is feature-detected; fallback remains synchronous. Performance, browser compatibility, and peak memory still need measurement under I-004. No additional runtime or package was installed because browser-native APIs fit the current requirements. Contribution index update is deferred while documentation consolidation owns that shared file.
