#!/bin/bash
# Start React Frontend Server
cd "$(dirname "$0")/frontend"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "=========================================="
echo "Starting React Frontend Server"
echo "Frontend will run on: http://localhost:3000"
echo "=========================================="
npm run dev
