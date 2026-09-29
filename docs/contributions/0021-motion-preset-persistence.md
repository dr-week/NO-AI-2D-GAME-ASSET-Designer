# 0021 · Motion preset persistence
Status: complete
Owner: Codex

## Files
- `src/features/animation/themeEngine.ts` — derive default durations and return only motion settings.
- `src/features/image-animation/ui/ImageAnimationEditor.svelte` — consume the smaller template result.
- `src/features/image-animation/ui/ImageLayerPanel.svelte` — update motion and duration together through one handler.
- `tests/animation.test.mjs`, `tests/projectFile.test.mjs` — verify preset timing and project round-trip contract.
- `docs/contributions/README.md` — index this record.

## Checks
- `npm run check` — pass; zero diagnostics.
- `npm run verify` — pass; 22 tests and production build.

## Limits
- No server database exists. Project JSON and browser-local snapshot remain the persistence stores; no schema change required.
