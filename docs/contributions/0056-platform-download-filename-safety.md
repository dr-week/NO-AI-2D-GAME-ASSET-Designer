# 0056 · Platform download filename safety
Status: complete
Owner: Codex

## Files
- `src/platform/download.ts` — sanitize suggested filenames and attach/remove the temporary download link.

## Checks
- `npm run check` — pass

## Limits
- Browser and filesystem behavior still decides the final saved name. See [MDN anchor download](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#download) and [MDN blob URLs](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/blob).
