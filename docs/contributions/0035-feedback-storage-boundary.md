# 0035 · Feedback storage boundary
Status: complete
Owner: Codex

## Files
- `src/features/image-animation/io/feedbackStore.ts` — own browser storage, folder writes, and JSONL serialization; discard malformed stored entries.
- `src/features/image-animation/ui/AnimationFeedback.svelte` — keep trial state and controls in the view.

## Checks
- `npm run check` — pass; no Svelte or TypeScript diagnostics.
- `npm run test:feedback` — pass; 2 tests.
- `npm run build` — pass.
- `npm run verify` — initially blocked by an exact floating-point assertion in the character-animation test; a later run passed the full suite.
- Follow-up `npm run verify` — pass; 39 tests, type check, and production build.

## Limits
- `git diff --check` — pass.
