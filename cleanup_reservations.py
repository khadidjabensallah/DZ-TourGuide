"""
Script to delete existing reservations before migration
Run: python cleanup_reservations.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from backend_app.models import Reservation

count = Reservation.objects.count()
print(f"Found {count} existing reservations")

if count > 0:
    confirm = input(f"Delete all {count} reservations? (yes/no): ")
    if confirm.lower() == 'yes':
        Reservation.objects.all().delete()
        print(f"Deleted {count} reservations")
    else:
        print("Cancelled")
else:
    print("No reservations to delete")

