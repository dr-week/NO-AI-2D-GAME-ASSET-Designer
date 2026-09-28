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
