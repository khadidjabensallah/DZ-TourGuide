#tour_views
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from .storage_utils import save_upload
import json
import os
import uuid
from decimal import Decimal
from .models import Guide, Tour, Wilaya
from .email_utils import send_tour_cancellation_email

#========================================
# GUIDE - CREATE TOUR
# ========================================
@csrf_exempt
@require_http_methods(["POST"])
def guide_create_tour(request, guide_id):
    """
    Guide creates a new tour
    """
    guide = get_object_or_404(Guide, user_id=guide_id)
    # Only approved and verified guides can create tours
    if not (guide.approval_status == 'approved' and guide.is_verified and guide.user.isActive):
        return JsonResponse({
            'success': False,
            'message': 'Your guide account is not approved by admin. You cannot create tours yet.'
        }, status=403)
    
    # Get data from request
    title = request.POST.get('title')
    description = request.POST.get('description')
    date = request.POST.get('date')
    itinerary = request.POST.get('itinerary')
    highlights = request.POST.get('highlights')
    whats_included = request.POST.get('whats_included')
    whats_excluded = request.POST.get('whats_excluded')
    estimated_duration = request.POST.get('estimated_duration')
    wilaya_code = request.POST.get('wilaya_code')
    starting_point = request.POST.get('starting_point')
    latitude = request.POST.get('latitude')  # Optional
    longitude = request.POST.get('longitude')  # Optional
    scheduled_time = request.POST.get('scheduled_time')  # Optional departure time
    available_places = request.POST.get('available_places')
    
    # Validation - latitude and longitude are now optional
    if not all([title, description, date, itinerary, estimated_duration, wilaya_code, 
                starting_point, available_places]):
        return JsonResponse({
            'success': False,
            'message': 'All required fields must be provided'
        }, status=400)
    
    # Get wilaya
    try:
        wilaya = Wilaya.objects.get(code=wilaya_code)
    except Wilaya.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Invalid wilaya code'
        }, status=400)
    
    # Check if wilaya is in guide's coverage zones
    if not guide.coverage_zones.filter(wilaya=wilaya).exists():
        return JsonResponse({
            'success': False,
            'message': f'You do not cover {wilaya.name}. Please add it to your coverage zones first.'
        }, status=400)
    
    try:
        # Parse date if it's a string
        from datetime import datetime
        if isinstance(date, str):
            try:
                tour_date = datetime.strptime(date, '%Y-%m-%d').date()
            except ValueError:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid date format. Use YYYY-MM-DD'
                }, status=400)
        else:
            tour_date = date
        
        max_places = int(available_places)
        
        # Use Wilaya coordinates as fallback if not provided
        tour_latitude = Decimal(latitude) if latitude else wilaya.latitude
        tour_longitude = Decimal(longitude) if longitude else wilaya.longitude
        
        # Parse scheduled_time if provided
        tour_scheduled_time = None
        if scheduled_time:
            try:
                from datetime import datetime
                tour_scheduled_time = datetime.strptime(scheduled_time, '%H:%M').time()
            except ValueError:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid time format for scheduled_time. Use HH:MM'
                }, status=400)
        
        # Create tour
        tour = Tour.objects.create(
            guide=guide,
            title=title,
            description=description,
            date=tour_date,
            itinerary=itinerary,
            highlights=highlights or '',
            whats_included=whats_included or '',
            whats_excluded=whats_excluded or '',
            estimated_duration=Decimal(estimated_duration),
            wilaya=wilaya,
            starting_point=starting_point,
            latitude=tour_latitude,
            longitude=tour_longitude,
            scheduled_time=tour_scheduled_time,
            max_places=max_places,
            available_places=max_places,  # Initially, all places are available
            is_active=True
        )
        
        # Handle photo uploads
        photo_urls = []
        uploaded_files = request.FILES.getlist('photos')
        
        if uploaded_files:
            for file in uploaded_files:
                photo_urls.append(save_upload(file, 'tours', prefix=f"{tour.id}_"))

            tour.photo_urls = photo_urls
            if photo_urls:
                tour.cover_photo = photo_urls[0]
            tour.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Tour created successfully!',
            'data': {
                'tour_id': tour.id,
                'title': tour.title,
                'calculated_price': str(tour.calculated_price),
                'max_places': tour.max_places,
                'available_places': tour.available_places,
                'wilaya': wilaya.name,
                'date': tour.date.isoformat() if tour.date else None
            }
        }, status=201)
        
    except ValueError as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Error creating tour: {str(e)}'
        }, status=500)

# ========================================
# GUIDE - UPDATE TOUR
# ========================================
@csrf_exempt
@require_http_methods(["PUT", "POST"])
def guide_update_tour(request, guide_id, tour_id):
    """
    Guide updates their tour
    """
    guide = get_object_or_404(Guide, user_id=guide_id)
    tour = get_object_or_404(Tour, id=tour_id, guide=guide)
    
    # Parse JSON data
    try:
        data = json.loads(request.body)
    except:
        data = request.POST.dict()
    
    # Update fields

    if 'title' in data:
        tour.title = data['title']
    if 'description' in data:
        tour.description = data['description']
    if 'itinerary' in data:
        tour.itinerary = data['itinerary']
    if 'highlights' in data:
        tour.highlights = data['highlights']
    if 'whats_included' in data:
        tour.whats_included = data['whats_included']
    if 'whats_excluded' in data:
        tour.whats_excluded = data['whats_excluded']
    if 'estimated_duration' in data and data['estimated_duration']:
        try:
            tour.estimated_duration = Decimal(str(data['estimated_duration']))
        except:
            pass

    if 'max_places' in data:
        # When updating max_places, adjust available_places accordingly
        old_max = tour.max_places
        new_max = int(data['max_places'])
        difference = new_max - old_max
        tour.max_places = new_max
        tour.available_places = max(0, tour.available_places + difference)
    elif 'available_places' in data:
        # Only allow updating available_places if it doesn't exceed max_places
        new_available = int(data['available_places'])
        if new_available > tour.max_places:
            return JsonResponse({
                'success': False,
                'message': f'Available places cannot exceed max places ({tour.max_places})'
            }, status=400)
        tour.available_places = new_available
    if 'is_active' in data:
        tour.is_active = str(data['is_active']).lower() in ['true', '1', 'yes']

    
    # NEW: Handle missing fields
    if 'wilaya_code' in data:
        from .models import Wilaya
        wilaya = get_object_or_404(Wilaya, code=data['wilaya_code'])
        tour.wilaya = wilaya
    
    from datetime import datetime
    if 'date' in data and data['date']:
        if isinstance(data['date'], str):
            tour.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        else:
            tour.date = data['date']
            
    if 'scheduled_time' in data:
        if data['scheduled_time']:
            if isinstance(data['scheduled_time'], str):
                # Robust parsing: take only the first 5 characters (HH:MM) to avoid issues with HH:MM:SS
                time_str = data['scheduled_time'][:5]
                tour.scheduled_time = datetime.strptime(time_str, '%H:%M').time()
            else:
                tour.scheduled_time = data['scheduled_time']
        else:
            tour.scheduled_time = None

    if 'latitude' in data and data['latitude']:
        try:
            tour.latitude = Decimal(str(data['latitude']))
        except:
            pass
    if 'longitude' in data and data['longitude']:
        try:
            tour.longitude = Decimal(str(data['longitude']))
        except:
            pass

    
    # Handle photo uploads during update
    uploaded_files = request.FILES.getlist('photos')
    if uploaded_files:
        photo_urls = tour.photo_urls if tour.photo_urls else []
        for file in uploaded_files:
            photo_urls.append(save_upload(file, 'tours', prefix=f"{tour.id}_"))

        tour.photo_urls = photo_urls
        # If no cover photo exists, set the first one as cover
        if not tour.cover_photo and photo_urls:
            tour.cover_photo = photo_urls[0]
            
    tour.save()

    
    return JsonResponse({
        'success': True,
        'message': 'Tour updated successfully',
        'data': {
            'tour_id': tour.id,
            'title': tour.title,
            'calculated_price': str(tour.calculated_price),
            'available_places': tour.available_places
        }
    }, status=200)

 #========================================
# GUIDE - DELETE TOUR
# ========================================
@csrf_exempt

@require_http_methods(["DELETE", "POST"])
def guide_delete_tour(request, guide_id, tour_id):
    """
    Guide deletes their tour
    """
    guide = get_object_or_404(Guide, user_id=guide_id)
    tour = get_object_or_404(Tour, id=tour_id, guide=guide)
    
    # If the tour is in the future, notify all tourists with active reservations
    if tour.date >= timezone.now().date():
        active_reservations = tour.reservations.filter(completed_at__isnull=True)
        
        # Send cancellation emails
        for reservation in active_reservations:
            if reservation.tourist and reservation.tourist.user:
                send_tour_cancellation_email(reservation.tourist.user, tour)

    
    tour_title = tour.title
    tour.delete()
    
    return JsonResponse({
        'success': True,
        'message': f'Tour "{tour_title}" deleted successfully'
    }, status=200)
# ========================================
# PUBLIC - GET TOUR DETAILS
# ========================================
@csrf_exempt
@require_http_methods(["GET"])
def get_tour_details(request, tour_id):
    """
    Public endpoint to get tour details
    """
    try:
        tour = get_object_or_404(Tour, id=tour_id)
        
        # Serialize data explicitly to ensure format mismatch is avoided
        current_data = {
            'id': tour.id,
            'title': tour.title,
            'description': tour.description,
            'guide': {
                'id': tour.guide.user.id,
                'firstname': tour.guide.user.firstname,
                'lastname': tour.guide.user.lastname,
                'photo_url': tour.guide.user.photo_url if tour.guide.user.photo_url else None,
                'average_rating': str(tour.guide.average_rating),
                'number_of_reviews': tour.guide.number_of_reviews,
            },
            'average_rating': str(tour.average_rating),
            'number_of_reviews': tour.number_of_reviews,
            'reviews': [
                {
                    'id': r.id,
                    'tourist_name': f"{r.tourist.user.firstname} {r.tourist.user.lastname}",
                    'rating': r.rating,
                    'comment': r.comment,
                    'date': r.publication_date.isoformat() if r.publication_date else None
                } for r in tour.reviews.all().select_related('tourist__user')
            ],
            'date': tour.date.isoformat(),
            'scheduled_time': tour.scheduled_time.strftime('%H:%M') if tour.scheduled_time else None,
            'calculated_price': str(tour.calculated_price),
            'estimated_duration': str(tour.estimated_duration),
            'latitude': str(tour.latitude) if tour.latitude else None,
            'longitude': str(tour.longitude) if tour.longitude else None,
            'wilaya': {'code': tour.wilaya.code, 'name': tour.wilaya.name},
            'cover_photo': tour.cover_photo,
            'gallery': tour.photo_urls if tour.photo_urls else [],
            'highlights': tour.highlights,
            'itinerary': tour.itinerary,
            'whats_included': tour.whats_included,
            'whats_excluded': tour.whats_excluded,
            'max_places': tour.max_places,
            'available_places': tour.available_places,
            'start_location': tour.starting_point,
            'is_active': tour.is_active
        }
        
        return JsonResponse({
            'success': True,
            'tour': current_data
        }, status=200)

    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)
