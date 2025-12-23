# guide_views.py
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.utils import timezone
import json
import os
import uuid
from decimal import Decimal
from .models import Guide, User, CoverageZone, Wilaya
from .models import Review
@csrf_exempt
@require_http_methods(["GET"])
def guide_profile(request, guide_id):
    """
    Get complete guide profile with all important information
    """
    guide = get_object_or_404(Guide, user_id=guide_id)
    

    coverage_zones = []
    for zone in guide.coverage_zones.all():
        coverage_zones.append({
            'code': zone.wilaya.code,
            'name': zone.wilaya.name,
            'region': zone.wilaya.region
        })
    
    # Get statistics
    total_tours = guide.tours.count()
    active_tours = guide.tours.filter(is_active=True).count()
    total_reservations = guide.reservations.count()
    completed_reservations = guide.reservations.filter(status='completed').count()
    
    # Get recent reviews from all tours
    from .models import Review
    recent_reviews = []
    all_reviews = Review.objects.filter(tour__guide=guide).order_by('-publication_date')[:5]
    for review in all_reviews:
        recent_reviews.append({
            'id': review.id,
            'tour_title': review.tour.title,
            'tourist_name': f"{review.tourist.user.firstname} {review.tourist.user.lastname}",
            'rating': review.rating,
            'comment': review.comment,
            'publication_date': review.publication_date.isoformat()
        })
    
    profile_data = {
        'user_info': {
            'id': guide.user_id,
            'email': guide.user.email,
            'firstname': guide.user.firstname,
            'lastname': guide.user.lastname,
            'photo_url': guide.user.photo_url,
            'isActive': guide.user.isActive,
            'email_verified': guide.user.email_verified
        },
        'guide_info': {
            'phone': guide.get_phone_display(),
            'phone_digits': guide.get_phone_digits(),
            'biography': guide.biography,
            'languages': guide.offering_spoken_languages,
            'approval_status': guide.approval_status,
            'is_verified': guide.is_verified,
            'average_rating': str(guide.average_rating),
            'number_of_reviews': guide.number_of_reviews,
            'submitted_at': guide.submitted_at.isoformat() if guide.submitted_at else None,
            'reviewed_at': guide.reviewed_at.isoformat() if guide.reviewed_at else None
        },
        'pricing': {
            'half_day_price': str(guide.half_day_price),
            'full_day_price': str(guide.full_day_price),
            'additional_hour_price': str(guide.additional_hour_price),
            'custom_request_markup': str(guide.custom_request_markup)
        },
        'coverage_zones': coverage_zones,
        'certifications': guide.certifications_files,
        'statistics': {
            'total_tours': total_tours,
            'active_tours': active_tours,
            'total_reservations': total_reservations,
            'completed_reservations': completed_reservations
        },
        'recent_reviews': recent_reviews
    }
    
    return JsonResponse({
        'success': True,
        'data': profile_data
    }, status=200)


@csrf_exempt
@require_http_methods(["PUT", "POST"])
def guide_update_profile(request, guide_id):
    """
    Guide updates their profile information
    """
    guide = get_object_or_404(Guide, user_id=guide_id)
    user = guide.user
    
    # Parse data
    try:
        data = json.loads(request.body)
    except:
        data = request.POST.dict()
    
    # Update User fields
    if 'firstname' in data:
        user.firstname = data['firstname']
    if 'lastname' in data:
        user.lastname = data['lastname']
    if 'photo_url' in data:
        user.photo_url = data['photo_url']
    
    user.save()
    
    # Update Guide fields
    if 'phone' in data:
        phone = data['phone'].replace(' ', '').replace('-', '')
        # Validate phone
        if len(phone) == 9 and phone[0] in ['5', '6', '7']:
            guide.phone = f"+213{phone}"
        else:
            return JsonResponse({
                'success': False,
                'message': 'Invalid phone number. Must be 9 digits starting with 5, 6, or 7'
            }, status=400)
    
    if 'biography' in data:
        guide.biography = data['biography']
    
    if 'languages' in data:
        guide.offering_spoken_languages = data['languages']
    
    # Update pricing
    if 'half_day_price' in data:
        guide.half_day_price = Decimal(str(data['half_day_price']))
    if 'full_day_price' in data:
        guide.full_day_price = Decimal(str(data['full_day_price']))
    if 'additional_hour_price' in data:
        guide.additional_hour_price = Decimal(str(data['additional_hour_price']))
    if 'custom_request_markup' in data:
        guide.custom_request_markup = Decimal(str(data['custom_request_markup']))
    
    guide.save()
    
    return JsonResponse({
        'success': True,
        'message': 'Profile updated successfully',
        'data': {
            'user_id': user.id,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'phone': guide.get_phone_display(),
            'biography': guide.biography,
            'languages': guide.offering_spoken_languages,
            'pricing': {
                'half_day_price': str(guide.half_day_price),
                'full_day_price': str(guide.full_day_price),
                'additional_hour_price': str(guide.additional_hour_price)
            }
        }
    }, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def guide_update_coverage_zones(request, guide_id):
    """
    Guide updates their coverage zones (wilayas they cover)
    """
    guide = get_object_or_404(Guide, user_id=guide_id)
    
    # Get new wilaya codes
    wilaya_codes = request.POST.getlist('wilaya_codes')
    
    if not wilaya_codes:
        try:
            data = json.loads(request.body)
            wilaya_codes = data.get('wilaya_codes', [])
        except:
            pass
    
    if not wilaya_codes:
        return JsonResponse({
            'success': False,
            'message': 'At least one wilaya code is required'
        }, status=400)
    
    # Clear existing coverage zones
    guide.coverage_zones.all().delete()
    
    # Add new coverage zones
    added_zones = []
    for code in wilaya_codes:
        try:
            wilaya = Wilaya.objects.get(code=code)
            CoverageZone.objects.create(
                guide=guide,
                wilaya=wilaya,
                displayed=f"{wilaya.name} Region"
            )
            added_zones.append({
                'code': wilaya.code,
                'name': wilaya.name
            })
        except Wilaya.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': f'Invalid wilaya code: {code}'
            }, status=400)
    
    return JsonResponse({
        'success': True,
        'message': 'Coverage zones updated successfully',
        'data': {
            'coverage_zones': added_zones
        }
    }, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def guide_upload_photo(request, guide_id):
    """
    Guide uploads profile photo
    """
    guide = get_object_or_404(Guide, user_id=guide_id)
    
    if 'photo' not in request.FILES:
        return JsonResponse({
            'success': False,
            'message': 'No photo file provided'
        }, status=400)
    
    photo = request.FILES['photo']
    
    # Save photo
    photo_dir = os.path.join(settings.MEDIA_ROOT, 'profiles')
    os.makedirs(photo_dir, exist_ok=True)
    
    fs = FileSystemStorage(location=photo_dir)
    filename = f"guide_{guide.user_id}_{uuid.uuid4().hex[:6]}_{photo.name}"
    saved_name = fs.save(filename, photo)
    file_path = f"/media/profiles/{saved_name}"
    
    # Update user photo
    guide.user.photo_url = file_path
    guide.user.save(update_fields=['photo_url'])
    
    return JsonResponse({
        'success': True,
        'message': 'Photo uploaded successfully',
        'data': {
            'photo_url': file_path
        }
    }, status=200)
# ========================================
# GUIDE - VIEW MY TOURS
# ========================================
@csrf_exempt
@require_http_methods(["GET"])
def guide_my_tours(request, guide_id):
    """
    Get all tours for a specific guide
    """
    guide = get_object_or_404(Guide, user_id=guide_id)
    tours = guide.tours.all()
    
    tours_data = []
    for tour in tours:
        tours_data.append({
            'id': tour.id,
            'title': tour.title,
            'description': tour.description,
            'estimated_duration': str(tour.estimated_duration),
            'calculated_price': str(tour.calculated_price),
            'wilaya': tour.wilaya.name,
            'starting_point': tour.starting_point,
            'available_places': tour.available_places,
            'average_rating': str(tour.average_rating),
            'number_of_reviews': tour.number_of_reviews,
            'is_active': tour.is_active,
            'cover_photo': tour.cover_photo,
            'created_at': tour.created_at.isoformat()
        })
    
    return JsonResponse({
        'success': True,
        'data': {
            'guide_name': f"{guide.user.firstname} {guide.user.lastname}",
            'total_tours': len(tours_data),
            'tours': tours_data
        }
    }, status=200)






# ========================================
# GUIDE - VIEW DASHBOARD STATS
# ========================================
@csrf_exempt
@require_http_methods(["GET"])
def guide_dashboard(request, guide_id):
    """
    Get guide dashboard statistics
    """
    guide = get_object_or_404(Guide, user_id=guide_id)
    
    total_tours = guide.tours.count()
    active_tours = guide.tours.filter(is_active=True).count()
    total_reservations = guide.reservations.count()
    completed_reservations = guide.reservations.filter(status='completed').count()
    upcoming_reservations = guide.reservations.filter(
        completed_at__isnull=True
    ).exclude(
        tour__date__lt=timezone.now().date()
    ).count()
    
    return JsonResponse({
        'success': True,
        'data': {
            'guide_name': f"{guide.user.firstname} {guide.user.lastname}",
            'approval_status': guide.approval_status,
            'average_rating': str(guide.average_rating),
            'total_reviews': guide.number_of_reviews,
            'total_tours': total_tours,
            'active_tours': active_tours,
            'total_reservations': total_reservations,
            'completed_reservations': completed_reservations,
            'upcoming_reservations': upcoming_reservations
        }
    }, status=200)


@csrf_exempt
@require_http_methods(["GET"])
def guide_my_reviews(request, guide_id):
    """
    Return all reviews for a guide across their tours
    """
    guide = get_object_or_404(Guide, user_id=guide_id)

    all_reviews = Review.objects.filter(tour__guide=guide).select_related('tour', 'tourist__user').order_by('-publication_date')

    reviews_data = []
    for r in all_reviews:
        reviews_data.append({
            'id': r.id,
            'tour': {
                'id': r.tour.id,
                'title': r.tour.title,
            },
            'tourist': {
                'id': r.tourist.user_id,
                'name': f"{r.tourist.user.firstname} {r.tourist.user.lastname}",
                'photo_url': r.tourist.user.photo_url
            },
            'rating': r.rating,
            'comment': r.comment,
            'publication_date': r.publication_date.isoformat() if r.publication_date else None
        })

    return JsonResponse({
        'success': True,
        'total_reviews': len(reviews_data),
        'data': reviews_data
    }, status=200)
