#!/bin/bash

# BoviFace Backend Startup Script

echo "🐄 Starting BoviFace Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create uploads directory
echo "Creating uploads directory..."
mkdir -p uploads/cattle
mkdir -p uploads/muzzle

# Start the server
echo "Starting FastAPI server..."
echo "API will be available at: http://localhost:8000"
echo "API docs will be available at: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python main.py
