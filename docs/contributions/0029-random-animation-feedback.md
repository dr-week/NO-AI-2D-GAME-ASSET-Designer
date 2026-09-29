# 0029 · Random animation feedback
Status: complete
Owner: Codex

## Files
- `src/features/image-animation/model/feedback.ts` — build a compact rating snapshot from the generated scene.
- `src/features/image-animation/ui/AnimationFeedback.svelte` — record rating snapshots, report storage failures accurately, and remove unused motion-choice list.
- `tests/feedback.test.mjs`, `tests/animation.test.mjs`, `package.json` — verify rating data and full random motion coverage.
- `docs/contributions/README.md` — index this record.

## Checks
- `npm run verify` — pass; 30 tests, type check, and production build.

## Limits
- Feedback remains local/browser or user-selected folder output. Ratings do not train the editor.
