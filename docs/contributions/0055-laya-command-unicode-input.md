# 0055 · Laya command Unicode input
Status: complete
Owner: Codex

## Files
- `src/features/laya/model/commands.ts` — normalize compatibility forms and Unicode minus before parsing.
- `tests/layaDecision.test.mjs` — cover full-width input and Unicode minus.
- `research/stack-and-architecture.md` — add the native normalization reference.

## Checks
- `npm run test:laya` — pass
- `npm run check` — pass

## Limits
- NFKC folds compatibility characters by design; parser still accepts only its explicit command grammar.
