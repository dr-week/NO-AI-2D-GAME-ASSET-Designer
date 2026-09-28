# 0015 · Laya commands and Windows launcher
Status: complete
Owner: Codex

## Files
- `src/features/laya/model/commands.ts` — [done] parse and validate deterministic character commands alongside the Laya decision contract.
- `src/features/laya/ui/CharacterCommandPanel.svelte` — [done] expose command input and help.
- `src/app/App.svelte` — [done] apply validated commands to feature state.
- `scripts/launch-2dmaker.bat` — [done] Windows entry point.
- `scripts/launch-2dmaker.ps1` — [done] single-instance server supervisor and crash logging.
- `scripts/README.md` — [done] document launcher use and log locations.
- `README.md`, `docs/requirements.md`, `docs/design.md`, `docs/issues.md`, `docs/status.md`, `docs/ui-ux/02-character/script.md` — [done] document commands and launcher behavior.
- `docs/contributions/README.md` — [done] index this work.
- `docs/contributions/0015-laya-windows-launcher.md` — [done] record ownership and completion.

## Checks
- `npm run check` — not run
- `npm run build` — not run
- Windows launcher — not run
- `git diff --check` — pass

## Limits
- Laya accepts only documented command forms; no natural-language model or remote service.
- Launcher starts the local Vite development server.
