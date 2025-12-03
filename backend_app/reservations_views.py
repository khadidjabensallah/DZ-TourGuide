from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from .models import Tour, Tourist, Reservation, Guide


@csrf_exempt
@require_http_methods(["POST"])
def create_reservation(request):
    """
    Tourist reserves spots for a tour (date already set by guide in tour)
    Only requires: tour_id, tourist_id, and number_of_people
    The tour already has its scheduled date set by the guide
    """
    tour_id = request.POST.get('tour_id')
    tourist_id = request.POST.get('tourist_id')
    number_of_people = request.POST.get('number_of_people', '1')  # Default to 1
    
    # Validation
    if not tour_id or not tourist_id:
        return JsonResponse({
            'success': False,
            'message': 'Tour ID and Tourist ID are required'
        }, status=400)
    
    # Get tour and tourist
    try:
        tour = Tour.objects.get(id=tour_id, is_active=True)
    except Tour.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Tour not found or not available'
        }, status=404)
    
    # Check if tour has a scheduled date
    if not tour.date:
        return JsonResponse({
            'success': False,
            'message': 'This tour does not have a scheduled date yet. Please contact the guide.'
        }, status=400)
    
    # Check if tour date is in the past
    if tour.date < timezone.now().date():
        return JsonResponse({
            'success': False,
            'message': 'This tour date has already passed'
        }, status=400)
    
    tourist = get_object_or_404(Tourist, user_id=tourist_id)
    
    # Validate number of people
    try:
        number_of_people = int(number_of_people)
        if number_of_people < 1:
            return JsonResponse({
                'success': False,
                'message': 'Number of people must be at least 1'
            }, status=400)
    except ValueError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid number of people'
        }, status=400)
    
    # Check if enough places available
    if tour.available_places < number_of_people:
        return JsonResponse({
            'success': False,
            'message': f'Not enough places available. Only {tour.available_places} place(s) remaining.',
            'available_places': tour.available_places
        }, status=400)
    
    # Check if tourist already has a reservation for this tour
    existing_reservation = Reservation.objects.filter(
        tour=tour,
        tourist=tourist,
        completed_at__isnull=True  # Not completed yet
    ).first()
    
    if existing_reservation:
        return JsonResponse({
            'success': False,
            'message': 'You already have a reservation for this tour. Please cancel it first if you want to make a new one.'
        }, status=400)
    
    try:
        # Create reservation with tour's scheduled date
        reservation = Reservation.objects.create(
            tour=tour,
            guide=tour.guide,
            tourist=tourist,
            number_of_people=number_of_people,
            final_price=tour.calculated_price * number_of_people,  # Price per person
        )
        
        # Decrease available places
        tour.available_places -= number_of_people
        tour.save(update_fields=['available_places'])
        
        return JsonResponse({
            'success': True,
            'message': f'Reservation confirmed! {number_of_people} place(s) reserved.',
            'data': {
                'reservation_id': reservation.id,
                'tour_title': tour.title,
                'tour_id': tour.id,
                'tour_date': tour.date.isoformat(),
                'tour_time': tour.scheduled_time.strftime("%H:%M") if tour.scheduled_time else "TBD",
                'guide': {
                    'id': tour.guide.user_id,
                    'name': f"{tour.guide.user.firstname} {tour.guide.user.lastname}",
                    'phone': tour.guide.get_phone_display(),
                },
                'number_of_people': reservation.number_of_people,
                'price_per_person': str(tour.calculated_price),
                'final_price': str(reservation.final_price),
                'remaining_places': tour.available_places,
                'created_at': reservation.created_at.isoformat()
            }
        }, status=201)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Error creating reservation: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def tourist_my_reservations(request, tourist_id):
    """
    Get all reservations for a tourist
    """
    tourist = get_object_or_404(Tourist, user_id=tourist_id)
    reservations = tourist.reservations.all().select_related('tour', 'guide__user').order_by('-created_at')
    
    reservations_data = []
    for res in reservations:
        # Determine status
        is_completed = res.completed_at is not None
        tour_date = res.tour.date if res.tour.date else None
        is_past = tour_date < timezone.now().date() if tour_date else False
        
        reservations_data.append({
            'id': res.id,
            'tour': {
                'id': res.tour.id,
                'title': res.tour.title,
                'cover_photo': res.tour.cover_photo,
                'wilaya': res.tour.wilaya.name,
                'starting_point': res.tour.starting_point,
                'estimated_duration': str(res.tour.estimated_duration),
                'scheduled_date': res.tour.date.isoformat() if res.tour.date else None,
                'scheduled_time': res.tour.scheduled_time.strftime("%H:%M") if res.tour.scheduled_time else None
            },
            'guide': {
                'id': res.guide.user_id,
                'name': f"{res.guide.user.firstname} {res.guide.user.lastname}",
                'phone': res.guide.get_phone_display(),
                'photo_url': res.guide.user.photo_url,
                'average_rating': str(res.guide.average_rating)
            },
            'number_of_people': res.number_of_people,
            'final_price': str(res.final_price),
            'is_completed': is_completed,
            'is_past': is_past,
            'can_cancel': not is_completed and not is_past,
            'completed_at': res.completed_at.isoformat() if res.completed_at else None,
            'created_at': res.created_at.isoformat()
        })
    
    return JsonResponse({
        'success': True,
        'total_reservations': len(reservations_data),
        'data': reservations_data
    }, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def cancel_reservation(request, reservation_id):
    """
    Tourist or Guide cancels a reservation
    Restores available places to tour
    """
    user_id = request.POST.get('user_id')
    
    if not user_id:
        return JsonResponse({
            'success': False,
            'message': 'User ID is required'
        }, status=400)
    
    reservation = get_object_or_404(Reservation, id=reservation_id)
    
    # Check if user has permission to cancel
    is_tourist = reservation.tourist.user_id == int(user_id)
    is_guide = reservation.guide.user_id == int(user_id)
    
    if not is_tourist and not is_guide:
        return JsonResponse({
            'success': False,
            'message': 'You do not have permission to cancel this reservation'
        }, status=403)
    
    # Check if already completed
    if reservation.completed_at is not None:
        return JsonResponse({
            'success': False,
            'message': 'Cannot cancel a completed reservation'
        }, status=400)
    
    # Check if tour date is in the past
    if reservation.tour.scheduled_date and reservation.tour.scheduled_date < timezone.now().date():
        return JsonResponse({
            'success': False,
            'message': 'Cannot cancel a past reservation'
        }, status=400)
    
    # Save info before deletion
    tour_title = reservation.tour.title
    number_of_people = reservation.number_of_people
    tour_available_places = reservation.tour.available_places + number_of_people
    
    # Restore places to tour
    reservation.tour.available_places += number_of_people
    reservation.tour.save(update_fields=['available_places'])
    
    # Delete the reservation
    reservation.delete()
    
    return JsonResponse({
        'success': True,
        'message': f'Reservation for "{tour_title}" cancelled successfully',
        'data': {
            'tour_title': tour_title,
            'restored_places': number_of_people,
            'tour_available_places': tour_available_places
        }
    }, status=200)


@csrf_exempt
@require_http_methods(["GET"])
def guide_my_reservations(request, guide_id):
    """
    Get all reservations for a guide's tours
    """
    guide = get_object_or_404(Guide, user_id=guide_id)
    reservations = Reservation.objects.filter(
        guide=guide
    ).select_related('tour', 'tourist__user').order_by('-created_at')
    
    reservations_data = []
    for res in reservations:
        is_completed = res.completed_at is not None
        tour_date = res.tour.scheduled_date if res.tour.scheduled_date else None
        is_past = tour_date < timezone.now().date() if tour_date else False
        
        reservations_data.append({
            'id': res.id,
            'tour': {
                'id': res.tour.id,
                'title': res.tour.title,
                'cover_photo': res.tour.cover_photo,
                'scheduled_date': res.tour.scheduled_date.isoformat() if res.tour.scheduled_date else None,
                'scheduled_time': res.tour.scheduled_time.strftime("%H:%M") if res.tour.scheduled_time else None
            },
            'tourist': {
                'id': res.tourist.user_id,
                'name': f"{res.tourist.user.firstname} {res.tourist.user.lastname}",
                'email': res.tourist.user.email,
                'photo_url': res.tourist.user.photo_url
            },
            'number_of_people': res.number_of_people,
            'final_price': str(res.final_price),
            'is_completed': is_completed,
            'is_past': is_past,
            'can_complete': not is_completed and is_past,
            'completed_at': res.completed_at.isoformat() if res.completed_at else None,
            'created_at': res.created_at.isoformat()
        })
    
    return JsonResponse({
        'success': True,
        'total_reservations': len(reservations_data),
        'data': reservations_data
    }, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def complete_reservation(request, reservation_id):
    """
    Guide marks a reservation as completed (after the tour is done)
    """
    guide_id = request.POST.get('guide_id')
    
    if not guide_id:
        return JsonResponse({
            'success': False,
            'message': 'Guide ID is required'
        }, status=400)
    
    reservation = get_object_or_404(Reservation, id=reservation_id)
    
    # Check if user is the guide
    if reservation.guide.user_id != int(guide_id):
        return JsonResponse({
            'success': False,
            'message': 'Only the guide can mark this reservation as completed'
        }, status=403)
    
    # Check if already completed
    if reservation.completed_at is not None:
        return JsonResponse({
            'success': False,
            'message': 'This reservation is already completed'
        }, status=400)
    
    # Mark as completed
    reservation.completed_at = timezone.now()
    reservation.save(update_fields=['completed_at'])
    
    return JsonResponse({
        'success': True,
        'message': 'Reservation marked as completed',
        'data': {
            'reservation_id': reservation.id,
            'tour_title': reservation.tour.title,
            'completed_at': reservation.completed_at.isoformat()
        }
    }, status=200)