#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Seed the 58 Algerian wilayas (idempotent). Required for guide signup /
# coverage zones / search filters to work on a fresh database.
python manage.py populate_wilaya_coordinates
