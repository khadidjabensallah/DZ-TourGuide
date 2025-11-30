# reservations_views.py
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
    Tourist creates a reservation for a tour
    AUTO-ACCEPTS if enough places available
    """
    tour_id = request.POST.get('tour_id')
    tourist_id = request.POST.get('tourist_id')
    proposed_date = request.POST.get('proposed_date')
    proposed_time = request.POST.get('proposed_time')
    number_of_people = request.POST.get('number_of_people')
    
    # Validation
    if not all([tour_id, tourist_id, proposed_date, proposed_time, number_of_people]):
        return JsonResponse({
            'success': False,
            'message': 'All fields are required'
        }, status=400)
    
    # Get tour and tourist
    tour = get_object_or_404(Tour, id=tour_id, is_active=True)
    tourist = get_object_or_404(Tourist, user_id=tourist_id)
    
    number_of_people = int(number_of_people)
    
    # Check if enough places available
    if tour.available_places < number_of_people:
        return JsonResponse({
            'success': False,
            'message': f'Not enough places available. Only {tour.available_places} places remaining.',
            'available_places': tour.available_places
        }, status=400)
    
    try:
        # Create reservation - will auto-accept and decrease places
        reservation = Reservation.objects.create(
            tour=tour,
            guide=tour.guide,
            tourist=tourist,
            proposed_date=proposed_date,
            proposed_time=proposed_time,
            number_of_people=number_of_people,
            final_price=tour.calculated_price,
            status='accepted'  # AUTO-ACCEPTED!
        )
        
        return JsonResponse({
            'success': True,
            'message': f'Reservation accepted! {number_of_people} place(s) reserved.',
            'data': {
                'reservation_id': reservation.id,
                'tour_title': tour.title,
                'guide_name': f"{tour.guide.user.firstname} {tour.guide.user.lastname}",
                'proposed_date': reservation.proposed_date.isoformat(),
                'proposed_time': reservation.proposed_time.isoformat(),
                'number_of_people': reservation.number_of_people,
                'final_price': str(reservation.final_price),
                'status': reservation.status,
                'remaining_places': tour.available_places  # Already decreased
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
            'message': f'Error creating reservation: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def tourist_my_reservations(request, tourist_id):
    """
    Get all reservations for a tourist
    """
    tourist = get_object_or_404(Tourist, user_id=tourist_id)
    reservations = tourist.reservations.all().select_related('tour', 'guide__user')
    
    reservations_data = []
    for res in reservations:
        reservations_data.append({
            'id': res.id,
            'tour': {
                'id': res.tour.id,
                'title': res.tour.title,
                'cover_photo': res.tour.cover_photo,
                'wilaya': res.tour.wilaya.name,
                'starting_point': res.tour.starting_point
            },
            'guide': {
                'id': res.guide.user_id,
                'name': f"{res.guide.user.firstname} {res.guide.user.lastname}",
                'phone': res.guide.get_phone_display(),
                'photo_url': res.guide.user.photo_url
            },
            'proposed_date': res.proposed_date.isoformat(),
            'proposed_time': res.proposed_time.isoformat(),
            'number_of_people': res.number_of_people,
            'final_price': str(res.final_price),
            'status': res.status,
            'created_at': res.created_at.isoformat(),
            'can_review': res.status == 'completed' and not hasattr(res, 'review')
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
    user_id = request.POST.get('user_id')  # Who is cancelling
    
    reservation = get_object_or_404(Reservation, id=reservation_id)
    
    # Check if user has permission to cancel
    if reservation.tourist.user_id != int(user_id) and reservation.guide.user_id != int(user_id):
        return JsonResponse({
            'success': False,
            'message': 'You do not have permission to cancel this reservation'
        }, status=403)
    
    # Can only cancel accepted reservations
    if reservation.status != 'accepted':
        return JsonResponse({
            'success': False,
            'message': f'Cannot cancel reservation with status: {reservation.status}'
        }, status=400)
    
    # Restore places to tour
    reservation.tour.available_places += reservation.number_of_people
    reservation.tour.save(update_fields=['available_places'])
    
    # Update status
    reservation.status = 'cancelled'
    reservation.save(update_fields=['status'])
    
    return JsonResponse({
        'success': True,
        'message': 'Reservation cancelled successfully',
        'data': {
            'reservation_id': reservation.id,
            'status': reservation.status,
            'restored_places': reservation.number_of_people,
            'tour_available_places': reservation.tour.available_places
        }
    }, status=200)