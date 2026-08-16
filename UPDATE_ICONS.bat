@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\update-icons.ps1"
if errorlevel 1 (
  echo.
  echo ERROR: icons were not updated.
  pause
  exit /b 1
)
echo.
echo Done. Refresh QUICK NOTES in Chrome.
pause
