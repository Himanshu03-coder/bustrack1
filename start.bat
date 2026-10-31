@echo off
title BUSTRACK - Dev Server
echo ========================================================
echo   BUSTRACK - Smart Insights for a Better Journey
echo ========================================================
echo.
set "PATH=C:\Users\asus\AppData\Local\Author Software\nvm\.nodejs;C:\Users\asus\AppData\Local\Author Software\nvm\installs\v24.21.0;%PATH%"
cd /d "%~dp0"

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo Starting Vite server... (Press Ctrl+C to stop)
npm run dev -- --host 0.0.0.0 --port 5173
pause

