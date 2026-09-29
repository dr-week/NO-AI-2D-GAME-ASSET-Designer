# 0017 · Japanese minimal UI
Status: complete
Owner: Codex

## Files
- `src/lib/Icon.svelte` — small local SVG icon set.
- `src/styles/app.scss` — warm paper, ink, and vermilion tokens.
- `src/features/character/ui/CharacterControls.svelte` — icon-led control drawers.
- `src/features/character/ui/CharacterCanvas.svelte` — preview/export presentation.
- `src/features/image-animation/ui/ImageLayerPanel.svelte` — grouped tool drawers.
- `src/features/image-animation/ui/ImageAnimationEditor.svelte` — balanced workspace layout.
- `src/app/App.svelte` — consistent icon-led workspace header.
- `docs/tasks/2026-09-28-japanese-minimal-ui.md` — concise UI task and handoff.
- `docs/contributions/README.md` — [done] index this record.
- `docs/contributions/0017-japanese-minimal-ui.md` — contribution record.

## Checks
- `npm run verify` — pass; type-check, 18 tests, and production build.
- Browser smoke — character workspace and controls render.

## Limits
- No framework or icon dependency.
