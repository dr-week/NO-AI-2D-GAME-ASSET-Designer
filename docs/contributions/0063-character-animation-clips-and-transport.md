# 0063 · Character animation clips and transport
Status: complete
Owner: Codex

## Files
- `src/features/character/model/animation.ts` — add Breathe and Reach pose-to-pose clips; keep eased keyframe sampling.
- `src/features/character/ui/CharacterAnimationControls.svelte` — add clip selection, previous/next key pose, speed, scrub, restart, and playback controls.
- `docs/ui-ux/02-character/script.md` — document the current animation workflow.

## Checks
- `npm run check` — pass; no diagnostics.
- `npm run build` — pass; Vite reports a 569.75 kB chunk warning for the separate 3D workspace.
- Research: [animation principles and timing](https://learn.microsoft.com/en-us/windows/win32/lwef/animation-principles), [Krita timeline controls](https://docs.krita.org/en/reference_manual/dockers/animation_timeline.html).

## Limits
- No authored keyframe editing or onion-skin display; built-in clips remain data-defined.
