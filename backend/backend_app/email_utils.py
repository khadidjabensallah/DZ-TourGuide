from django.core.mail import send_mail
from django.conf import settings

def send_tour_cancellation_email(tourist_user, tour):
    """
    Send an email to a tourist notifying them that a tour has been cancelled.
    """
    try:
        subject = f'Tour Cancelled: {tour.title}'
        message = f"""
Hello {tourist_user.firstname},

We are sorry to inform you that the tour "{tour.title}" scheduled for {tour.date} has been cancelled by the guide.

If you have any questions, please contact our support team.

Best regards,
DZ-TourGuide Team
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [tourist_user.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending cancellation email to {tourist_user.email}: {e}")
        return False
