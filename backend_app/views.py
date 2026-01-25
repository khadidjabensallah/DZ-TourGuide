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
from .models import Tourist, Guide, CoverageZone, User, Admin, Tour, Reservation, Review, Wilaya, WeatherInfo, Report
from .ping_view import ping


@csrf_exempt
@require_http_methods(["POST"])
def test_email(request):
    """
    Debug endpoint to attempt sending a test email and return detailed errors.
    POST params: email (required), subject (optional), body (optional)
    """
    to_email = request.POST.get('email')
    if not to_email:
        return JsonResponse({'success': False, 'message': 'Missing email parameter'}, status=400)

    subject = request.POST.get('subject') or 'Test Email from DZ-TourGuide'
    body = request.POST.get('body') or 'This is a test email from the DZ-TourGuide debug endpoint.'

    try:
        sent = send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [to_email], fail_silently=False)
        return JsonResponse({'success': True, 'message': f'Email sent (sent={sent}) to {to_email}'} , status=200)
    except Exception as e:
        # Return exception message to help debug SMTP configuration
        return JsonResponse({'success': False, 'message': 'Failed to send email', 'error': str(e)}, status=500)


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


def send_password_reset_email(user):
    """
    Send password reset verification code to user's email
    Returns True if successful, False otherwise
    """
    try:
        # Generate 6-digit code
        code = user.generate_verification_code()
        
        subject = 'Password Reset - Tour Guide Platform'
        message = f"""
Hello {user.firstname},

You requested to reset your password.

Your verification code is: {code}

This code will expire in 10 minutes.

If you didn't request a password reset, please ignore this email and your password will remain unchanged.

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
        # Return a dict so callers can access both send status and the code
        return { 'sent': True, 'code': code }
    except Exception as e:
        print(f"Error sending password reset email: {e}")
        return { 'sent': False, 'code': None }


@csrf_exempt
@require_http_methods(["POST"])
def tourist_signup(request):
    """
    API endpoint for tourist signup
    Returns JSON response
    """
    form = TouristSignupForm(request.POST)
    
    if form.is_valid():
        try:
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
        except Exception as e:
            print(f"❌ CRITICAL ERROR IN SIGNUP: {str(e)}")
            import traceback
            traceback.print_exc()
            return JsonResponse({
                'success': False,
                'message': 'An internal server error occurred',
                'error': str(e)
            }, status=500)
    else:
        # Return validation errors
        print(f"❌ VALIDATION FAILED: {form.errors}")
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
    # Handle wilaya names if sent as names instead of IDs
    post_data = request.POST.copy()
    wilaya_names = post_data.getlist('coverage_wilayas')
    
    if wilaya_names and len(wilaya_names) > 0:
        # Check if wilayas are sent as names (not numeric) and convert to IDs
        if wilaya_names[0] and not wilaya_names[0].isdigit():
            # Convert wilaya names to codes (IDs)
            wilaya_codes = []
            for name in wilaya_names:
                try:
                    wilaya = Wilaya.objects.get(name=name)
                    wilaya_codes.append(str(wilaya.code))
                except Wilaya.DoesNotExist:
                    # Try case-insensitive search
                    try:
                        wilaya = Wilaya.objects.get(name__iexact=name)
                        wilaya_codes.append(str(wilaya.code))
                    except Wilaya.DoesNotExist:
                        pass  # Skip invalid wilaya names
            post_data.setlist('coverage_wilayas', wilaya_codes)
    
    form = GuideSignupForm(post_data, request.FILES)
    
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
@require_http_methods(["GET", "POST"])
def signup_success(request):
    """
    API endpoint for signup success confirmation
    Returns JSON response indicating successful signup
    """
    return JsonResponse({
        'success': True,
        'message': 'Signup successful! Please check your email for verification code.',
        'data': {
            'next_step': 'verify_email',
            'message': 'Please verify your email address to activate your account.'
        }
    }, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def resend_verification_code(request):
    """
    API endpoint to resend verification code to user's email
    """
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
    
    # Resend verification email
    email_sent = send_verification_email(user)
    
    if email_sent:
        return JsonResponse({
            'success': True,
            'message': 'Verification code has been resent to your email.',
            'data': {
                'user_id': user.id,
                'email': user.email
            }
        }, status=200)
    else:
        return JsonResponse({
            'success': False,
            'message': 'Failed to send verification email. Please try again later.'
        }, status=500)


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

            # For guides, email verification does NOT activate the account.
            if user.user_type == 'guide':
                return JsonResponse({
                    'success': True,
                    'message': 'Email verified successfully. Your account is pending admin approval.',
                    'data': {
                        'user_id': user.id,
                        'email': user.email,
                        'email_verified': user.email_verified,
                        'is_active': user.isActive
                    }
                }, status=200)

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


import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from .models import User

# ========================================
# AUTHENTICATION - Sign In (Login)
# ========================================

import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from .models import User

@csrf_exempt
@require_http_methods(["POST"])
def signin(request):
    print("=" * 50)
    print("SIGNIN DEBUG")
    print(f"Content-Type: {request.content_type}")
    print("=" * 50)
    
    try:
        # Parse JSON body instead of form data
        if request.content_type == 'application/json':
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
        else:
            # Fallback to form data
            email = request.POST.get('email')
            password = request.POST.get('password')
        
        print(f"Email received: '{email}'")
        print(f"Password received: '{'*' * len(password) if password else None}'")
        
        if not email or not password:
            return JsonResponse({
                'success': False,
                'message': 'Email and password are required'
            }, status=400)
        
        try:
            user = User.objects.get(email=email)
            print(f"✅ User found: {user.email}")
        except User.DoesNotExist:
            print(f"❌ User NOT found with email: {email}")
            return JsonResponse({
                'success': False,
                'message': 'Invalid email or password'
            }, status=401)
        
        if not user.check_password(password):
            print(f"❌ Password incorrect")
            return JsonResponse({
                'success': False,
                'message': 'Invalid email or password'
            }, status=401)
        
        print(f"✅ Password correct")
        
        # Require email verification before sign in
        if not user.email_verified:
            return JsonResponse({
                'success': False,
                'message': 'Please verify your email before signing in.'
            }, status=403)

        # Non-guide accounts must be active to sign in. Guides may sign in after
        # verifying their email but remain limited until admin approval.
        if user.user_type != 'guide' and not user.isActive:
            return JsonResponse({
                'success': False,
                'message': 'Your account is not active.'
            }, status=403)
        
        # Store session data
        request.session['user_id'] = user.id
        request.session['user_email'] = user.email
        request.session['user_type'] = user.user_type
        request.session['is_authenticated'] = True
        
        user_data = {
            'user_id': user.id,
            'email': user.email,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'user_type': user.user_type
        }
        
        return JsonResponse({
            'success': True,
            'message': 'Sign in successful!',
            'data': user_data
        }, status=200)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON format'
        }, status=400)
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({
            'success': False,
            'message': 'An error occurred during sign in'
        }, status=500)



# ========================================
# AUTHENTICATION - Logout
# ========================================



@csrf_exempt
@require_http_methods(["POST"])
def logout(request):
    """
    API endpoint for user logout
    Clears session data
    """
    try:
        # Clear all session data
        request.session.flush()
        
        return JsonResponse({
            'success': True,
            'message': 'Logged out successfully!'
        }, status=200)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'An error occurred during logout'
        }, status=500)








# ========================================
# PASSWORD RESET - Forgot Password
# ========================================

@csrf_exempt
@require_http_methods(["POST"])
def forgot_password(request):
    """
    API endpoint for forgot password
    Sends verification code to user's email
    """
    form = ForgotPasswordForm(request.POST)
    
    if form.is_valid():
        email = form.cleaned_data['email']
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'No account found with this email address.'
            }, status=404)
        

        unverified_email = not bool(user.email_verified)

        # Send password reset verification code
        send_result = send_password_reset_email(user)
        # Preserve the original boolean shape for email_sent
        email_sent = bool(send_result and send_result.get('sent'))

        # Store user_id in session for password reset verification
        request.session['pending_password_reset_user_id'] = user.id

        response_data = {
            'user_id': user.id,
            'email': user.email,
            'email_sent': email_sent
        }

        if unverified_email:
            # Let the frontend know the account email is not verified yet.
            response_data['unverified_email'] = True

       
        return JsonResponse({
            'success': True,
            'message': 'Password reset code sent to your email! Please check your inbox.',
            'data': response_data
        }, status=200)
    else:
        return JsonResponse({
            'success': False,
            'message': 'Validation failed',
            'errors': form.errors
        }, status=400)


# ========================================
# PASSWORD RESET - Verify Code (Step 1)
# ========================================

@csrf_exempt
@require_http_methods(["POST"])
def verify_password_reset_code(request):
    """
    API endpoint for verifying password reset code (Step 1)
    User enters verification code, if correct, they can proceed to reset password
    """
    # Try to get user_id from POST data first, then session
    user_id = request.POST.get('user_id') or request.session.get('pending_password_reset_user_id')
    
    if not user_id:
        return JsonResponse({
            'success': False,
            'message': 'No pending password reset found. Please request a password reset first.'
        }, status=400)
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        # Fallback: try to locate the user by email if provided in POST.
        email_fallback = request.POST.get('email')
        if email_fallback:
            try:
                user = User.objects.get(email=email_fallback)
            except User.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid password reset request.'
                }, status=400)
        else:
            return JsonResponse({
                'success': False,
                'message': 'Invalid password reset request.'
            }, status=400)
    
    form = VerifyPasswordResetCodeForm(request.POST)
    
    if form.is_valid():
        verification_code = form.cleaned_data['verification_code']
        
        # Verify the code (using password reset verification method)
        if user.verify_password_reset_code(verification_code):
            # Code is valid, mark as verified in session
            request.session['password_reset_code_verified'] = True
            request.session['password_reset_user_id'] = user.id
            
            return JsonResponse({
                'success': True,
                'message': 'Verification code confirmed! You can now reset your password.',
                'data': {
                    'user_id': user.id,
                    'email': user.email,
                    'code_verified': True
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


# ========================================
# PASSWORD RESET - Reset Password (Step 2)
# ========================================

@csrf_exempt
@require_http_methods(["POST"])
def reset_password(request):
    """
    API endpoint for resetting password after verification code is confirmed (Step 2)
    User must have verified the code first, then provides new password (twice)
    """
    # Check if code was verified
    if not request.session.get('password_reset_code_verified'):
        return JsonResponse({
            'success': False,
            'message': 'Please verify the code first before resetting your password.'
        }, status=403)
    
    # Get user_id from session
    user_id = request.session.get('password_reset_user_id')
    
    if not user_id:
        return JsonResponse({
            'success': False,
            'message': 'No pending password reset found. Please request a password reset first.'
        }, status=400)
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Invalid password reset request.'
        }, status=400)
    
    form = ResetPasswordForm(request.POST)
    
    if form.is_valid():
        new_password = form.cleaned_data['password']
        
        # Reset the password
        user.set_password(new_password)
        user.save()
        
        # Clear all password reset session data
        if 'password_reset_code_verified' in request.session:
            del request.session['password_reset_code_verified']
        if 'password_reset_user_id' in request.session:
            del request.session['password_reset_user_id']
        if 'pending_password_reset_user_id' in request.session:
            del request.session['pending_password_reset_user_id']
        
        return JsonResponse({
            'success': True,
            'message': 'Password reset successfully! You can now sign in with your new password.',
            'data': {
                'user_id': user.id,
                'email': user.email
            }
        }, status=200)
    else:
        return JsonResponse({
            'success': False,
            'message': 'Validation failed',
            'errors': form.errors
        }, status=400)
# ========================================
# WEATHER VIEW
# ========================================
@csrf_exempt
@require_http_methods(["GET"])
def get_weather(request, tour_id):
    """
    Get weather forecast for a specific tour using real data.
    """
    try:
        # Get the tour
        tour = get_object_or_404(Tour, id=tour_id)
        
        # Use model method to get or fetch weather
        weather = WeatherInfo.get_weather_for_tour(tour, tour.date)
        
        if weather:
            return JsonResponse({
                'success': True,
                'weather': {
                    'date': weather.date.isoformat(),
                    'max_temperature': float(weather.max_temperature) if weather.max_temperature else None,
                    'min_temperature': float(weather.min_temperature) if weather.min_temperature else None,
                    'conditions': weather.conditions,
                    'icon': weather.icon,
                    'icon_url': f"https://openweathermap.org/img/wn/{weather.icon}@2x.png" if weather.icon else None
                }
            })
        else:
            return JsonResponse({
                'success': False,
                'weather': None,
                'message': 'Weather data not available for this date (must be within forecast window)'
            })
        
    except Tour.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Tour not found'}, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': 'Unable to fetch weather information',
            'details': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def create_review(request):
    try:
        tour_id = request.POST.get('tour_id')
        tourist_id = request.POST.get('tourist_id')
        rating = request.POST.get('rating')
        comment = request.POST.get('comment')

        if not all([tour_id, tourist_id, rating, comment]):
            return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)

        tour = get_object_or_404(Tour, id=tour_id)
        tourist = get_object_or_404(Tourist, user_id=tourist_id)

        review = Review.objects.create(
            tour=tour,
            tourist=tourist,
            rating=int(rating),
            comment=comment
        )

        # Update ratings
        tour.update_rating()
        tour.guide.update_rating()

        return JsonResponse({
            'success': True,
            'message': 'Review submitted successfully',
            'review_id': review.id
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def create_report(request):
    try:
        def get_clean_id(key):
            val = request.POST.get(key)
            if val in [None, '', 'null', 'undefined']:
                return None
            return val

        guide_id = get_clean_id('guide_id')
        tourist_id = get_clean_id('tourist_id')
        tour_id = get_clean_id('tour_id')
        title = request.POST.get('title')
        description = request.POST.get('description')

        if not all([guide_id, tourist_id, title, description]):
            missing = [k for k, v in {'guide_id': guide_id, 'tourist_id': tourist_id, 'title': title, 'description': description}.items() if not v]
            return JsonResponse({'success': False, 'message': f'Missing required fields: {", ".join(missing)}'}, status=400)

        # Use try-except for get_object_or_404 behavior control
        try:
            guide = Guide.objects.get(user_id=guide_id)
        except (Guide.DoesNotExist, ValueError):
            return JsonResponse({'success': False, 'message': f'Invalid Guide ID: {guide_id}'}, status=404)
            
        try:
            tourist = Tourist.objects.get(user_id=tourist_id)
        except (Tourist.DoesNotExist, ValueError):
            return JsonResponse({'success': False, 'message': f'Invalid Tourist ID: {tourist_id}'}, status=404)

        tour = None
        if tour_id:
            try:
                tour = Tour.objects.get(id=tour_id)
            except (Tour.DoesNotExist, ValueError):
                pass # Optional field, ignore if invalid tour id

        report = Report.objects.create(
            guide=guide,
            tourist=tourist,
            tour=tour,
            title=title,
            description=description
        )

        return JsonResponse({
            'success': True,
            'message': 'Report submitted successfully',
            'report_id': report.id
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)