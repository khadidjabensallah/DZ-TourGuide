
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from backend_app.models import Tour, User

print("--- LISTING ALL TOURS IN DATABASE ---")
all_tours = Tour.objects.all()
print(f"Total tours: {all_tours.count()}")

for tour in all_tours:
    try:
        guide_name = f"{tour.guide.user.firstname} {tour.guide.user.lastname}"
        guide_email = tour.guide.user.email
    except:
        guide_name = "ERROR: Missing Guide/User"
        guide_email = "N/A"
        
    print(f"ID: {tour.id} | Title: '{tour.title}' | Guide: {guide_name} ({guide_email}) | Date: {tour.date}")

print("\n--- LISTING ALL USERS WHO ARE GUIDES ---")
from backend_app.models import Guide
all_guides = Guide.objects.all()
for g in all_guides:
    print(f"Guide ID: {g.id} | User: {g.user.firstname} {g.user.lastname} ({g.user.email})")

print("--- END OF LIST ---")
