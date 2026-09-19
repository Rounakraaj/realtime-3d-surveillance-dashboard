@echo off
REM ============================================
REM Real-Time 3D Surveillance Dashboard
REM Development Server Launcher
REM ============================================

setlocal enabledelayedexpansion

echo.
echo   ╔══════════════════════════════════════════════════════════╗
echo   ║                                                          ║
echo   ║   3D SURVEILLANCE SIMULATION DASHBOARD                  ║
echo   ║   Real-Time UAV Telemetry System                        ║
echo   ║                                                          ║
echo   ╚══════════════════════════════════════════════════════════╝
echo.
echo   Initializing development server...
echo.

REM Change to project directory
cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules\" (
    echo   [*] Dependencies not found. Installing...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo   [ERROR] Failed to install dependencies!
        echo.
        pause
        exit /b 1
    )
    echo.
    echo   [OK] Dependencies installed successfully
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo   [!] Creating environment configuration...
    (
        echo VITE_APP_TITLE=Real-Time 3D Surveillance Dashboard
    ) > .env
    echo   [OK] Environment configuration created
    echo.
)

REM Display project information
echo   ╔══════════════════════════════════════════════════════════╗
echo   ║                  PROJECT INFORMATION                    ║
echo   ╠══════════════════════════════════════════════════════════╣
echo   ║                                                          ║
echo   ║  Framework:  React 18.3.1                               ║
echo   ║  3D Engine:  Three.js 0.165.0                           ║
echo   ║  Build Tool: Vite 5.4.1                                 ║
echo   ║  Port:       5173                                       ║
echo   ║  Status:     READY TO RUN                               ║
echo   ║                                                          ║
echo   ╚══════════════════════════════════════════════════════════╝
echo.

REM Start the development server
echo   Starting Vite development server...
echo   Please wait...
echo.
echo   ─────────────────────────────────────────────────────────
echo.

call npm run dev

REM If dev server exits
echo.
echo   ─────────────────────────────────────────────────────────
echo.
echo   Development server stopped.
echo.

pause
