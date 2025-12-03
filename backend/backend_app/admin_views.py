# admin_views.py
# Admin functions for managing users and guides

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

from .models import User, Guide, Tourist, Admin


# ============================================
# HELPER FUNCTION - Check if user is admin
# ============================================

def is_admin(user):
    """
    Check if the logged-in user is an admin
    """
    if not user.is_authenticated:
        return False
    
    try:
        # Check if user exists and is admin type
        if user.user_type == 'admin':
            # Check if admin profile exists
            return Admin.objects.filter(user=user).exists()
        return False
    except Exception:
        return False


# ============================================
# EMAIL NOTIFICATION FUNCTIONS
# ============================================

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


def send_user_blocked_email(user):
    """
    Send notification email when user account is blocked
    Returns True if successful, False otherwise
    """
    try:
        subject = 'Your Account Has Been Suspended'
        message = f"""
Hello {user.firstname},

Your account on our platform has been suspended by our admin team.

Account Details:
- Email: {user.email}
- Account Type: {user.user_type.title()}

If you believe this is a mistake or would like to appeal this decision, please contact our support team at {settings.DEFAULT_FROM_EMAIL}.

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
        print(f"Error sending block notification email: {e}")
        return False


def send_user_unblocked_email(user):
    """
    Send notification email when user account is unblocked
    Returns True if successful, False otherwise
    """
    try:
        subject = 'Your Account Has Been Reactivated'
        message = f"""
Hello {user.firstname},

Good news! Your account on our platform has been reactivated.

You can now log in and use all features again:
{settings.SITE_URL}/login

Account Details:
- Email: {user.email}
- Account Type: {user.user_type.title()}

If you have any questions, please contact our support team at {settings.DEFAULT_FROM_EMAIL}.

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
        print(f"Error sending unblock notification email: {e}")
        return False


# ============================================
# ADMIN VIEW - Dashboard
# ============================================

@login_required
def admin_dashboard(request):
    """
    Admin dashboard showing overview statistics
    """
    # Check if user is admin
    if not is_admin(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('home')
    
    # Get statistics
    total_users = User.objects.count()
    active_users = User.objects.filter(isActive=True).count()
    blocked_users = User.objects.filter(isActive=False, email_verified=True).count()
    
    total_tourists = Tourist.objects.count()
    total_guides = Guide.objects.count()
    
    pending_guides = Guide.objects.filter(approval_status='pending').count()
    approved_guides = Guide.objects.filter(approval_status='approved').count()
    rejected_guides = Guide.objects.filter(approval_status='rejected').count()
    
    context = {
        'total_users': total_users,
        'active_users': active_users,
        'blocked_users': blocked_users,
        'total_tourists': total_tourists,
        'total_guides': total_guides,
        'pending_guides': pending_guides,
        'approved_guides': approved_guides,
        'rejected_guides': rejected_guides,
    }
    
    return render(request, 'admin/dashboard.html', context)


# ============================================
# ADMIN VIEW - Pending Guides List
# ============================================

@login_required
def admin_pending_guides(request):
    """
    Show all pending guide applications for admin review
    """
    # Check if user is admin
    if not is_admin(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('home')
    
    # Get all pending guides
    pending_guides = Guide.objects.filter(
        approval_status='pending'
    ).select_related('user').prefetch_related('coverage_zones__wilaya').order_by('-submitted_at')
    
    context = {
        'pending_guides': pending_guides,
    }
    
    return render(request, 'admin/pending_guides.html', context)


# ============================================
# ADMIN FUNCTION - Approve Guide
# ============================================

@login_required
@csrf_exempt
def admin_approve_guide(request, guide_id):
    """
    Admin approves a guide application
    - Changes approval_status to 'approved'
    - Sets is_verified to True
    - Records which admin approved and when
    - Sends approval email to guide
    
    Args:
        guide_id: The user_id of the guide to approve
    """
    # Check if user is admin
    if not is_admin(request.user):
        messages.error(request, 'You do not have permission to perform this action.')
        return redirect('home')
    
    # Get the guide
    guide = get_object_or_404(Guide, user_id=guide_id)
    
    # Check if guide is already approved
    if guide.approval_status == 'approved':
        messages.warning(request, f'Guide {guide.user.firstname} {guide.user.lastname} is already approved.')
        return redirect('admin_pending_guides')
    
    # Get admin instance
    try:
        admin = Admin.objects.get(user=request.user)
    except Admin.DoesNotExist:
        messages.error(request, 'Admin profile not found.')
        return redirect('admin_dashboard')
    
    # Approve the guide using the model method
    guide.approve(admin)
    
    # Send approval email
    email_sent = send_guide_approval_email(guide)
    
    # Success message
    if email_sent:
        messages.success(
            request,
            f'✅ Guide {guide.user.firstname} {guide.user.lastname} has been approved and notified via email.'
        )
    else:
        messages.success(
            request,
            f'✅ Guide {guide.user.firstname} {guide.user.lastname} has been approved, but failed to send email notification.'
        )
    
    # Redirect back to pending guides or wherever appropriate
    return redirect('admin_pending_guides')


# ============================================
# ADMIN FUNCTION - Reject Guide
# ============================================

@login_required
@csrf_exempt
def admin_reject_guide(request, guide_id):
    """
    Admin rejects a guide application
    - Changes approval_status to 'rejected'
    - Sets is_verified to False
    - Records which admin rejected and when
    - Sends rejection email to guide
    
    Args:
        guide_id: The user_id of the guide to reject
    """
    # Check if user is admin
    if not is_admin(request.user):
        messages.error(request, 'You do not have permission to perform this action.')
        return redirect('home')
    
    # Get the guide
    guide = get_object_or_404(Guide, user_id=guide_id)
    
    # Check if guide is already rejected
    if guide.approval_status == 'rejected':
        messages.warning(request, f'Guide {guide.user.firstname} {guide.user.lastname} is already rejected.')
        return redirect('admin_pending_guides')
    
    # Get admin instance
    try:
        admin = Admin.objects.get(user=request.user)
    except Admin.DoesNotExist:
        messages.error(request, 'Admin profile not found.')
        return redirect('admin_dashboard')
    
    # Reject the guide using the model method
    guide.reject(admin)
    
    # Send rejection email
    email_sent = send_guide_rejection_email(guide)
    
    # Success message
    if email_sent:
        messages.success(
            request,
            f'❌ Guide {guide.user.firstname} {guide.user.lastname} has been rejected and notified via email.'
        )
    else:
        messages.success(
            request,
            f'❌ Guide {guide.user.firstname} {guide.user.lastname} has been rejected, but failed to send email notification.'
        )
    
    # Redirect back to pending guides
    return redirect('admin_pending_guides')


# ============================================
# ADMIN VIEW - All Users List
# ============================================

@login_required
def admin_users_list(request):
    """
    Show all users (tourists and guides) for admin management
    Admin can block/unblock users from here
    """
    # Check if user is admin
    if not is_admin(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('home')
    
    # Get search query if exists
    search_query = request.GET.get('search', '')
    
    # Get all users excluding admins
    users = User.objects.exclude(user_type='admin').select_related('tourist', 'guide')
    
    # Apply search filter if provided
    if search_query:
        users = users.filter(
            Q(email__icontains=search_query) |
            Q(firstname__icontains=search_query) |
            Q(lastname__icontains=search_query)
        )
    
    # Order by most recent
    users = users.order_by('-id')
    
    context = {
        'users': users,
        'search_query': search_query,
    }
    
    return render(request, 'admin/users_list.html', context)


# ============================================
# ADMIN FUNCTION - Block User
# ============================================

@login_required
@csrf_exempt
def admin_block_user(request, user_id):
    """
    Admin blocks a user account
    - Sets isActive to False
    - User cannot log in
    - Sends notification email to user
    
    Args:
        user_id: The ID of the user to block
    """
    # Check if user is admin
    if not is_admin(request.user):
        messages.error(request, 'You do not have permission to perform this action.')
        return redirect('home')
    
    # Get the user to block
    user = get_object_or_404(User, id=user_id)
    
    # Prevent admin from blocking themselves
    if user.id == request.user.id:
        messages.error(request, 'You cannot block your own account.')
        return redirect('admin_users_list')
    
    # Prevent blocking other admins
    if user.user_type == 'admin':
        messages.error(request, 'You cannot block other admin accounts.')
        return redirect('admin_users_list')
    
    # Check if user is already blocked
    if not user.isActive:
        messages.warning(request, f'User {user.firstname} {user.lastname} is already blocked.')
        return redirect('admin_users_list')
    
    # Block the user
    user.isActive = False
    user.save()
    
    # If user is a guide, also update their verification status
    if user.user_type == 'guide':
        try:
            guide = Guide.objects.get(user=user)
            guide.is_verified = False
            guide.save()
        except Guide.DoesNotExist:
            pass
    
    # Send notification email
    email_sent = send_user_blocked_email(user)
    
    # Success message
    if email_sent:
        messages.success(
            request,
            f'🚫 User {user.firstname} {user.lastname} ({user.email}) has been blocked and notified via email.'
        )
    else:
        messages.success(
            request,
            f'🚫 User {user.firstname} {user.lastname} ({user.email}) has been blocked, but failed to send email notification.'
        )
    
    # Redirect back to users list
    return redirect('admin_users_list')


# ============================================
# ADMIN FUNCTION - Unblock User
# ============================================

@login_required
@csrf_exempt
def admin_unblock_user(request, user_id):
    """
    Admin unblocks a user account
    - Sets isActive to True
    - User can log in again
    - Sends notification email to user
    
    Args:
        user_id: The ID of the user to unblock
    """
    # Check if user is admin
    if not is_admin(request.user):
        messages.error(request, 'You do not have permission to perform this action.')
        return redirect('home')
    
    # Get the user to unblock
    user = get_object_or_404(User, id=user_id)
    
    # Check if user is already active
    if user.isActive:
        messages.warning(request, f'User {user.firstname} {user.lastname} is already active.')
        return redirect('admin_users_list')
    
    # Check if email is verified
    if not user.email_verified:
        messages.error(
            request,
            f'Cannot unblock {user.firstname} {user.lastname} - email not verified.'
        )
        return redirect('admin_users_list')
    
    # Unblock the user
    user.isActive = True
    user.save()
    
    # If user is an approved guide, restore their verification status
    if user.user_type == 'guide':
        try:
            guide = Guide.objects.get(user=user)
            if guide.approval_status == 'approved':
                guide.is_verified = True
                guide.save()
        except Guide.DoesNotExist:
            pass
    
    # Send notification email
    email_sent = send_user_unblocked_email(user)
    
    # Success message
    if email_sent:
        messages.success(
            request,
            f'✅ User {user.firstname} {user.lastname} ({user.email}) has been unblocked and notified via email.'
        )
    else:
        messages.success(
            request,
            f'✅ User {user.firstname} {user.lastname} ({user.email}) has been unblocked, but failed to send email notification.'
        )
    
    # Redirect back to users list
    return redirect('admin_users_list')


# ============================================
# ADMIN VIEW - Guide Details
# ============================================

@login_required
def admin_guide_details(request, guide_id):
    """
    Show detailed information about a specific guide
    Including certifications, coverage zones, etc.
    """
    # Check if user is admin
    if not is_admin(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('home')
    
    # Get the guide with related data
    guide = get_object_or_404(
        Guide.objects.select_related('user', 'reviewed_by__user')
                     .prefetch_related('coverage_zones__wilaya'),
        user_id=guide_id
    )
    
    context = {
        'guide': guide,
    }
    
    return render(request, 'admin/guide_details.html', context)


# ============================================
# AJAX ENDPOINTS (Optional - for dynamic UI)
# ============================================

@login_required
@csrf_exempt
def admin_approve_guide_ajax(request, guide_id):
    """
    AJAX endpoint to approve guide without page reload
    Returns JSON response
    """
    if not is_admin(request.user):
        return JsonResponse({'success': False, 'error': 'Permission denied'}, status=403)
    
    try:
        guide = get_object_or_404(Guide, user_id=guide_id)
        admin = Admin.objects.get(user=request.user)
        
        guide.approve(admin)
        send_guide_approval_email(guide)
        
        return JsonResponse({
            'success': True,
            'message': f'Guide {guide.user.firstname} {guide.user.lastname} approved successfully'
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@login_required
@csrf_exempt
def admin_reject_guide_ajax(request, guide_id):
    """
    AJAX endpoint to reject guide without page reload
    Returns JSON response
    """
    if not is_admin(request.user):
        return JsonResponse({'success': False, 'error': 'Permission denied'}, status=403)
    
    try:
        guide = get_object_or_404(Guide, user_id=guide_id)
        admin = Admin.objects.get(user=request.user)
        
        guide.reject(admin)
        send_guide_rejection_email(guide)
        
        return JsonResponse({
            'success': True,
            'message': f'Guide {guide.user.firstname} {guide.user.lastname} rejected successfully'
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@login_required
@csrf_exempt
def admin_toggle_user_status_ajax(request, user_id):
    """
    AJAX endpoint to toggle user active status (block/unblock)
    Returns JSON response
    """
    if not is_admin(request.user):
        return JsonResponse({'success': False, 'error': 'Permission denied'}, status=403)
    
    try:
        user = get_object_or_404(User, id=user_id)
        
        # Prevent self-block
        if user.id == request.user.id:
            return JsonResponse({'success': False, 'error': 'Cannot block yourself'}, status=400)
        
        # Prevent admin block
        if user.user_type == 'admin':
            return JsonResponse({'success': False, 'error': 'Cannot block admins'}, status=400)
        
        # Toggle status
        if user.isActive:
            user.isActive = False
            send_user_blocked_email(user)
            action = 'blocked'
        else:
            if not user.email_verified:
                return JsonResponse({'success': False, 'error': 'Email not verified'}, status=400)
            user.isActive = True
            send_user_unblocked_email(user)
            action = 'unblocked'
        
        user.save()
        
        return JsonResponse({
            'success': True,
            'action': action,
            'message': f'User {user.firstname} {user.lastname} {action} successfully',
            'isActive': user.isActive
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)