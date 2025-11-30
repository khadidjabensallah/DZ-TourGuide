from django.shortcuts import get_object_or_404
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import os
import uuid
import json
from decimal import Decimal
from .forms import TouristSignupForm, GuideSignupForm, VerificationForm
from .models import Tourist, Guide, CoverageZone, User, Admin, Tour, Reservation, Review, Wilaya


def send_verification_email(user):
    """
    Send verification code to user's email
    Returns True if successful, False otherwise
    """
    try:
        # Generate 6-digit code
        code = user.generate_verification_code()
        
        subject = 'Verify Your Email - Tour Guide Platform'
        message = f"""
Hello {user.firstname},

Thank you for signing up!

Your verification code is: {code}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
Tour Guide Platform Team
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


@csrf_exempt
@require_http_methods(["POST"])
def tourist_signup(request):
    """
    API endpoint for tourist signup
    Returns JSON response
    """
    form = TouristSignupForm(request.POST)
    
    if form.is_valid():
  
        user = User.objects.create(
            email=form.cleaned_data['email'],
            firstname=form.cleaned_data['firstname'],
            lastname=form.cleaned_data['lastname'],
            user_type='tourist',
            isActive=False,
            email_verified=False
        )
        

        user.set_password(form.cleaned_data['password'])
        user.save()
        

        tourist = Tourist.objects.create(
            user=user,
            nationality=form.cleaned_data.get('nationality', '')
        )
        
        # Step 4: Send verification email
        email_sent = send_verification_email(user)
        
        # Store user_id in session for verification
        request.session['pending_verification_user_id'] = user.id
        
        return JsonResponse({
            'success': True,
            'message': 'Tourist account created successfully! Please check your email for verification code.',
            'data': {
                'user_id': user.id,
                'email': user.email,
                'firstname': user.firstname,
                'lastname': user.lastname,
                'user_type': user.user_type,
                'email_sent': email_sent
            }
        }, status=201)
    else:
        # Return validation errors
        return JsonResponse({
            'success': False,
            'message': 'Validation failed',
            'errors': form.errors
        }, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def guide_signup(request):
    """
    API endpoint for guide signup
    Returns JSON response
    """
    form = GuideSignupForm(request.POST, request.FILES)
    
    if form.is_valid():
        # Step 1: Create User instance
        user = User.objects.create(
            email=form.cleaned_data['email'],
            firstname=form.cleaned_data['firstname'],
            lastname=form.cleaned_data['lastname'],
            user_type='guide',
            isActive=False,
            email_verified=False
        )
        
        # Step 2: Hash and set password
        user.set_password(form.cleaned_data['password'])
        user.save()
        
        # Step 3: Create Guide profile
        guide = Guide.objects.create(
            user=user,
            phone=form.cleaned_data['phone'],
            biography=form.cleaned_data.get('biography', ''),
            offering_spoken_languages=list(form.cleaned_data['languages']),
            certifications_files=[],
            full_day_price=form.cleaned_data['full_day_price'],
            half_day_price=form.cleaned_data['half_day_price'],
            additional_hour_price=form.cleaned_data['additional_hour_price'],
            custom_request_markup=form.cleaned_data['custom_request_markup'],
            is_verified=False,
        )
        
        # Step 4: Handle certification file uploads
        certification_paths = []
        uploaded_files = request.FILES.getlist('certification_files')
        
        if uploaded_files:
            cert_dir = os.path.join(settings.MEDIA_ROOT, 'certifications')
            os.makedirs(cert_dir, exist_ok=True)
            
            fs = FileSystemStorage(location=cert_dir)
            
            for file in uploaded_files:
                filename = f"{user.id}_{uuid.uuid4().hex[:6]}_{file.name}"
                saved_name = fs.save(filename, file)
                file_path = f"/media/certifications/{saved_name}"
                certification_paths.append(file_path)
            
            guide.certifications_files = certification_paths
            guide.save()
        
        # Step 5: Create coverage zones
        coverage_zones = []
        for wilaya in form.cleaned_data['coverage_wilayas']:
            zone = CoverageZone.objects.create(
                guide=guide,
                wilaya=wilaya,
                displayed=f"{wilaya.name} Region"
            )
            coverage_zones.append(wilaya.name)
        
        # Step 6: Send verification email
        email_sent = send_verification_email(user)
        
        # Store user_id in session for verification
        request.session['pending_verification_user_id'] = user.id
        
        return JsonResponse({
            'success': True,
            'message': 'Guide account created successfully! Please check your email for verification code.',
            'data': {
                'user_id': user.id,
                'email': user.email,
                'firstname': user.firstname,
                'lastname': user.lastname,
                'phone': guide.phone,
                'user_type': user.user_type,
                'approval_status': guide.approval_status,
                'coverage_zones': coverage_zones,
                'email_sent': email_sent
            }
        }, status=201)
    else:
        # Return validation errors
        return JsonResponse({
            'success': False,
            'message': 'Validation failed',
            'errors': form.errors
        }, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def verify_email(request):
    # Try to get user_id from POST data first, then session
    user_id = request.POST.get('user_id') or request.session.get('pending_verification_user_id')
    
    if not user_id:
        return JsonResponse({
            'success': False,
            'message': 'No pending verification found. Please sign up first.'
        }, status=400)
    
    try:
        user = User.objects.get(id=user_id, email_verified=False)
    except User.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Invalid verification request or email already verified.'
        }, status=400)
    
    form = VerificationForm(request.POST)
    
    if form.is_valid():
        code = form.cleaned_data['verification_code']
        
        if user.verify_code(code):
            # Clear session
            if 'pending_verification_user_id' in request.session:
                del request.session['pending_verification_user_id']
            
            return JsonResponse({
                'success': True,
                'message': 'Email verified successfully! Your account is now active.',
                'data': {
                    'user_id': user.id,
                    'email': user.email,
                    'email_verified': user.email_verified,
                    'is_active': user.isActive
                }
            }, status=200)
        else:
            return JsonResponse({
                'success': False,
                'message': 'Invalid or expired verification code. Please try again.'
            }, status=400)
    else:
        return JsonResponse({
            'success': False,
            'message': 'Validation failed',
            'errors': form.errors
        }, status=400)



@csrf_exempt
@require_http_methods(["POST"])
def resend_verification_code(request):
    """
    API endpoint to resend verification code
    Returns JSON response
    """
    user_id = request.session.get('pending_verification_user_id')
    
    if not user_id:
        return JsonResponse({
            'success': False,
            'message': 'No pending verification found.'
        }, status=400)
    
    user = get_object_or_404(User, id=user_id)
    
    if send_verification_email(user):
        return JsonResponse({
            'success': True,
            'message': 'Verification code sent successfully! Check your email.'
        }, status=200)
    else:
        return JsonResponse({
            'success': False,
            'message': 'Failed to send verification code. Please try again.'
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def signup_success(request):
    """
    Success endpoint (optional)
    """
    return JsonResponse({
        'success': True,
        'message': 'Signup process completed successfully!'
    }, status=200)


@csrf_exempt
@require_http_methods(["GET"])
def choose_role(request):
    """
    API endpoint to get available roles
    """
    return JsonResponse({
        'success': True,
        'message': 'Choose your role',
        'roles': [
            {
                'type': 'tourist',
                'name': 'Tourist',
                'signup_url': '/signup/tourist/'
            },
            {
                'type': 'guide',
                'name': 'Guide',
                'signup_url': '/signup/guide/'
            }
        ]
    }, status=200)


# ========================================
# ADMIN VIEWS - Approve/Reject Guides
# ========================================

@csrf_exempt
@require_http_methods(["POST"])
def admin_approve_guide(request, guide_id):
    """
    API endpoint for admin to approve guide
    """
    # TODO: Add authentication check
    # if not request.user.is_authenticated or request.user.user_type != 'admin':
    #     return JsonResponse({'success': False, 'message': 'Unauthorized'}, status=403)
    
    guide = get_object_or_404(Guide, user_id=guide_id)
    # admin = get_object_or_404(Admin, user=request.user)
    
    # For now, create a dummy admin or skip admin requirement
    guide.approval_status = 'approved'
    guide.is_verified = True
    guide.save()
    
    return JsonResponse({
        'success': True,
        'message': f'Guide {guide.user.firstname} {guide.user.lastname} has been approved.',
        'data': {
            'guide_id': guide.user_id,
            'approval_status': guide.approval_status,
            'is_verified': guide.is_verified
        }
    }, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def admin_reject_guide(request, guide_id):
    """
    API endpoint for admin to reject guide
    """
    # TODO: Add authentication check
    
    guide = get_object_or_404(Guide, user_id=guide_id)
    
    guide.approval_status = 'rejected'
    guide.is_verified = False
    guide.save()
    
    return JsonResponse({
        'success': True,
        'message': f'Guide {guide.user.firstname} {guide.user.lastname} has been rejected.',
        'data': {
            'guide_id': guide.user_id,
            'approval_status': guide.approval_status,
            'is_verified': guide.is_verified
        }
    }, status=200)

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


# ========================================
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
# GUIDE - VIEW MY RESERVATIONS
# ========================================
@csrf_exempt
@require_http_methods(["GET"])
def guide_my_reservations(request, guide_id):
    """
    Get all reservations for a guide
    """
    guide = get_object_or_404(Guide, user_id=guide_id)
    reservations = guide.reservations.all()
    
    reservations_data = []
    for res in reservations:
        reservations_data.append({
            'id': res.id,
            'tour_title': res.tour.title,
            'tourist_name': f"{res.tourist.user.firstname} {res.tourist.user.lastname}",
            'tourist_email': res.tourist.user.email,
            'proposed_date': res.proposed_date.isoformat(),
            'proposed_time': res.proposed_time.isoformat(),
            'number_of_people': res.number_of_people,
            'final_price': str(res.final_price),
            'status': res.status,
            'created_at': res.created_at.isoformat()
        })
    
    return JsonResponse({
        'success': True,
        'data': {
            'total_reservations': len(reservations_data),
            'reservations': reservations_data
        }
    }, status=200)


# ========================================
# GUIDE - UPDATE RESERVATION STATUS
# ========================================
@csrf_exempt
@require_http_methods(["POST"])
def guide_update_reservation_status(request, guide_id, reservation_id):
    """
    Guide updates reservation status (complete or cancel)
    """
    guide = get_object_or_404(Guide, user_id=guide_id)
    reservation = get_object_or_404(Reservation, id=reservation_id, guide=guide)
    
    new_status = request.POST.get('status')
    
    if new_status not in ['completed', 'cancelled']:
        return JsonResponse({
            'success': False,
            'message': 'Invalid status. Must be "completed" or "cancelled"'
        }, status=400)
    
    # If cancelling, restore available places
    if new_status == 'cancelled' and reservation.status == 'accepted':
        reservation.tour.available_places += reservation.number_of_people
        reservation.tour.save()
    
    reservation.status = new_status
    
    if new_status == 'completed':
        from django.utils import timezone
        reservation.completed_at = timezone.now()
    
    reservation.save()
    
    return JsonResponse({
        'success': True,
        'message': f'Reservation {new_status} successfully',
        'data': {
            'reservation_id': reservation.id,
            'status': reservation.status
        }
    }, status=200)


# ========================================
# GUIDE - VIEW MY REVIEWS
# ========================================
@csrf_exempt
@require_http_methods(["GET"])
def guide_my_reviews(request, guide_id):
    """
    Get all reviews for a guide
    """
    guide = get_object_or_404(Guide, user_id=guide_id)
    reviews = guide.reviews.all()
    
    reviews_data = []
    for review in reviews:
        reviews_data.append({
            'id': review.id,
            'tour_title': review.tour.title,
            'tourist_name': f"{review.tourist.user.firstname} {review.tourist.user.lastname}",
            'rating': review.rating,
            'comment': review.comment,
            'publication_date': review.publication_date.isoformat()
        })
    
    return JsonResponse({
        'success': True,
        'data': {
            'guide_name': f"{guide.user.firstname} {guide.user.lastname}",
            'average_rating': str(guide.average_rating),
            'total_reviews': guide.number_of_reviews,
            'reviews': reviews_data
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
        status='accepted',
        proposed_date__gte=timezone.now().date()
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

