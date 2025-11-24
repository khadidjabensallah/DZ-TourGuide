# forms.py
from django import forms
from .models import Tourist, Guide, Wilaya


class MultipleFileInput(forms.FileInput):
    def __init__(self, attrs=None):
        super().__init__(attrs)
        if attrs is not None:
            self.attrs = attrs.copy()
        else:
            self.attrs = {}
        self.attrs['multiple'] = True

class TouristSignupForm(forms.ModelForm):
    class Meta:
        model = Tourist
        fields = ['email', 'password', 'firstname', 'lastname', 'nationality']
        widgets = {
            'password': forms.PasswordInput(),
        }

class GuideSignupForm(forms.ModelForm):
    languages = forms.MultipleChoiceField(
        choices=[('Arabic', 'Arabic'), ('French', 'French'), ('English', 'English')],
        widget=forms.CheckboxSelectMultiple,
        label="Spoken Languages"
    )
    certification_files = forms.FileField(
        widget=MultipleFileInput(),
        required=False
    )
    coverage_wilayas = forms.ModelMultipleChoiceField(
        queryset=Wilaya.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        label="Coverage Wilayas"
    )

    class Meta:
        model = Guide
        fields = [
            'email', 'password', 'firstname', 'lastname', 'phone', 'biography',
            'full_day_price', 'half_day_price', 'additional_hour_price', 'custom_request_markup'
        ]
        widgets = {
            'password': forms.PasswordInput(),
        }
