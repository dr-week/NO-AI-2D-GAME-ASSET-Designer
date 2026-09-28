# 0042 · Landscape template ID validation
Status: complete
Owner: Codex

## Files
- `src/features/landscape/model/templates.ts` — own the template ID validator with the data contract.
- `src/features/landscape/io/templateStore.ts` — reuse model validation for lookup and deletion.

## Checks
- `npm run check` — pass; no Svelte or TypeScript diagnostics.
- `npm run build` — pass.

## Limits
- No landscape storage integration test was run.
