param([ValidateRange(1024, 65535)][int]$Port = 5173)

$ErrorActionPreference = 'Stop'

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$logDirectory = Join-Path $projectRoot 'logs\launcher'
$crashLog = Join-Path $logDirectory 'launcher-crashes.log'
$mutex = [System.Threading.Mutex]::new($false, 'Local\2DMaker.WebsiteLauncher')
$ownsMutex = $false
$server = $null
$stdoutPath = $null
$stderrPath = $null
$exitCode = 0

try { $ownsMutex = $mutex.WaitOne(0) }
catch [System.Threading.AbandonedMutexException] { $ownsMutex = $true }

if (-not $ownsMutex) {
  Write-Host '2D Maker launcher is already running. No second server or browser tab was started.'
  $mutex.Dispose()
  exit 0
}
$ownsMutex = $true

try {
  [System.IO.Directory]::CreateDirectory($logDirectory) | Out-Null
  $runId = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
  $stdoutPath = Join-Path $logDirectory "vite-$runId.stdout.log"
  $stderrPath = Join-Path $logDirectory "vite-$runId.stderr.log"
  $url = "http://127.0.0.1:$Port/"

  $node = Get-Command node.exe -ErrorAction SilentlyContinue
  if (-not $node) { throw 'Node.js was not found. Install the project Node.js requirement and reopen this launcher.' }

  $viteEntry = Join-Path $projectRoot 'node_modules\vite\bin\vite.js'
  if (-not (Test-Path -LiteralPath $viteEntry)) { throw 'Project dependencies are missing. Run npm ci in the project folder, then retry.' }

  $portProbe = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
  try { $portProbe.Start() }
  catch { throw "Port $Port is unavailable. Close its server or rerun with -Port and an available port." }
  finally { $portProbe.Stop() }

  $server = Start-Process -FilePath $node.Source `
    -ArgumentList @('node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', $Port, '--strictPort') `
    -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru `
    -RedirectStandardOutput $stdoutPath -RedirectStandardError $stderrPath

  $deadline = [DateTime]::UtcNow.AddSeconds(45)
  $ready = $false
  while ([DateTime]::UtcNow -lt $deadline) {
    $server.Refresh()
    if ($server.HasExited) { throw "Vite exited during startup with code $($server.ExitCode)." }
    try {
      $response = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec 1 -UseBasicParsing
      if ($response.StatusCode -eq 200) {
        $server.Refresh()
        if ($server.HasExited) { throw "Vite exited during startup with code $($server.ExitCode)." }
        $ready = $true
        break
      }
    } catch { }
    Start-Sleep -Milliseconds 500
  }
  if (-not $ready) { throw 'Vite did not become ready within 45 seconds.' }

  Start-Process -FilePath $url
  Write-Host "2D Maker is running at $url"
  Write-Host "Server output: $stdoutPath"
  Write-Host 'Keep this window open. Press Ctrl+C to stop the launcher and server.'

  while ($true) {
    Start-Sleep -Milliseconds 500
    $server.Refresh()
    if ($server.HasExited) { throw "Vite stopped unexpectedly with code $($server.ExitCode)." }
  }
} catch {
  $exitCode = 1
  $entry = @(
    "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz')] $($_.Exception.Message)"
    "stdout: $stdoutPath"
    "stderr: $stderrPath"
    ''
  ) -join [Environment]::NewLine
  try { Add-Content -LiteralPath $crashLog -Value $entry -Encoding UTF8 }
  catch { Write-Warning "Could not write crash log: $($_.Exception.Message)" }
  Write-Host "Launcher failed. See $crashLog and the Vite output logs." -ForegroundColor Red
} finally {
  if ($server) {
    try {
      $server.Refresh()
      if (-not $server.HasExited) {
        Stop-Process -Id $server.Id -Force
        $server.WaitForExit()
      }
    } catch { }
  }
  if ($ownsMutex) { $mutex.ReleaseMutex() }
  $mutex.Dispose()
}

exit $exitCode
