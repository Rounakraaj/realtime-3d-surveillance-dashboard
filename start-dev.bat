@echo off
REM Real-Time 3D Surveillance Dashboard - Start Script
REM This script starts the development server

echo.
echo ========================================
echo 3D Surveillance Dashboard
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
)

REM Start dev server
echo Starting development server...
echo.
echo The dashboard will open at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server.
echo.

npm run dev

pause
