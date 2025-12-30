
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from backend_app.models import Tour, User

print("--- FINAL HARD-CODED CLEANUP ---")

# 1. Delete specific tours by ID
target_tour_ids = [8, 10, 11]
for tid in target_tour_ids:
    try:
        t = Tour.objects.get(id=tid)
        print(f"Deleting Tour ID {tid}: '{t.title}'")
        t.delete()
    except Tour.DoesNotExist:
        print(f"Tour ID {tid} not found (already deleted?)")

# 2. Delete test users by email patterns
target_emails = [
    "test_guide_repro_2025-12-30@example.com",
    "tourist_repro_2025-12-30@example.com",
    "tourist_cancel_test@example.com",
    "guide_cancel_test@example.com"
]

for email in target_emails:
    users = User.objects.filter(email=email)
    if users.exists():
        print(f"Found {users.count()} users with email '{email}'. Deleting...")
        users.delete()
    else:
        print(f"No user found with email '{email}'.")

# 3. Double check for any tour with "Test" in title
test_tours = Tour.objects.filter(title__icontains="Test")
if test_tours.exists():
    print(f"Found {test_tours.count()} more tours with 'Test' in title. Deleting...")
    test_tours.delete()

print("--- VERIFYING REMAINING TOURS ---")
remaining = Tour.objects.all()
for t in remaining:
    print(f"Remaining: {t.id} | {t.title}")

print("--- CLEANUP FINISHED ---")
