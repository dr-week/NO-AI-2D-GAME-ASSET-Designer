# Windows launcher

Double-click `launch-2dmaker.bat` to start the local Vite development server and open
2D Maker in the default browser. Requires Node.js 24 or newer and installed
dependencies (`npm ci`).

The default port is 5173. If it already serves the 2D Maker page, the launcher opens that
instance. If another 2D Maker process claims the port during startup, the launcher reuses
that instance. If another service owns it, the launcher logs the conflict and exits. For a
different port, run `powershell -File scripts/launch-2dmaker.ps1 -Port 5174`.

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

## Optional local backend

For the SQLite API, open a second PowerShell window and run
`powershell -File scripts/start-local-backend.ps1`. It binds only to `127.0.0.1:4174` and
stores the database under the OS user-data directory. The landscape template UI still uses
IndexedDB; see [backend architecture](../research/backend-architecture.md) before enabling it.

## Optional Laya model

For local development CPU inference, open a second PowerShell window and run
`powershell -File scripts/start-laya-system-one.ps1`. This uses the community `laya-system-one`
runtime, pinned to 1.3.3. First launch installs its native runtime; first prediction downloads
roughly 324 MB of model weights. Nothing is added to the app bundle. Bind stays on
`127.0.0.1:8081`; Vite proxies the development UI request. If the service is stopped, manual
controls and deterministic rules remain available. Review every suggestion. See the
[Laya integration decision](../research/laya-integration.md) and the
[runtime project](https://github.com/italoalmeida0/laya-system-one).

Contribution IDs are allocated by `node scripts/new-contribution.mjs "Short title"`.
If a forced stop leaves `docs/contributions/.index-lock`, confirm no allocator is running,
remove that empty lock directory, then retry.
