from django.core.mail import send_mail
from django.conf import settings
import threading
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException



def send_generic_email(subject, message, recipient_list):
    """
    Core email dispatcher. 
    Uses Brevo API if BREVO_API_KEY is present, otherwise falls back to SMTP.
    """
    def send_async():
        try:
            brevo_key = getattr(settings, 'BREVO_API_KEY', None)
            from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'tguidadz@gmail.com')

            if brevo_key:
                print(f"📡 Sending via BREVO API to {recipient_list}...")
                configuration = sib_api_v3_sdk.Configuration()
                configuration.api_key['api-key'] = brevo_key
                
                api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
                
                # Setup email parameters
                sender = {"name": "TGUIDA", "email": from_email}
                to = [{"email": email} for email in recipient_list]
                
                send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
                    to=to,
                    sender=sender,
                    subject=subject,
                    text_content=message
                )

                api_response = api_instance.send_transac_email(send_smtp_email)
                print(f"✅ EMAIL SENT via BREVO. MessageId: {api_response.message_id}")
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

