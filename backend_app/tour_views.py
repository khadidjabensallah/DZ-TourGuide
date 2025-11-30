#tour_views
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import json
import os
import uuid
from decimal import Decimal
from .models import Guide, Tour, Wilaya
# ========================================
# GUIDE - CREATE TOUR
# ========================================
@csrf_exempt
@require_http_methods(["POST"])
def guide_create_tour(request, guide_id):
    """
    Guide creates a new tour
    """
    guide = get_object_or_404(Guide, user_id=guide_id)
    
    # Get data from request
    title = request.POST.get('title')
    description = request.POST.get('description')
    itinerary = request.POST.get('itinerary')
    highlights = request.POST.get('highlights')
    whats_included = request.POST.get('whats_included')
    whats_excluded = request.POST.get('whats_excluded')
    estimated_duration = request.POST.get('estimated_duration')
    wilaya_code = request.POST.get('wilaya_code')
    starting_point = request.POST.get('starting_point')
    latitude = request.POST.get('latitude')
    longitude = request.POST.get('longitude')
    available_places = request.POST.get('available_places')
    
    # Validation
    if not all([title, description, itinerary, estimated_duration, wilaya_code, 
                starting_point, latitude, longitude, available_places]):
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
        # Create tour
        tour = Tour.objects.create(
            guide=guide,
            title=title,
            description=description,
            itinerary=itinerary,
            highlights=highlights or '',
            whats_included=whats_included or '',
            whats_excluded=whats_excluded or '',
            estimated_duration=Decimal(estimated_duration),
            wilaya=wilaya,
            starting_point=starting_point,
            latitude=Decimal(latitude),
            longitude=Decimal(longitude),
            available_places=int(available_places),
            is_active=True
        )
        
        # Handle photo uploads
        photo_urls = []
        uploaded_files = request.FILES.getlist('photos')
        
        if uploaded_files:
            photo_dir = os.path.join(settings.MEDIA_ROOT, 'tours')
            os.makedirs(photo_dir, exist_ok=True)
            fs = FileSystemStorage(location=photo_dir)
            
            for file in uploaded_files:
                filename = f"{tour.id}_{uuid.uuid4().hex[:6]}_{file.name}"
                saved_name = fs.save(filename, file)
                file_path = f"/media/tours/{saved_name}"
                photo_urls.append(file_path)
            
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
                'available_places': tour.available_places,
                'wilaya': wilaya.name
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
    if 'estimated_duration' in data:
        tour.estimated_duration = Decimal(str(data['estimated_duration']))
    if 'available_places' in data:
        tour.available_places = int(data['available_places'])
    if 'is_active' in data:
        tour.is_active = bool(data['is_active'])
    
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
    
    # Check if tour has active reservations
    active_reservations = tour.reservations.filter(status='accepted').count()
    
    if active_reservations > 0:
        return JsonResponse({
            'success': False,
            'message': f'Cannot delete tour with {active_reservations} active reservations'
        }, status=400)
    
    tour_title = tour.title
    tour.delete()
    
    return JsonResponse({
        'success': True,
        'message': f'Tour "{tour_title}" deleted successfully'
    }, status=200)
