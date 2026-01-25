import os
import django
from django.conf import settings
from django.core.mail import send_mail

def test_smtp():
    print("--- SMTP CONFIGURATION CHECK ---")
    print(f"EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
    print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
    print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
    print(f"EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
    print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
    print(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
    print(f"EMAIL_HOST_PASSWORD Set: {'Yes' if settings.EMAIL_HOST_PASSWORD else 'No'}")
    
    try:
        print("\nAttempting to send test email...")
        sent = send_mail(
            'Render SMTP Verification',
            'If you see this, SMTP is working on Render.',
            settings.DEFAULT_FROM_EMAIL,
            [settings.EMAIL_HOST_USER],
            fail_silently=False
        )
        print(f"✅ Success! send_mail returned: {sent}")
    except Exception as e:
        print(f"❌ FAILED: {str(e)}")

if __name__ == "__main__":
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    django.setup()
    test_smtp()
