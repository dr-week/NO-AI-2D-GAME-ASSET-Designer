# 0032 · Character motion preview
Status: complete
Owner: Codex

## Files
- `src/features/character/model/animation.ts` — bounded clip data and pose interpolation.
- `src/features/character/ui/CharacterAnimationControls.svelte` — loop, pause, and scrub controls.
- `src/app/App.svelte` — compose animation controls with character preview state.
- `src/lib/Icon.svelte` — play/pause symbols.
- `tests/characterAnimation.test.mjs`, `package.json` — verify clip sampling and rig limits.
- `docs/requirements.md`, `docs/design.md`, `docs/status.md`, `docs/tasks/README.md`, `docs/ui-ux/04-animation/script.md` — align scope and workflow.
- `docs/contributions/README.md` — index this completed handoff.

## Checks
- `npm run verify` — pass; 34 tests and production build.
- `git diff --check` — pass.

## Limits
- One built-in looping wave with scrubbing. Keyframe authoring, clip save, and animation export remain later work.
