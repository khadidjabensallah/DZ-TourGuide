"""
Simple database query tool using Django ORM
Usage: python db_query.py
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from backend_app.models import *

print("=" * 60)
print("Django Database Query Tool")
print("=" * 60)
print("\nAvailable models:")
print("- User")
print("- Guide")
print("- Tourist")
print("- Tour")
print("- Reservation")
print("- Wilaya")
print("- CoverageZone")
print("- WeatherInfo")
print("- Review")
print("\nExample queries:")
print("  User.objects.all()")
print("  Tour.objects.count()")
print("  Wilaya.objects.all()")
print("  Tour.objects.filter(is_active=True)")
print("\nType 'exit' to quit")
print("=" * 60)

while True:
    try:
        command = input("\ndz_tourguide> ")
        
        if command.strip().lower() in ['exit', 'quit', 'q']:
            break
        
        if not command.strip():
            continue
        
        # Execute the command
        result = eval(command)
        
        # Display results
        if hasattr(result, '__iter__') and not isinstance(result, str):
            try:
                count = result.count() if hasattr(result, 'count') else len(list(result))
                print(f"\nResult ({count} items):")
                for item in result[:10]:  # Show first 10
                    print(f"  {item}")
                if count > 10:
                    print(f"  ... and {count - 10} more")
            except:
                print(f"\nResult: {result}")
        else:
            print(f"\nResult: {result}")
            
    except KeyboardInterrupt:
        print("\n\nExiting...")
        break
    except Exception as e:
        print(f"\nError: {e}")

print("\nGoodbye!")

