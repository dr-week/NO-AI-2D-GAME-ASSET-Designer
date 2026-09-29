# 0033 · Color mask memory
Status: complete
Owner: Codex

## Files
- `src/features/image-animation/model/imageMasks.ts` — reuse the source pixel buffer as mask output, removing one full-canvas allocation.

## Checks
- Automated checks — not run; not requested.
- `git diff --check` — pass.

## Limits
- This reduces peak temporary memory by up to 4 MiB per mask at the existing 1024 × 1024 cap. Total runtime memory and mask quality remain unmeasured under I-004.

## Follow-up · 2026-09-29
- `src/features/image-animation/model/colorMaskPixels.ts` — replaced the extra visited map with alpha sentinels during flood fill; RGB remains unchanged until the final mask pass.
- Removes another 1 MiB scratch allocation at the 1024 × 1024 cap. Queue and canvas buffers remain; this is not a process-memory measurement.
- `git diff --check` — pass. No upstream code copied. Tests/build not run.
