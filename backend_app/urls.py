from django.urls import path
from . import views
from . import guide_views
from . import tour_views
from . import reservations_views
from . import admin_views
from . import search_views
from . import customrequest_views
from . import weather_views

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
    path('guide/<int:guide_id>/upload-certification/', guide_views.guide_upload_certification, name='guide_upload_certification'),
    path('guide/<int:guide_id>/delete-certification/', guide_views.guide_delete_certification, name='guide_delete_certification'),
    path('guide/<int:guide_id>/dashboard/', guide_views.guide_dashboard, name='guide_dashboard'),
    
    # ========================================
    # TOUR MANAGEMENT URLS (tour_views.py)
    # IMPORTANT: More specific routes must come BEFORE less specific ones
    # ========================================
    path('guide/<int:guide_id>/tours/create/', tour_views.guide_create_tour, name='guide_create_tour'),
    path('guide/<int:guide_id>/tours/<int:tour_id>/update/', tour_views.guide_update_tour, name='guide_update_tour'),
    path('guide/<int:guide_id>/tours/<int:tour_id>/delete/', tour_views.guide_delete_tour, name='guide_delete_tour'),
    path('guide/<int:guide_id>/tours/', guide_views.guide_my_tours, name='guide_my_tours'),
    
    
    # AJAX Endpoints (Optional - for dynamic UI without page reload)
    
    # ========================================
    # GUIDE RESERVATIONS & REVIEWS URLS (views.py)
    # ========================================
    path('guide/<int:guide_id>/reservations/', reservations_views.guide_my_reservations, name='guide_my_reservations'),
    path('guide/<int:guide_id>/reservations/<int:reservation_id>/update/', reservations_views.complete_reservation, name='guide_update_reservation'),
    path('guide/<int:guide_id>/reviews/', guide_views.guide_my_reviews, name='guide_my_reviews'),
    
    # Personalized Requests
    path('personalized-requests/create/', customrequest_views.create_personalized_request, name='create_personalized_request'),
    path('guide/<int:guide_id>/personalized-requests/', customrequest_views.get_personalized_requests, name='get_personalized_requests'),
    path('guide/personalized-requests/<int:request_id>/respond/', customrequest_views.respond_personalized_request, name='respond_personalized_request'),
    
    # ========================================
    # RESERVATION & FEEDBACK URLS (reservations_views.py & views.py)
    # ========================================
    path('reservations/create/', reservations_views.create_reservation, name='create_reservation'),
    path('tourist/<int:tourist_id>/reservations/', reservations_views.tourist_my_reservations, name='tourist_my_reservations'),
    path('reservations/<int:reservation_id>/cancel/', reservations_views.cancel_reservation, name='cancel_reservation'),
    
    # Feedback and Reporting (views.py)
    path('reviews/create/', views.create_review, name='create_review'),
    path('reports/create/', views.create_report, name='create_report'),
    
    # ========================================
    # WEATHER API URLS (weather_views.py)
    # ========================================
    path('weather/<int:tour_id>/', weather_views.tour_weather_forecast, name='get_weather'),
    
    # ========================================
    # SEARCH SUGGESTIONS URL (views.py)
    # ========================================
    # ========================================
    # PUBLIC TOUR URLS (tour_views.py)
    # ========================================
    path('tours/<int:tour_id>/', tour_views.get_tour_details, name='get_tour_details'),

    path('search/', search_views.search_tours, name='search_tours'),
    path('search/suggestions/', search_views.get_search_suggestions, name='search_suggestions'),
    path('search/filters/', search_views.get_available_filters, name='search_filters'),

    # ========================================
    # ADMIN URLS (admin_views.py)
    # ========================================
    path('admin/api/users/<int:user_id>/delete/', admin_views.admin_delete_user, name='admin_delete_user'),
    path('admin/api/guides/<int:guide_id>/approve/', admin_views.admin_approve_guide_ajax, name='admin_approve_guide_ajax'),
    path('admin/api/guides/<int:guide_id>/reject/', admin_views.admin_reject_guide_ajax, name='admin_reject_guide_ajax'),
    path('admin/api/users/', admin_views.admin_users_api, name='admin_users_api'),
    path('admin/api/pending-guides/', admin_views.admin_pending_guides_api, name='admin_pending_guides_api'),
    path('admin/api/reports/', admin_views.admin_reports_api, name='admin_reports_api'),
]
