@echo off
title BUSTRACK - Deploy to Free Live Domain
echo ========================================================
echo   BUSTRACK - Deploying to Free Permanent Live Domain
echo ========================================================
echo.
set "PATH=C:\Users\asus\AppData\Local\Author Software\nvm\.nodejs;C:\Users\asus\AppData\Local\Author Software\nvm\installs\v24.21.0;%PATH%"
cd /d "%~dp0"

echo [1/2] Verifying production build...
call npm run build

echo.
echo ========================================================
echo   Select Deployment Method for Free Public Domain:
echo   [1] Surge.sh (Instant free live domain, 10 seconds)
echo   [2] Vercel (Global high-speed cloud domain)
echo   [3] Open Netlify Drop in browser (Drag and drop dist)
echo ========================================================
set /p choice="Enter your choice (1, 2, or 3): "

if "%choice%"=="1" (
    echo.
    echo Deploying to Surge.sh (Enter email & password if asked)...
    npx surge ./dist --domain bustrack-punjab.surge.sh
) else if "%choice%"=="2" (
    echo.
    echo Deploying to Vercel...
    npx vercel ./dist
) else (
    echo.
    echo Opening Netlify Drop in your browser...
    start https://app.netlify.com/drop
    echo Please drag the "dist" folder from this folder into the Netlify webpage!
)

echo.
echo Deployment finished!
pause

