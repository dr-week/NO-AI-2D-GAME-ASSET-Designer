# Task: image-animation modules

**Status:** Complete · 2026-09-28

- Split editor orchestration, layer controls, canvas, file loading, masks, geometry,
  and feedback into feature-owned modules.
- Keep source image shared by object URL; cap import at 16 MP and layers at 32.
- Checks: `npm run check`, `npm run build`.
- Limits: masks favor flat fills; moving cutouts needs a clean plate. Color selection uses a
  worker with a synchronous fallback; runtime memory and browser compatibility remain unmeasured.

Architecture: [design](../design.md). User flow: [UI-06](../ui-ux/06-image-animation/script.md).
