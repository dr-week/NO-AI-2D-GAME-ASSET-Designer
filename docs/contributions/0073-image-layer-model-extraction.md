# 0073 · Image layer model extraction
Status: complete
Owner: contributor

## Files
- `src/features/image-animation/model/layers.ts` — own layer cap and image/text layer factories
- `src/features/image-animation/ui/ImageAnimationEditor.svelte` — delegate construction and count checks to model
- `docs/design.md` — record module ownership
- `docs/contributions/0073-image-layer-model-extraction.md` — handoff

## Checks
- `npm run check` — pass; 0 errors, 0 warnings
- `git diff --check` — pass
- Tests — not run

## Limits
- UI remains responsible for user-facing errors and editor state.
