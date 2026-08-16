@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed.
  echo Install Node.js LTS, then run this file again.
  pause
  exit /b 1
)

echo Installing build dependencies...
call npm install
if errorlevel 1 goto :error

echo.
echo Cleaning previous build...
if exist dist rmdir /s /q dist

echo Building Windows installer...
call npm run dist:win
if errorlevel 1 goto :error

echo.
echo DONE.
echo Installer: %CD%\dist\Quick-Notes-Setup.exe
pause
exit /b 0

:error
echo.
echo BUILD FAILED.
pause
exit /b 1
