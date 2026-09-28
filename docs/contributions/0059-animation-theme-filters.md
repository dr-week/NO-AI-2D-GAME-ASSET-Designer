# 0059 · Animation theme filters
Status: complete
Owner: Codex

## Files
- `src/features/animation/themeEngine.ts` — add preset category metadata.
- `src/features/image-animation/ui/ImageLayerPanel.svelte` — filter existing presets by category in the existing animation drawer.
- `src/features/image-animation/ui/ImageAnimationEditor.svelte`, `src/app/App.svelte` — clearer Animation label.
- `docs/ui-ux/01-workspace/script.md`, `docs/ui-ux/06-image-animation/script.md`, `docs/ui-ux/08-structure-feedback/script.md`, `docs/status.md`, `docs/tasks/README.md` — updated behavior and queue.
- `docs/tasks/2026-09-29-animation-theme-filter.md` — task record.

## Checks
- `npm run check` — pass, zero Svelte/TypeScript diagnostics.
- Live app navigation shows one Animation destination. Theme filter is part of the existing motion drawer; theme filters select matching presets and preserve a single Apply to layer action.

## Limits
- Categories organize motion presets only; they do not recolor artwork or alter character/landscape art direction.
