# 0007 · SVG template contract tests
Status: complete
Owner: Codex

## Files
- `package.json` — add built-in Node test command [done]
- `tests/animation.test.mjs` — test template mapping, deterministic variants, ranges, and CSS output [done]
- `docs/contributions/README.md` — register this contribution [done]
- `research/animation-systems.md` — document fit and limits of the supplied SVG patterns [done]

## Checks
- `npm run test:animation` — pass, 6 tests
- `npm run check` — pass
- `npm run build` — pass

## Limits
- Tests cover data contracts, not browser playback or visual output.
- Shape `rx` morphs and timed multi-card sequences remain outside the current template model.
