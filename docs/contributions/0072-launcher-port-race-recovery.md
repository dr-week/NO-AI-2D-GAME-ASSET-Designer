# 0072 · Launcher port race recovery
Status: complete
Owner: Codex

## Files
- `scripts/launch-2dmaker.ps1` — detect and reuse an existing app both before and after Vite startup race.
- `scripts/README.md` — document collision recovery.

## Checks
- `powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File scripts/launch-2dmaker.ps1 -Port 5173` — pass; reused project Vite instance and opened it.

## Limits
- The existing project Vite process on 5173 was reused and left running.
