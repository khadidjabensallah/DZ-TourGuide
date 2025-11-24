from django.urls import path
from backend_app import views

urlpatterns = [

    path('signup/', views.choose_role, name='choose_role'),
    path('signup/tourist/', views.tourist_signup, name='tourist_signup'),
    path('signup/guide/', views.guide_signup, name='guide_signup'),
    path('signup/success/', views.signup_success, name='signup_success'),
]

