from django.urls import path
from backend_app import views
from backend_app import admin_views
urlpatterns = [

    path('signup/', views.choose_role, name='choose_role'),
    path('signup/tourist/', views.tourist_signup, name='tourist_signup'),
    path('signup/guide/', views.guide_signup, name='guide_signup'),
    path('signup/verify/', views.verify_email, name='verify_email'),  # ← ADD THIS - POST only
    path('signup/resend-code/', views.resend_verification_code, name='resend_verification_code'),  # POST
 
    path('signup/success/', views.signup_success, name='signup_success'),
    
    # Authentication
    path('signin/', views.signin, name='signin'),
    path('logout/', views.logout, name='logout'),
    
    # Password Reset
    path('password/forgot/', views.forgot_password, name='forgot_password'),  # POST - Step 1: Request reset
    path('password/verify-code/', views.verify_password_reset_code, name='verify_password_reset_code'),  # POST - Step 2: Verify code
    path('password/reset/', views.reset_password, name='reset_password'),  # POST - Step 3: Reset password
    
    # Admin Routes
    path('admin/dashboard/', admin_views.admin_dashboard, name='admin_dashboard'),
    
    # Guide Management
    path('admin/guides/pending/', admin_views.admin_pending_guides, name='admin_pending_guides'),
    path('admin/guides/<int:guide_id>/', admin_views.admin_guide_details, name='admin_guide_details'),
    path('admin/guides/<int:guide_id>/approve/', admin_views.admin_approve_guide, name='admin_approve_guide'),
    path('admin/guides/<int:guide_id>/reject/', admin_views.admin_reject_guide, name='admin_reject_guide'),
    
    # User Management
    path('admin/users/', admin_views.admin_users_list, name='admin_users_list'),
    path('admin/users/<int:user_id>/block/', admin_views.admin_block_user, name='admin_block_user'),
    path('admin/users/<int:user_id>/unblock/', admin_views.admin_unblock_user, name='admin_unblock_user'),
    
    # AJAX Endpoints (Optional - for dynamic UI without page reload)
    path('admin/api/guides/<int:guide_id>/approve/', admin_views.admin_approve_guide_ajax, name='admin_approve_guide_ajax'),
    path('admin/api/guides/<int:guide_id>/reject/', admin_views.admin_reject_guide_ajax, name='admin_reject_guide_ajax'),
    path('admin/api/users/<int:user_id>/toggle-status/', admin_views.admin_toggle_user_status_ajax, name='admin_toggle_user_status_ajax'),
    
    # Guide - Tours
    path('guide/<int:guide_id>/tours/create/', views.guide_create_tour, name='guide_create_tour'),
    path('guide/<int:guide_id>/tours/', views.guide_my_tours, name='guide_my_tours'),
    path('guide/<int:guide_id>/tours/<int:tour_id>/update/', views.guide_update_tour, name='guide_update_tour'),
    path('guide/<int:guide_id>/tours/<int:tour_id>/delete/', views.guide_delete_tour, name='guide_delete_tour'),
    
    # Guide - Reservations
    path('guide/<int:guide_id>/reservations/', views.guide_my_reservations, name='guide_my_reservations'),
    path('guide/<int:guide_id>/reservations/<int:reservation_id>/update/', views.guide_update_reservation_status, name='guide_update_reservation'),
    
    # Guide - Reviews & Dashboard
    path('guide/<int:guide_id>/reviews/', views.guide_my_reviews, name='guide_my_reviews'),
    path('guide/<int:guide_id>/dashboard/', views.guide_dashboard, name='guide_dashboard'),
]






    