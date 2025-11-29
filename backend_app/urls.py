from django.urls import path
from backend_app import views

urlpatterns = [

    path('signup/', views.choose_role, name='choose_role'),
    path('signup/tourist/', views.tourist_signup, name='tourist_signup'),
    path('signup/guide/', views.guide_signup, name='guide_signup'),
    path('signup/success/', views.signup_success, name='signup_success'),
    path('signup/verify/', views.verify_email, name='verify_email'),  # ← ADD THIS - POST only
    path('signup/resend-code/', views.resend_verification_code, name='resend_verification_code'),  # POST
     path('signin/', views.signin, name='signin'),
    path('logout/', views.logout, name='logout'),
    
    # Password Reset
    path('password/forgot/', views.forgot_password, name='forgot_password'),  # POST - Step 1: Request reset
    path('password/verify-code/', views.verify_password_reset_code, name='verify_password_reset_code'),  # POST - Step 2: Verify code
    path('password/reset/', views.reset_password, name='reset_password'),  # POST - Step 3: Reset password
]

