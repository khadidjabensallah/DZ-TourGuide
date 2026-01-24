#!/usr/bin/env bash
# exit on error
set -o errexit

# Identify if we are in the root or in the backend folder
if [ -d "backend" ]; then
    echo "Running from project root..."
    pip install -r backend/requirements.txt
    python backend/manage.py collectstatic --no-input
    python backend/manage.py migrate
else
    echo "Running from backend folder..."
    pip install -r requirements.txt
    python manage.py collectstatic --no-input
    python manage.py migrate
fi
