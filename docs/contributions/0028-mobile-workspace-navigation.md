# 0028 · Mobile workspace navigation
Status: complete
Owner: Codex

## Files
- `src/app/App.svelte` — hide drawer labels below 420px and center icon buttons to prevent overlap.
- `docs/contributions/README.md` — index this record.

## Checks
- Browser smoke check at 388px — pass; navigation icons do not overlap content and remain operable.
- Character command and slider, landscape selection, and image empty/project states — pass.
- `npm run verify` — pass; 27 tests, type check, and production build.

## Limits
- Image upload-dependent mask/layer/project/export flows were not run in browser because this session cannot attach a local image file. Their available automated contracts pass.
