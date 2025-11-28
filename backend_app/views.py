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

from .forms import TouristSignupForm, GuideSignupForm, VerificationForm
from .models import Tourist, Guide, CoverageZone, User, Admin


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
    """
    API endpoint for email verification
    Returns JSON response
    """
    user_id = request.session.get('pending_verification_user_id')
    
    if not user_id:
        return JsonResponse({
            'success': False,
            'message': 'No pending verification found. Please sign up first.'
        }, status=400)
    
    user = get_object_or_404(User, id=user_id)
    
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
