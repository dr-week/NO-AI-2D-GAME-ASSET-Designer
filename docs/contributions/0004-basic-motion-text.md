# 0004 · Basic motion and text layers
Status: complete
Owner: Codex

## Files
- [done] `src/features/animation/themeEngine.ts` — shared motion definitions/templates.
- [done] `src/features/image-animation/model/types.ts` — text/image layer fields.
- [done] `src/features/image-animation/io/projectFile.ts` — v2 schema; v1 migration.
- [done] `src/features/image-animation/io/svgExport.ts` — shared-definition SVG export.
- [done] `src/features/image-animation/ui/ImageCanvas.svelte` — shared preview and SVG text.
- [done] `src/features/image-animation/ui/ImageLayerPanel.svelte` — text and motion controls.
- [done] `src/features/image-animation/ui/ImageAnimationEditor.svelte` — create/apply handlers.
- [done] `docs/contributing.md` — numbered-log workflow.
- [done] `docs/contributions/README.md` — log rules and index.
- [done] `docs/contributions/0004-basic-motion-text.md` — this handoff.
- [done] `docs/design.md`, `docs/requirements.md` — architecture and scope.
- [done] `docs/ui-ux/04-animation/script.md` — animation states/controls.
- [done] `docs/ui-ux/05-project/script.md` — project version/migration.
- [done] `docs/ui-ux/06-image-animation/script.md` — text/motion flow.
- [done] `README.md` — contribution log link.

## Checks
- `npm run check` — pass (0 errors, 0 warnings).
- `npm run build` — pass.

## Limits
- Material-inspired X/Y entrances animate one layer; paired container/shared-axis transitions are not implemented.
- Character animation, editable timing, and keyframe timeline remain planned.
- Reduced-motion preference disables preview animation; SVG export remains animated.
