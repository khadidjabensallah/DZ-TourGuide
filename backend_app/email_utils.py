from django.core.mail import send_mail
from django.conf import settings
import threading
import resend


def send_generic_email(subject, message, recipient_list):
    """
    Core email dispatcher. 
    Uses Resend API if RESEND_API_KEY is present, otherwise falls back to SMTP.
    """
    def send_async():
        try:
            resend_key = getattr(settings, 'RESEND_API_KEY', None)
            from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'onboarding@resend.dev')

            if resend_key:
                print(f"📡 Sending via RESEND API to {recipient_list}...")
                resend.api_key = resend_key
                params = {
                    "from": f"TGUIDA <{from_email}>",
                    "to": recipient_list,
                    "subject": subject,
                    "text": message,
                }
                resend.Emails.send(params)
                print(f"✅ EMAIL SENT via RESEND to {recipient_list}")
            else:
                print(f"📨 Sending via SMTP to {recipient_list}...")
                send_mail(
                    subject,
                    message,
                    from_email,
                    recipient_list,
                    fail_silently=False,
                )
                print(f"✅ EMAIL SENT via SMTP to {recipient_list}")
                
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

