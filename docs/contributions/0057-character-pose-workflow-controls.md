# 0057 · Character pose workflow controls
Status: complete
Owner: Codex

## Files
- `src/features/character/model/skeleton.ts`, `poses.ts`, `randomCharacter.ts` — shared joint controls, mirror, and bounded random-pose helpers.
- `src/features/character/ui/CharacterControls.svelte`, `CharacterAnimationControls.svelte`, `CharacterCanvas.svelte` — expose full-joint controls, mirror/random actions, clip restart, and accurate pose label.
- `src/app/App.svelte`, `docs/ui-ux/02-character/script.md` — connect actions and document workflow.

## Checks
- `npm run check`, `npm run build` — pass.
- Research: [OpenToonz cutout animation](https://opentoonz.readthedocs.io/en/latest/creating_cutout_animation.html) describes hierarchical body parts and per-section keyframes; [Krita onion skin](https://docs.krita.org/en/reference_manual/dockers/onion_skin.html) illustrates neighboring-frame review.
- Design workflow: [character silhouette-to-render stages](https://www.creativebloq.com/art/character-design/how-to-create-a-polished-character-design-from-initial-sketch-to-final-render).

## Limits
- Editable timeline, onion skin, silhouette drawing, and IK remain outside current character model scope.
