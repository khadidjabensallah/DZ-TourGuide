from django.urls import path
from . import views
from . import guide_views
from . import tour_views
from . import reservations_views
from . import admin_views
from . import search_views

urlpatterns = [
    # ========================================
    # AUTHENTICATION URLS (views.py)
    # ========================================
    path('choose-role/', views.choose_role, name='choose_role'),
    path('signup/tourist/', views.tourist_signup, name='tourist_signup'),
    path('signup/guide/', views.guide_signup, name='guide_signup'),
    path('verify-email/', views.verify_email, name='verify_email'),
    path('resend-verification/', views.resend_verification_code, name='resend_verification_code'),
    path('signup-success/', views.signup_success, name='signup_success'),
    path('signin/', views.signin, name='signin'),
    path('logout/', views.logout, name='logout'),
    
    # ========================================
    # PASSWORD RESET URLS (views.py)
    # ========================================
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('verify-password-reset-code/', views.verify_password_reset_code, name='verify_password_reset_code'),
    path('reset-password/', views.reset_password, name='reset_password'),
    
    # ========================================
    # GUIDE PROFILE URLS (guide_views.py)
    # ========================================
    path('guide/<int:guide_id>/profile/', guide_views.guide_profile, name='guide_profile'),
    path('guide/<int:guide_id>/update-profile/', guide_views.guide_update_profile, name='guide_update_profile'),
    path('guide/<int:guide_id>/update-coverage-zones/', guide_views.guide_update_coverage_zones, name='guide_update_coverage_zones'),
    path('guide/<int:guide_id>/upload-photo/', guide_views.guide_upload_photo, name='guide_upload_photo'),
    path('guide/<int:guide_id>/dashboard/', guide_views.guide_dashboard, name='guide_dashboard'),
    path('guide/<int:guide_id>/tours/', guide_views.guide_my_tours, name='guide_my_tours'),
    
    # ========================================
    # TOUR MANAGEMENT URLS (tour_views.py)
    # ========================================
    path('guide/<int:guide_id>/tours/create/', tour_views.guide_create_tour, name='guide_create_tour'),
    path('guide/<int:guide_id>/tours/<int:tour_id>/update/', tour_views.guide_update_tour, name='guide_update_tour'),
    path('guide/<int:guide_id>/tours/<int:tour_id>/delete/', tour_views.guide_delete_tour, name='guide_delete_tour'),
    
    # ========================================
    # ADMIN URLS (admin_views.py)
    # ========================================
    path('admin/users/', admin_views.admin_users_list, name='admin_users_list'),
    path('admin/users/<int:user_id>/block/', admin_views.admin_block_user, name='admin_block_user'),
    path('admin/users/<int:user_id>/unblock/', admin_views.admin_unblock_user, name='admin_unblock_user'),
    
    # AJAX Endpoints (Optional - for dynamic UI without page reload)
    path('admin/api/guides/<int:guide_id>/approve/', admin_views.admin_approve_guide_ajax, name='admin_approve_guide_ajax'),
    path('admin/api/guides/<int:guide_id>/reject/', admin_views.admin_reject_guide_ajax, name='admin_reject_guide_ajax'),
    path('admin/api/users/<int:user_id>/toggle-status/', admin_views.admin_toggle_user_status_ajax, name='admin_toggle_user_status_ajax'),
    
    # ========================================
    # GUIDE RESERVATIONS & REVIEWS URLS (views.py)
    # ========================================
    path('guide/<int:guide_id>/reservations/', reservations_views.guide_my_reservations, name='guide_my_reservations'),
    path('guide/<int:guide_id>/reservations/<int:reservation_id>/update/', reservations_views.complete_reservation, name='guide_update_reservation'),
    path('guide/<int:guide_id>/reviews/', guide_views.guide_my_reviews, name='guide_my_reviews'),
    
    # ========================================
    # RESERVATION URLS (reservations_views.py)
    # ========================================
    path('reservations/create/', reservations_views.create_reservation, name='create_reservation'),
    path('tourist/<int:tourist_id>/reservations/', reservations_views.tourist_my_reservations, name='tourist_my_reservations'),
    path('reservations/<int:reservation_id>/cancel/', reservations_views.cancel_reservation, name='cancel_reservation'),
    
    # ========================================
    # WEATHER API URLS (views.py)
    # ========================================
    path('weather/<int:tour_id>/', views.get_weather, name='get_weather'),
    # Debug/test endpoint for SMTP issues
    path('test-email/', views.test_email, name='test_email'),
    # ========================================
    # SEARCH SUGGESTIONS URL (views.py)
    # ========================================

    path('search/', search_views.search_tours, name='search_tours'),
    path('search/suggestions/', search_views.get_search_suggestions, name='search_suggestions'),
    path('search/filters/', search_views.get_available_filters, name='search_filters'),
]
