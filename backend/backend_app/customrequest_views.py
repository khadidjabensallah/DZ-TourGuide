from django.shortcuts import get_object_or_404
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from datetime import datetime, timedelta
import os
import uuid
import json
import requests
from decimal import Decimal
from django.utils import timezone
from django.contrib.auth import authenticate
from .forms import TouristSignupForm, GuideSignupForm, VerificationForm, ForgotPasswordForm, VerifyPasswordResetCodeForm, ResetPasswordForm
from .models import Tourist, Guide, CoverageZone, User, Admin, Tour, Reservation, Review, Wilaya, PersonalizedRequest

@csrf_exempt
@require_http_methods(["POST"])
def create_personalized_request(request):
    """
    Create a personalized/custom request from a Tourist to a Guide.
    Expected POST fields (form-encoded):
      - guide_id (required)
      - tourist_id (required)
      - preferred_date (YYYY-MM-DD)
      - departure_time (HH:MM)
      - duration_hours (decimal)
      - number_of_people (int)
      - wilaya_code (string)
      - departure_location (string)
      - description (string, required)
      - special_requests (string)
    """
    guide_id = request.POST.get('guide_id')
    tourist_id = request.POST.get('tourist_id')
    description = request.POST.get('description')

    if not guide_id or not tourist_id or not description:
        return JsonResponse({'success': False, 'message': 'guide_id, tourist_id and description are required'}, status=400)

    guide = get_object_or_404(Guide, user_id=guide_id)
    tourist = get_object_or_404(Tourist, user_id=tourist_id)

    preferred_date = request.POST.get('preferred_date')
    departure_time = request.POST.get('departure_time')
    duration_hours = request.POST.get('duration_hours')
    number_of_people = request.POST.get('number_of_people', '1')
    wilaya_code = request.POST.get('wilaya_code')
    departure_location = request.POST.get('departure_location')
    tourist_phone = request.POST.get('tourist_phone')
    special_requests = request.POST.get('special_requests')

    missing = []
    if not preferred_date:
        missing.append('preferred_date')
    if not departure_time:
        missing.append('departure_time')
    if not duration_hours:
        missing.append('duration_hours')
    if missing:
        return JsonResponse({'success': False, 'message': f'Missing required fields: {", ".join(missing)}'}, status=400)

    try:
        number_of_people = int(number_of_people)
    except Exception:
        return JsonResponse({'success': False, 'message': 'Invalid number_of_people'}, status=400)

    try:
        parsed_date = datetime.strptime(preferred_date, '%Y-%m-%d').date()
    except Exception:
        return JsonResponse({'success': False, 'message': 'preferred_date must be in YYYY-MM-DD format'}, status=400)

    try:
        parsed_time = datetime.strptime(departure_time, '%H:%M').time()
    except Exception:
        return JsonResponse({'success': False, 'message': 'departure_time must be in HH:MM format'}, status=400)

    try:
        duration_val = float(duration_hours)
        if duration_val <= 0:
            raise ValueError()
    except Exception:
        return JsonResponse({'success': False, 'message': 'duration_hours must be a positive number'}, status=400)

    wilaya = None
    if wilaya_code:
        wilaya = Wilaya.objects.filter(code=wilaya_code).first()

    try:
        req = PersonalizedRequest.objects.create(
            guide=guide,
            tourist=tourist,
            preferred_date=parsed_date,
            departure_time=parsed_time,
            duration_hours=duration_val,
            number_of_people=number_of_people,
            wilaya=wilaya,
            departure_location=departure_location or '',
            tourist_phone=PersonalizedRequest._normalize_phone(tourist_phone) if tourist_phone else None,
            description=description,
            special_requests=special_requests or ''
        )

        response_data = {
            'request_id': req.id,
            'guide_id': req.guide.user_id,
            'tourist_id': req.tourist.user_id,
            'preferred_date': req.preferred_date.isoformat() if req.preferred_date else None,
            'departure_time': req.departure_time.strftime('%H:%M') if req.departure_time else None,
            'duration_hours': str(req.duration_hours) if req.duration_hours is not None else None,
            'number_of_people': req.number_of_people,
            'wilaya': req.wilaya.name if req.wilaya else None,
            'departure_location': req.departure_location,
            'description': req.description,
            'special_requests': req.special_requests,
            'tourist_phone': req.get_tourist_phone_display(),
            'status': req.status,
            'rejection_reason': req.rejection_reason,
            'created_at': req.created_at.isoformat() if req.created_at else None,
        }

        try:
            from django.core.mail import send_mail
            subject = f"New personalized request from {tourist.user.firstname} {tourist.user.lastname}"
            message = f"You have a new personalized request (ID: {req.id}).\n\nDescription:\n{description}\n\nView in admin to respond."
            send_mail(subject, message, None, [guide.user.email], fail_silently=True)
        except Exception:
            pass

        return JsonResponse({'success': True, 'message': 'Request sent', 'data': response_data}, status=201)

    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Error creating request: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_personalized_requests(request, guide_id):
    """
    Get all personalized requests for a specific guide
    """
    guide = get_object_or_404(Guide, user_id=guide_id)
    requests_list = PersonalizedRequest.objects.filter(guide=guide).select_related('tourist__user', 'wilaya').order_by('-created_at')
    
    data = []
    for req in requests_list:
        data.append({
            'id': req.id,
            'tourist': {
                'id': req.tourist.user_id,
                'name': f"{req.tourist.user.firstname} {req.tourist.user.lastname}",
                'phone': req.get_tourist_phone_display(),
                'email': req.tourist.user.email,
                'photo_url': req.tourist.user.photo_url
            },
            'preferred_date': req.preferred_date.isoformat() if req.preferred_date else None,
            'departure_time': req.departure_time.strftime('%H:%M') if req.departure_time else None,
            'duration_hours': str(req.duration_hours),
            'number_of_people': req.number_of_people,
            'wilaya': req.wilaya.name if req.wilaya else None,
            'departure_location': req.departure_location,
            'description': req.description,
            'special_requests': req.special_requests,
            'status': req.status,
            'rejection_reason': req.rejection_reason,
            'created_at': req.created_at.isoformat()
        })
    
    return JsonResponse({
        'success': True,
        'total': len(data),
        'data': data
    }, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def respond_personalized_request(request, request_id):
    """
    Guide accepts or rejects a personalized request.
    POST fields:
      - guide_id (required): user id of the guide performing the action
      - action (required): 'accept' or 'reject'
      - rejection_reason (required if action == 'reject')
    """
    action = request.POST.get('action')
    guide_id = request.POST.get('guide_id')

    if not guide_id or not action:
        return JsonResponse({'success': False, 'message': 'guide_id and action are required'}, status=400)

    pr = get_object_or_404(PersonalizedRequest, id=request_id)

    try:
        guide = get_object_or_404(Guide, user_id=guide_id)
    except Exception:
        return JsonResponse({'success': False, 'message': 'Guide not found'}, status=404)

    print(f"DEBUG: respond_personalized_request. pr.guide_id={pr.guide_id}, guide.user_id={guide.user_id}, action={action}")
    if pr.guide_id != int(guide_id):
        return JsonResponse({'success': False, 'message': f'Permission denied: PR Guide {pr.guide_id} vs Action Guide {guide_id}'}, status=403)

    if pr.status != 'pending':
        return JsonResponse({'success': False, 'message': 'Request already responded to'}, status=400)

    if action == 'accept':
        pr.status = 'accepted'
        pr.rejection_reason = None
        pr.save()

        try:
            from django.core.mail import send_mail
            subject = f"Your personalized request #{pr.id} was accepted"
            message = f"Hello {pr.tourist.user.firstname},\n\nYour personalized request to {pr.guide.user.firstname} {pr.guide.user.lastname} has been accepted. The guide will contact you with details.\n\nRequest description:\n{pr.description}"
            send_mail(subject, message, None, [pr.tourist.user.email], fail_silently=True)
        except Exception:
            pass

        return JsonResponse({'success': True, 'message': 'Request accepted', 'request_id': pr.id}, status=200)

    elif action == 'reject':
        rejection_reason = request.POST.get('rejection_reason')
        if not rejection_reason:
            return JsonResponse({'success': False, 'message': 'rejection_reason is required when rejecting'}, status=400)

        pr.status = 'rejected'
        pr.rejection_reason = rejection_reason
        pr.save()

        try:
            from django.core.mail import send_mail
            subject = f"Your personalized request #{pr.id} was rejected"
            message = f"Hello {pr.tourist.user.firstname},\n\nYour personalized request to {pr.guide.user.firstname} {pr.guide.user.lastname} was rejected.\n\nReason:\n{rejection_reason}\n\nRequest description:\n{pr.description}"
            send_mail(subject, message, None, [pr.tourist.user.email], fail_silently=True)
        except Exception:
            pass

        return JsonResponse({'success': True, 'message': 'Request rejected', 'request_id': pr.id}, status=200)

    else:
        return JsonResponse({'success': False, 'message': "Invalid action, must be 'accept' or 'reject'"}, status=400)





