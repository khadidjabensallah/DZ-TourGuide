#!/usr/bin/env bash
# exit on error
set -o errexit

# If this is run from the root, but requirements is in backend/
if [ -f "backend/requirements.txt" ]; then
    pip install -r backend/requirements.txt
    python backend/manage.py collectstatic --no-input
    python backend/manage.py migrate
# If this is run from within the backend/ folder
elif [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    python manage.py collectstatic --no-input
    python manage.py migrate
fi
