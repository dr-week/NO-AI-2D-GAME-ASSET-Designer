# 0014 · Layer data contract and flows
Status: complete
Owner: Codex

## Files
- `src/features/image-animation/model/types.ts` — split image and text layer contracts.
- `src/features/image-animation/io/projectFile.ts` — validate unknown data and normalize legacy layers.
- `src/features/image-animation/io/svgExport.ts` — export required text fields directly.
- `docs/design.md` — document UI, model, and browser-IO flow.
- `docs/contributions/README.md` — index this record while preserving active contribution 0013.
- `docs/contributions/0014-layer-data-contract.md` — this handoff.

## Checks
- `npm run check` — pass (0 errors, 0 warnings).
- `npm run build` — pass.

## Limits
- Browser-local app only; no remote API/backend.
