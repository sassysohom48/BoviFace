@echo off
REM BoviFace Backend Startup Script for Windows

echo 🐄 Starting BoviFace Backend...

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Create uploads directory
echo Creating uploads directory...
if not exist "uploads" mkdir uploads
if not exist "uploads\cattle" mkdir uploads\cattle
if not exist "uploads\muzzle" mkdir uploads\muzzle

REM Start the server
echo Starting FastAPI server...
echo API will be available at: http://localhost:8000
echo API docs will be available at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

REM Use uvicorn with import string
venv\Scripts\uvicorn.exe main:app --reload

pause

