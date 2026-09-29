$ErrorActionPreference = 'Stop'

if (-not (Get-Command node.exe -ErrorAction SilentlyContinue)) {
  throw 'Node.js 24.15 or newer is required for the local SQLite backend.'
}

$nodeVersion = (node.exe --version).TrimStart('v').Split('.')
if ([int]$nodeVersion[0] -lt 24 -or ([int]$nodeVersion[0] -eq 24 -and [int]$nodeVersion[1] -lt 15)) {
  throw 'The local SQLite backend requires Node.js 24.15 or newer.'
}

node.exe --experimental-strip-types backend/src/server.ts
exit $LASTEXITCODE
