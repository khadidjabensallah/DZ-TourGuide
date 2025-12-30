
import os
import django
from django.db.models import Q

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from backend_app.models import User

print("--- SEARCHING FOR TEST USERS ---")

# Broad search for anything "Test"
users = User.objects.filter(
    Q(firstname__icontains="Test") | 
    Q(lastname__icontains="Test") |
    Q(username__icontains="Test") | 
    Q(email__icontains="test")
)

count = users.count()

if count == 0:
    print("No 'Test' users found.")
else:
    print(f"Found {count} potential test users:")
    for u in users:
        print(f" - ID: {u.id} | Name: {u.firstname} {u.lastname} | Email: {u.email}")
        
        # User specifically asked to remove "Test Guide"
        # I'll delete any user where name is exactly "Test Guide" (case insensitive)
        full_name = f"{u.firstname} {u.lastname}".lower()
        if "test guide" in full_name or "guide test" in full_name:
             print(f"   -> DELETING this user (matches 'Test Guide')")
             u.delete()
        else:
             print("   -> Skipping (does not match 'Test Guide' exactly)")

print("--- FINISHED ---")
