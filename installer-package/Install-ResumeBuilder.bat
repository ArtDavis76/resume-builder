@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Install-ResumeBuilder.ps1"
if errorlevel 1 (
  echo.
  echo Install failed. Press any key to close.
  pause >nul
  exit /b 1
)
echo.
echo Install complete. Press any key to close.
pause >nul
