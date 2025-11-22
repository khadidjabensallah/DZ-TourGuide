

from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
import uuid

from .forms import TouristSignupForm, GuideSignupForm
from .models import Tourist, Guide, CoverageZone
from django.views.decorators.csrf import csrf_exempt

from django.http import JsonResponse


def choose_role(request):

    return render(request, 'signup/choose_role.html')

@csrf_exempt
def tourist_signup(request):

    if request.method == 'POST':
        form = TouristSignupForm(request.POST)
        if form.is_valid():



            tourist = Tourist.objects.create(
                email=form.cleaned_data['email'],
                password=form.cleaned_data['password'],
                firstname=form.cleaned_data['firstname'],
                lastname=form.cleaned_data['lastname'],
                nationality=form.cleaned_data['nationality'],

            )
            messages.success(request, 'Tourist account created successfully!')
            return redirect('signup_success')
    else:
        form = TouristSignupForm()
    
    return render(request, 'signup/tourist_signup.html', {'form': form})

@csrf_exempt
def guide_signup(request):
    
    if request.method == 'POST':
        form = GuideSignupForm(request.POST, request.FILES)
        if form.is_valid():

            # Create guide first (without certification files)
            guide = Guide.objects.create(
                email=form.cleaned_data['email'],
                password=form.cleaned_data['password'],
                firstname=form.cleaned_data['firstname'],
                lastname=form.cleaned_data['lastname'],
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

            # Handle file uploads after guide is created
            certification_paths = []
            uploaded_files = request.FILES.getlist('certification_files')
            if uploaded_files:
                cert_dir = os.path.join(settings.MEDIA_ROOT, 'certifications')
                os.makedirs(cert_dir, exist_ok=True)
                fs = FileSystemStorage(location=cert_dir)
                for file in uploaded_files:
                    filename = f"{guide.id}_{uuid.uuid4().hex[:6]}_{file.name}"
                    saved_name = fs.save(filename, file)
                    file_path = f"/media/certifications/{saved_name}"
                    certification_paths.append(file_path)
                
                # Update guide with certification file paths
                guide.certifications_files = certification_paths
                guide.save()


            for wilaya in form.cleaned_data['coverage_wilayas']:
                CoverageZone.objects.create(
                    guide=guide,
                    wilaya=wilaya,
                    displayed=f"{wilaya.name} Region"
                )

            messages.success(request, 'Guide account created! Awaiting admin approval.')
            return redirect('signup_success')
    else:
        form = GuideSignupForm()
    
    return render(request, 'signup/guide_signup.html', {'form': form})


def signup_success(request):
    
    return render(request, 'signup/signup_success.html')



