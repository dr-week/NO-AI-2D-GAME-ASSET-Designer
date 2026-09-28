$ErrorActionPreference = 'Stop'

if (-not (Get-Command npx.cmd -ErrorAction SilentlyContinue)) {
  throw 'Node.js and npm are required to run the optional Laya service.'
}

Write-Host 'Starting the optional CPU Laya service on 127.0.0.1:8081.'
Write-Host 'First launch installs the native runtime; first prediction downloads model weights (~324 MB).'
Write-Host 'This separate model is not bundled with 2D Maker.'
npx.cmd --yes laya-system-one@1.3.3 --host 127.0.0.1 --port 8081 --backend native
exit $LASTEXITCODE
