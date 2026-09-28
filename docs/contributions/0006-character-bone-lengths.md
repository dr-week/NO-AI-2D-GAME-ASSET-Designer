# 0006 · Character bone lengths
Status: complete
Owner: Codex

## Files
- `src/features/character/model/boneLengths.ts` — length groups and bounded skeleton scaling.
- `src/features/character/ui/CharacterControls.svelte` — grouped length controls.
- `src/app/App.svelte` — scale state and skeleton derivation.
- `docs/tasks/2026-09-28-character-bone-lengths.md` — behavior and limits.

## Checks
- `npm run check` — pass
- `npm run build` — pass

## Limits
- Symmetric lengths only; custom pivots, asymmetry, and animation remain planned.
