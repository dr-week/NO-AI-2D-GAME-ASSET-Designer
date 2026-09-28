# Windows launcher

Double-click `launch-2dmaker.bat` to start the local Vite development server and open
2D Maker in the default browser. Requires Node.js 24 or newer and installed
dependencies (`npm ci`).

The default port is 5173. If it is occupied, the launcher logs the conflict and exits; it
does not mistake another server's response for its own. For a different port, run
`powershell -File scripts/launch-2dmaker.ps1 -Port 5174`.

The PowerShell supervisor holds a per-user Windows mutex for the lifetime of the server.
Launching the BAT file again reports the existing instance and does not start another
server or browser tab. Vite uses strict port mode and never silently switches ports.

The launcher writes one stdout and stderr log per run under `logs/launcher/`. Startup and
unexpected server exits are appended to `launcher-crashes.log` in that folder. These logs
are ignored by Git. Keep the launcher window open while using the development site; Ctrl+C
stops the supervisor, which terminates its Vite child process.

These logs cover launcher and Vite server failures. Browser-side JavaScript errors remain
in the browser developer console; browser security prevents this local launcher from
writing those errors directly to disk.

Contribution IDs are allocated by `node scripts/new-contribution.mjs "Short title"`.
If a forced stop leaves `docs/contributions/.index-lock`, confirm no allocator is running,
remove that empty lock directory, then retry.
