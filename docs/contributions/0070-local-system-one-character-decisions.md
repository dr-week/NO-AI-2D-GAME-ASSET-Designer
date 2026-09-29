# 0070 · Local System 1 character decisions
Status: complete
Owner: Codex

## Files
- `src/features/laya/model/localCharacterDecision.ts` — maps explicit brief cues into the existing validated decision contract.
- `src/features/laya/ui/CharacterCommandPanel.svelte` — adds local quick design in the Character workspace.
- `src/app/App.svelte` — applies returned bounded proportions and bone lengths.
- `docs/tasks/2026-09-28-laya-character-decisions.md`, `docs/issues.md` — records the local caller and provider limitation.

## Checks
- `npm run check` — pass, zero errors or warnings.

## Limits
- Rule-based and browser-local; this does not add an LLM, inference provider, server, or learned feedback loop.
- Supports explicit size/width/length cues only; unmentioned traits use balanced defaults.
- GitHub issue #1 remains open for provider and target-device quality/performance decisions.
