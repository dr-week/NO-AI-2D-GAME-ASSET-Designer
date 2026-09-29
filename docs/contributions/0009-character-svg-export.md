# 0009 · Character SVG export
Status: complete
Owner: Codex

## Files
- `src/features/character/io/exportSvg.ts` — serialize and download standalone SVG.
- `src/features/character/ui/CharacterCanvas.svelte` — expose export action from rendered geometry.
- `docs/tasks/2026-09-28-character-svg-export.md` — scope and handoff.
- `docs/ui-ux/02-character/script.md` — document export control.
- `docs/requirements.md` — add SVG export acceptance.
- `docs/design.md` — document character I/O boundary.
- `research/animation-systems.md` — record current SVG-rig decision and references.
- `README.md` — reflect character export support.
- `docs/contributions/README.md` — index this record.

## Checks
- `npm run check` — pass.
- `npm run build` — pass.

## Limits
- SVG export only; raster PNG and character project files remain planned.
