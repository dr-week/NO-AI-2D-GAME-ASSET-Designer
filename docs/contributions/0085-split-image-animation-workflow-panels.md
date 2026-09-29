# 0085 · Split image animation workflow panels
Status: complete
Owner: Codex

## Files
- `src/features/image-animation/ui/ImageLayerPanel.svelte` — keeps workspace composition and delegates each editing workflow.
- `src/features/image-animation/ui/ToolDrawer.svelte` — shares drawer disclosure and heading structure.
- `src/features/image-animation/ui/ProjectActions.svelte` — owns project save/open/restore/export controls.
- `src/features/image-animation/ui/MotionControls.svelte` — owns theme filtering and preset controls.
- `src/features/image-animation/ui/LayerAuthoring.svelte` — owns region-mask and text creation UI state.
- `src/features/image-animation/ui/LayerStack.svelte` — owns selection and layer property editing.
- `src/features/image-animation/ui/image-animation-panel.scss` — single shared style owner for panel and extracted controls.
- `src/features/image-animation/model/motion.ts` — shares motion-to-duration mapping between motion controls.
- `docs/design.md`, `docs/ui-ux/06-image-animation/script.md`, `docs/contributions/README.md` — records UI ownership, workflow groups, and completion.

## Checks
- `git diff --check` — pass.
- Automated checks — not run.

## Limits
- Browser interaction was not manually exercised.
