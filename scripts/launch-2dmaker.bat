@echo off
setlocal
set "POWERSHELL=powershell.exe"
where pwsh.exe >nul 2>nul
if not errorlevel 1 set "POWERSHELL=pwsh.exe"

"%POWERSHELL%" -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0launch-2dmaker.ps1"
set "LAUNCHER_EXIT=%ERRORLEVEL%"
if not "%LAUNCHER_EXIT%"=="0" (
  echo 2D Maker stopped with an error. Check logs\launcher for details.
  pause
)
exit /b %LAUNCHER_EXIT%
