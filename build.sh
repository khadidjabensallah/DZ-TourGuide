#!/usr/bin/env bash
# exit on error
set -o errexit

# Identify if we are in the root or in the backend folder
if [ -d "backend" ]; then
    echo "Running build from project root..."
    # Install dependencies from root requirements
    pip install -r requirements.txt
    # Run static collection and migrations using the root bridge
    python manage.py collectstatic --no-input
    python manage.py migrate
else
    echo "Running build from backend folder..."
    pip install -r requirements.txt
    python manage.py collectstatic --no-input
    python manage.py migrate
fi
