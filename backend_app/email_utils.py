import threading
from django.core.mail import send_mail
from django.conf import settings

def send_generic_email(subject, message, recipient_list):
    """
    Core email dispatcher. 
    Uses standard Django send_mail, which is intercepted by django-resend if configured.
    """
    def send_async():
        try:
            from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'tguidadz@gmail.com')
            
            print(f"📨 Sending email to {recipient_list} (Subject: {subject})...")
            send_mail(
                subject,
                message,
                from_email,
                recipient_list,
                fail_silently=False,
            )
            print(f"✅ EMAIL SENT to {recipient_list}")
                
        except Exception as e:
            print(f"❌ EMAIL FAILED ({recipient_list}): {str(e)}")

    thread = threading.Thread(target=send_async)
    thread.daemon = True
    thread.start()
    return True


def send_tour_cancellation_email(tourist_user, tour):
    """
    Send an email to a tourist notifying them that a tour has been cancelled.
    """
    subject = f'Tour Cancelled: {tour.title}'
    message = f"""
Hello {tourist_user.firstname},

We are sorry to inform you that the tour "{tour.title}" scheduled for {tour.date} has been cancelled by the guide.

If you have any questions, please contact our support team.

Best regards,
DZ-TourGuide Team
    """
    return send_generic_email(subject, message, [tourist_user.email])
