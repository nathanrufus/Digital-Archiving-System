@echo off
echo.
echo ===============================
echo   Digital Rchiving System
echo ===============================

:: 1. Frontend setup
echo Installing frontend dependencies...
cd frontend\archive-system
call npm install

:: 2. Backend setup
cd ..\..\backend
echo Installing backend dependencies...
call npm install

:: 3. Start backend in new Command Prompt
echo Starting backend on port 5000...
start cmd /k "cd /d %cd% && npm run dev"

:: 4. Start frontend in this window
cd ..\frontend\archive-system
echo Starting frontend on port 3000...
call npm run dev
