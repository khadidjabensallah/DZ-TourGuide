from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from django.db.models import Count, Q
from .models import User, Guide, Tourist, Admin
import os
import uuid
import json
from django.core.files.storage import FileSystemStorage
from django.utils import timezone


# ============================


# ============================================
# ADMIN FUNCTION - Delete User (API VERSION)
# ============================================

@csrf_exempt
@require_http_methods(["POST"])  # Changé en POST pour API REST
def admin_delete_user(request, user_id):
    """
    Admin deletes a user account permanently (API version).
    POST data required:
      - admin_id: ID of the admin performing the action
    """
    from django.views.decorators.http import require_http_methods
    
    # Get admin_id from POST data
    admin_id = request.POST.get('admin_id')
    
    if not admin_id:
        return JsonResponse({
            'success': False,
            'message': 'admin_id is required'
        }, status=400)
    
    # Verify admin exists
    try:
        admin = Admin.objects.get(user_id=admin_id)
    except Admin.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Admin not found or not authorized'
        }, status=403)
    
    # Get user to delete
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'User not found'
        }, status=404)
    
    # Prevent admin from deleting themselves
    if user.id == admin.user_id:
        return JsonResponse({
            'success': False,
            'message': 'You cannot delete your own admin account'
        }, status=400)
    
    # Prevent deleting other admins
    if user.user_type == 'admin':
        return JsonResponse({
            'success': False,
            'message': 'You cannot delete other admin accounts'
        }, status=403)
    
    # Capture name/email for response
    name = f"{user.firstname} {user.lastname}"
    email = user.email
    user_type = user.user_type
    
    try:
        user.delete()
        return JsonResponse({
            'success': True,
            'message': f'User {name} ({email}) has been deleted successfully',
            'data': {
                'deleted_user_id': user_id,
                'name': name,
                'email': email,
                'user_type': user_type
            }
        }, status=200)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to delete user: {str(e)}'
        }, status=500)





def send_guide_approval_email(guide):
    """
    Send approval notification email to guide
    Returns True if successful, False otherwise
    """
    try:
        user = guide.user
        
        subject = '🎉 Your Guide Application Has Been Approved!'
        message = f"""
Hello {user.firstname},

Great news! Your guide application has been approved by our admin team.

You can now:
✓ Accept bookings from tourists
✓ Manage your profile and availability
✓ Start earning as a tour guide

Your Profile Details:
- Name: {user.firstname} {user.lastname}
- Email: {user.email}
- Phone: {guide.get_phone_display()}
- Languages: {', '.join(guide.offering_spoken_languages)}

Log in to your account to get started:
{settings.SITE_URL}/login

Welcome to our community of professional tour guides!

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
        print(f"Error sending approval email: {e}")
        return False


def send_guide_rejection_email(guide):
    """
    Send rejection notification email to guide
    Returns True if successful, False otherwise
    """
    try:
        user = guide.user
        
        subject = 'Update on Your Guide Application'
        message = f"""
Hello {user.firstname},

Thank you for your interest in becoming a guide on our platform.

After careful review, we are unable to approve your application at this time.

If you have questions or would like to reapply in the future, please contact our support team at {settings.DEFAULT_FROM_EMAIL}.

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
        print(f"Error sending rejection email: {e}")
        return False




# ============================================
# AJAX ENDPOINTS (Optional - for dynamic UI)
# ============================================

@csrf_exempt
def admin_approve_guide_ajax(request, guide_id):
    """
    AJAX endpoint to approve guide without page reload
    Returns JSON response
    """
    # Allow API clients to provide `admin_id` either as form field or JSON body
    admin_obj = None
    admin_id = request.POST.get('admin_id')
    if not admin_id:
        try:
            payload = json.loads(request.body.decode() or '{}')
            admin_id = payload.get('admin_id')
        except Exception:
            admin_id = None

    if admin_id:
        try:
            admin_obj = Admin.objects.get(user_id=admin_id)
        except Admin.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Admin not found or not authorized'}, status=403)
    else:
        # Fallback to session-based check
        if not is_admin(request):
            return JsonResponse({'success': False, 'error': 'Permission denied'}, status=403)
        try:
            admin_obj = Admin.objects.get(user=request.user)
        except Admin.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Admin profile not found'}, status=403)

    try:
        guide = get_object_or_404(Guide, user_id=guide_id)
        guide.approve(admin_obj)
        send_guide_approval_email(guide)

        return JsonResponse({
            'success': True,
            'message': f'Guide {guide.user.firstname} {guide.user.lastname} approved successfully'
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@csrf_exempt
def admin_reject_guide_ajax(request, guide_id):
    """
    AJAX endpoint to reject guide without page reload
    Returns JSON response
    """
    # Allow API clients to provide `admin_id` either as form field or JSON body
    admin_obj = None
    admin_id = request.POST.get('admin_id')
    if not admin_id:
        try:
            payload = json.loads(request.body.decode() or '{}')
            admin_id = payload.get('admin_id')
        except Exception:
            admin_id = None

    if admin_id:
        try:
            admin_obj = Admin.objects.get(user_id=admin_id)
        except Admin.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Admin not found or not authorized'}, status=403)
    else:
        if not is_admin(request):
            return JsonResponse({'success': False, 'error': 'Permission denied'}, status=403)
        try:
            admin_obj = Admin.objects.get(user=request.user)
        except Admin.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Admin profile not found'}, status=403)

    try:
        guide = get_object_or_404(Guide, user_id=guide_id)

        # Mark as rejected
        guide.reject(admin_obj)

        # Send rejection email
        email_sent = send_guide_rejection_email(guide)

        # Delete user account (cascade will remove guide profile)
        try:
            user = guide.user
            user_email = user.email
            user_name = f"{user.firstname} {user.lastname}"
            user.delete()
        except Exception as e:
            return JsonResponse({'success': False, 'error': f'Failed to delete user: {str(e)}'}, status=500)

        return JsonResponse({
            'success': True,
            'message': f'Guide {user_name} rejected and account deleted successfully',
            'deleted_user_email': user_email
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


csrf_exempt
@require_http_methods(["GET"])
def admin_users_api(request):
    """
    API endpoint to get all users with their statistics
    Supports filtering by user_type (tourist, guide)
    """
    admin_id = request.GET.get('admin_id')
    if not admin_id or not Admin.objects.filter(user_id=admin_id).exists():
        return JsonResponse({'success': False, 'error': 'Unauthorized'}, status=403)

    user_type = request.GET.get('user_type')
    search = request.GET.get('search', '')

    users_query = User.objects.exclude(user_type='admin')

    if user_type:
        users_query = users_query.filter(user_type=user_type)
    
    if search:
        users_query = users_query.filter(
            Q(email__icontains=search) |
            Q(firstname__icontains=search) |
            Q(lastname__icontains=search)
        )

    users_data = []
    for user in users_query.select_related('guide', 'tourist'):
        data = {
            'id': user.id,
            'name': f"{user.firstname} {user.lastname}",
            'email': user.email,
            'type': user.user_type,
            'photo_url': user.photo_url,
            'isActive': user.isActive,
        }

        if user.user_type == 'guide' and hasattr(user, 'guide'):
            data['stats'] = {
                'tours_count': user.guide.tours.count(),
                'reviews_count': user.guide.number_of_reviews,
                'rating': float(user.guide.average_rating),
            }
            data['reports_count'] = user.guide.reports.exclude(status='resolved').count()
        elif user.user_type == 'tourist' and hasattr(user, 'tourist'):
            completed_tours = user.tourist.reservations.filter(status='completed').count()
            data['stats'] = {
                'completed_tours': completed_tours
            }
            data['reports_count'] = None

        users_data.append(data)

    return JsonResponse({'success': True, 'users': users_data})


@csrf_exempt
@require_http_methods(["GET"])
def admin_pending_guides_api(request):
    """
    API endpoint to get all pending guide applications
    """
    admin_id = request.GET.get('admin_id')
    if not admin_id or not Admin.objects.filter(user_id=admin_id).exists():
        return JsonResponse({'success': False, 'error': 'Unauthorized'}, status=403)

    pending_guides = Guide.objects.filter(approval_status='pending').select_related('user')
    
    guides_data = []
    for guide in pending_guides:
        guides_data.append({
            'guide_id': guide.user_id,
            'name': f"{guide.user.firstname} {guide.user.lastname}",
            'email': guide.user.email,
            'phone': guide.phone,
            'languages': guide.offering_spoken_languages,
            'submitted_at': guide.submitted_at.isoformat(),
            'certifications': guide.certifications_files,
            'wilayas': list(guide.coverage_zones.values_list('wilaya__name', flat=True))
        })

    return JsonResponse({'success': True, 'pending_guides': guides_data})


@csrf_exempt
@require_http_methods(["GET"])
def admin_reports_api(request):
    """
    API endpoint to get all reports
    """
    admin_id = request.GET.get('admin_id')
    if not admin_id or not Admin.objects.filter(user_id=admin_id).exists():
        return JsonResponse({'success': False, 'error': 'Unauthorized'}, status=403)

    from .models import Report
    reports = Report.objects.all().select_related('tourist__user', 'guide__user', 'tour')
    
    reports_data = []
    for report in reports:
        reports_data.append({
            'id': report.id,
            'type': 'Tour' if report.tour else 'Guide',
            'reporter': {
                'name': f"{report.tourist.user.firstname} {report.tourist.user.lastname}" if report.tourist and report.tourist.user else "Anonymous",
                'email': report.tourist.user.email if report.tourist and report.tourist.user else ""
            },
            'reportedUser': {
                'name': f"{report.guide.user.firstname} {report.guide.user.lastname}",
                'email': report.guide.user.email
            },
            'tour': report.tour.title if report.tour else 'General',
            'description': report.description,
            'date': report.created_at.strftime('%Y-%m-%d'),
            'status': report.status
        })

    return JsonResponse({'success': True, 'reports': reports_data})


