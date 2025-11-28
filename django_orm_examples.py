# Django ORM Examples for Querying Tourists
# Copy and paste these into Django shell: python manage.py shell

from backend_app.models import Tourist, User, Guide

# Method 1: Get all tourists with user information (equivalent to your SQL JOIN)
tourists = Tourist.objects.select_related('user').all().order_by('user__id')

# Print the results
for t in tourists:
    print(f"ID: {t.user.id}, Email: {t.user.email}, Name: {t.user.firstname} {t.user.lastname}, "
          f"Nationality: {t.nationality}, Active: {t.user.isActive}, Verified: {t.user.email_verified}")

# Method 2: Get as dictionary/values (similar to SELECT specific columns)
tourists_data = Tourist.objects.select_related('user').values(
    'user__id',
    'user__email',
    'user__firstname',
    'user__lastname',
    'nationality',
    'user__isActive',
    'user__email_verified'
).order_by('user__id')

# Print as list
for t in tourists_data:
    print(t)

# Method 3: Get all fields as a list
tourists_list = list(Tourist.objects.select_related('user').values(
    'user__id',
    'user__email',
    'user__firstname',
    'user__lastname',
    'nationality',
    'user__isActive',
    'user__email_verified'
).order_by('user__id'))

print(tourists_list)

# Method 4: Filter specific tourists
active_tourists = Tourist.objects.select_related('user').filter(
    user__isActive=True
).order_by('user__id')

for t in active_tourists:
    print(f"{t.user.email} - {t.user.firstname} {t.user.lastname}")

