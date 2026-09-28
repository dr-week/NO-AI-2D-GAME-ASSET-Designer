# 0086 · Seeded night sky design pass
Status: complete
Owner: contributor

## Files
- `src/features/landscape/model/lighting.ts` — seeded star field, connected constellation groups, variable moon phase/position, arctic aurora, and alien orbiting moon.
- `tests/landscapeTemplates.test.mjs` — night feature count, seeded variation, phase coverage, and environment checks.
- `docs/design.md`, `research/art-direction-foundations.md` — renderer ownership and compact art rule.

## Checks
- `npm run check` — pass; zero Svelte/TypeScript errors or warnings.
- `npm run test:landscape` — pass; 11 tests.
- `git diff --check` — pass.

## Limits
- Night-sky artwork remains procedural SVG; artist review and richer celestial asset controls remain future work.
