@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed.
  pause
  exit /b 1
)
if not exist node_modules\electron\dist\electron.exe (
  echo Installing dependencies for the first run...
  call npm install
  if errorlevel 1 goto :error
)
call npm run desktop
exit /b %errorlevel%

:error
pause
exit /b 1
