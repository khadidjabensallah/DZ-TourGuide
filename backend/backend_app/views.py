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
from .models import Tourist, Guide, CoverageZone, User, Admin, Tour, Reservation, Review, Wilaya


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
        
        # Allow sign in regardless of email verification status for already-signed-up emails.
        # Previously blocked unverified users from signing in; this restriction was removed
        # to allow users to sign in even if they haven't completed email verification.
        
        if not user.isActive:
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
@require_http_methods(["GET"])
def get_weather(request, tour_id):
    """
    Return current weather for the tour's coordinates.
    If `OPENWEATHER_API_KEY` is set in Django settings we'll call OpenWeatherMap,
    otherwise return a small mocked payload so frontend can work during local dev.
    """
    # Ensure tour exists
    tour = get_object_or_404(Tour, id=tour_id)

    try:
        lat = float(tour.latitude)
        lon = float(tour.longitude)
    except Exception:
        return JsonResponse({
            'success': False,
            'message': 'Invalid coordinates for tour'
        }, status=400)

    api_key = getattr(settings, 'OPENWEATHER_API_KEY', None)
    if api_key:
        try:
            url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={api_key}"
            resp = requests.get(url, timeout=5)
            resp.raise_for_status()
            payload = resp.json()
            data = {
                'temperature': payload.get('main', {}).get('temp'),
                'description': (payload.get('weather') or [{}])[0].get('description'),
                'wind_speed': payload.get('wind', {}).get('speed'),
                'raw': payload,
            }
            return JsonResponse({'success': True, 'data': data}, status=200)
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Weather provider error', 'error': str(e)}, status=502)

    # No API key configured — return a mocked response for local dev
    mock = {
        'temperature': 25.0,
        'description': 'clear sky',
        'wind_speed': 3.5
    }
    return JsonResponse({'success': True, 'message': 'Mock data (no API key configured)', 'data': mock}, status=200)
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
@require_http_methods(["GET"])
def tour_weather_forecast(request, tour_id):
    """
    Get weather forecast for a specific tour.
    Returns ONLY weather info if available (tour within 5 days).
    Returns weather: null if not available (no error).
    """
    try:
        import os
        # Get the tour
        tour = get_object_or_404(Tour, id=tour_id)
        
        # Calculate days until tour using tour.date
        days_until = (tour.date - timezone.now().date()).days
        
        # Check if API key is configured
        # Check for both OPENWEATHERMAP_API_KEY and OPENWEATHER_API_KEY for compatibility
        api_key = os.getenv('OPENWEATHERMAP_API_KEY') or os.getenv('OPENWEATHER_API_KEY')
        if not api_key:
            return JsonResponse({
                'weather': None,
                'message': 'Weather API key not configured. Please set OPENWEATHERMAP_API_KEY or OPENWEATHER_API_KEY environment variable.',
                'tour_date': tour.date.isoformat(),
                'days_until': days_until
            })
        
        # Only try to get weather if tour is within 0-5 days
        if 0 <= days_until <= 5:
            try:
                weather = WeatherInfo.get_weather_for_tour(tour, tour.date)
                
                if weather:
                    # Weather available - return ONLY weather info
                    return JsonResponse({
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
                    # Weather fetch failed (API error or no data)
                    # Try to get more specific error info
                    try:
                        # Test the API call directly to get error details
                        test_response = requests.get(
                            "https://api.openweathermap.org/data/2.5/forecast",
                            params={
                                'lat': float(tour.latitude),
                                'lon': float(tour.longitude),
                                'appid': api_key,
                                'units': 'metric',
                                'cnt': 40
                            },
                            timeout=10
                        )
                        if test_response.status_code == 401:
                            error_msg = 'Invalid API key. Please check your OPENWEATHERMAP_API_KEY.'
                        elif test_response.status_code == 429:
                            error_msg = 'API rate limit exceeded. Please try again later.'
                        elif test_response.status_code != 200:
                            error_msg = f'API returned error: {test_response.status_code} - {test_response.text[:200]}'
                        else:
                            # API returned 200, try to process data directly as fallback
                            try:
                                from decimal import Decimal
                                
                                data = test_response.json()
                                if 'list' in data and data['list']:
                                    # Find forecast closest to noon on tour date
                                    target_datetime = datetime.combine(tour.date, datetime.min.time().replace(hour=12))
                                    target_datetime = timezone.make_aware(target_datetime)
                                    target_timestamp = int(target_datetime.timestamp())
                                    
                                    closest_forecast = None
                                    min_diff = float('inf')
                                    
                                    for forecast in data['list']:
                                        forecast_timestamp = forecast.get('dt', 0)
                                        time_diff = abs(forecast_timestamp - target_timestamp)
                                        if time_diff < min_diff:
                                            min_diff = time_diff
                                            closest_forecast = forecast
                                    
                                    if closest_forecast:
                                        main_data = closest_forecast.get('main', {})
                                        weather_data = closest_forecast.get('weather', [{}])[0]
                                        
                                        temp = main_data.get('temp')
                                        temp_max = main_data.get('temp_max', temp)
                                        temp_min = main_data.get('temp_min', temp)
                                        conditions = weather_data.get('description', 'N/A')
                                        icon = weather_data.get('icon', '')
                                        
                                        # Return weather data directly (fallback if DB save failed)
                                        return JsonResponse({
                                            'weather': {
                                                'date': tour.date.isoformat(),
                                                'max_temperature': float(temp_max) if temp_max else None,
                                                'min_temperature': float(temp_min) if temp_min else None,
                                                'conditions': conditions,
                                                'icon': icon,
                                                'icon_url': f"https://openweathermap.org/img/wn/{icon}@2x.png" if icon else None
                                            }
                                        })
                                
                                error_msg = 'Weather data fetched but could not be processed. Check server logs for details.'
                            except Exception as process_error:
                                error_msg = f'Weather data fetched but processing failed: {str(process_error)}'
                    except requests.exceptions.Timeout:
                        error_msg = 'API request timed out. Check your network connection.'
                    except requests.exceptions.ConnectionError:
                        error_msg = 'Could not connect to weather API. Check your network connection.'
                    except Exception as e:
                        error_msg = f'Error testing API: {str(e)}'
                    
                    return JsonResponse({
                        'weather': None,
                        'message': error_msg,
                        'tour_date': tour.date.isoformat(),
                        'days_until': days_until,
                        'tour_location': {
                            'latitude': float(tour.latitude),
                            'longitude': float(tour.longitude)
                        }
                    })
            except Exception as e:
                return JsonResponse({
                    'weather': None,
                    'message': f'Error fetching weather: {str(e)}',
                    'tour_date': tour.date.isoformat(),
                    'days_until': days_until
                })
        
        # If we reach here: tour date is outside 0-5 day window
        return JsonResponse({
            'weather': None,
            'message': f'Weather forecast only available for tours within 0-5 days. This tour is {days_until} days away.',
            'tour_date': tour.date.isoformat(),
            'days_until': days_until
        })
        
    except Tour.DoesNotExist:
        return JsonResponse({'error': 'Tour not found'}, status=404)
    except Exception as e:
        return JsonResponse({
            'error': 'Unable to fetch weather information',
            'details': str(e)
        }, status=500)