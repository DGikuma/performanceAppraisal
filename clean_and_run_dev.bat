@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo 🔧 Cleaning locked files (Node/Vite/Tailwind)
echo ========================================
echo.

:: Kill processes that may be locking files
echo 🔄 Attempting to kill Node, Vite, Tailwind, Esbuild...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM vite.exe >nul 2>&1
taskkill /F /IM tailwindcss.exe >nul 2>&1
taskkill /F /IM esbuild.exe >nul 2>&1

echo ✅ Processes killed (if any were running).

:: Delete node_modules
if exist node_modules (
    echo 🧹 Deleting node_modules...
    rmdir /s /q node_modules
)

:: Delete .vite folder
if exist .vite (
    echo 🧹 Deleting .vite cache...
    rmdir /s /q .vite
)

:: Delete package-lock.json
if exist package-lock.json (
    echo 🧹 Deleting package-lock.json...
    del /f /q package-lock.json
)

:: Optional: delete .turbo, .next, dist, or build folders if needed
if exist dist (
    echo 🧹 Deleting dist folder...
    rmdir /s /q dist
)

echo.
echo ✅ Cleanup complete.
echo 💡 Now reinstalling dependencies...

npm install

echo.
echo 🚀 Starting development server...
npm run dev

pause
