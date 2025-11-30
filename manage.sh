#!/bin/bash
# Helper script to run Django manage.py with virtual environment activated
cd "$(dirname "$0")"
source .venv/bin/activate
python manage.py "$@"

