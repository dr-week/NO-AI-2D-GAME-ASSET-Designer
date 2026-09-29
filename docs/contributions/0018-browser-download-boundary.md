# 0018 · Shared browser download boundary
Status: complete
Owner: Codex

## Files
- `src/platform/download.ts` — centralize Blob download and deferred URL cleanup.
- `src/features/character/io/exportSvg.ts` — use shared helper.
- `src/features/image-animation/io/svgExport.ts` — use shared helper.
- `src/features/image-animation/ui/ImageAnimationEditor.svelte` — use shared helper for project downloads.
- `src/features/image-animation/ui/AnimationFeedback.svelte` — use shared helper for log downloads.
- `docs/design.md` — document shared browser platform utilities.
- `docs/contributions/README.md` — index this record.

## Checks
- `npm run check` — pass.
- `npm run verify` — pass; type-check, 16 tests, production build.

## Limits
- Browser-local app; no remote backend. Image masks retain the bounded typed-array queue because dynamic growth added complexity without a clear measured benefit.
