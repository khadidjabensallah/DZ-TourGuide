#!/bin/bash
# Start Django Backend Server
cd "$(dirname "$0")"
source .venv/bin/activate
echo "=========================================="
echo "Starting Django Backend Server"
echo "Server will run on: http://127.0.0.1:8000"
echo "API endpoints: http://127.0.0.1:8000/api/"
echo "=========================================="
python manage.py runserver
