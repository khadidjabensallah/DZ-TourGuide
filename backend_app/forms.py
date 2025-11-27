from django import forms
from .models import Tourist, Guide, Wilaya, User
import re

class MultipleFileInput(forms.FileInput):
    def __init__(self, attrs=None):
        super().__init__(attrs)
        if attrs is not None:
            self.attrs = attrs.copy()
        else:
            self.attrs = {}
        self.attrs['multiple'] = True


class PasswordValidationMixin:
    """
    Mixin to validate password strength:
    - At least 8 characters
    - Contains letters (a-z or A-Z)
    - Contains numbers (0-9)
    """
    def clean_password(self):
        password = self.cleaned_data.get('password')
        
        if not password:
            raise forms.ValidationError('Password is required')
        
        # Check minimum length (8 characters)
        if len(password) < 8:
            raise forms.ValidationError(
                'Password must be at least 8 characters long'
            )
        
        # Check for at least one letter
        if not re.search(r'[a-zA-Z]', password):
            raise forms.ValidationError(
                'Password must contain at least one letter (a-z or A-Z)'
            )
        
        # Check for at least one number
        if not re.search(r'\d', password):
            raise forms.ValidationError(
                'Password must contain at least one number (0-9)'
            )
        
        return password
    
    def clean_confirm_password(self):
        password = self.cleaned_data.get('password')
        confirm_password = self.cleaned_data.get('confirm_password')
        
        if password and confirm_password:
            if password != confirm_password:
                raise forms.ValidationError('Passwords do not match')
        
        return confirm_password


class TouristSignupForm(PasswordValidationMixin, forms.Form):
    """
    Enhanced Tourist signup form with email and password validation
    """
    email = forms.EmailField(
        max_length=100,
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your email'
        }),
        label='Email Address'
    )
    
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Min 8 characters, letters & numbers'
        }),
        label='Password',
        help_text='Must be at least 8 characters with letters and numbers'
    )
    
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Re-enter password'
        }),
        label='Confirm Password'
    )
    
    firstname = forms.CharField(
        max_length=50,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'First name'
        })
    )
    
    lastname = forms.CharField(
        max_length=50,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Last name'
        })
    )
    
    nationality = forms.CharField(
        max_length=50,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Your nationality (optional)'
        })
    )
    
   
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError(
                'This email is already registered. Please use a different email.'
            )
        
        return email


class GuideSignupForm(PasswordValidationMixin, forms.Form):
    """
    Enhanced Guide signup form with email and password validation
    """
    # Basic Information
    email = forms.EmailField(
        max_length=100,
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your email'
        }),
        label='Email Address'
    )
    
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Min 8 characters, letters & numbers'
        }),
        label='Password',
        help_text='Must be at least 8 characters with letters and numbers'
    )
    
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Re-enter password'
        }),
        label='Confirm Password'
    )
    
    firstname = forms.CharField(
        max_length=50,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'First name'
        })
    )
    
    lastname = forms.CharField(
        max_length=50,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Last name'
        })
    )
    
    phone = forms.CharField(
        max_length=9,
        min_length=9,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': '555123456',
            'pattern': '[5-7]\d{8}',
            'maxlength': '9',
            'style': 'display: inline-block; width: calc(100% - 60px); margin-left: 5px;'
        }),
        help_text='Enter 9 digits starting with 5, 6, or 7',
        label='Phone Number'
    )
    
    biography = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 4,
            'placeholder': 'Tell tourists about yourself...'
        })
    )
    
    # Languages
    languages = forms.MultipleChoiceField(
        choices=[('Arabic', 'Arabic'), ('French', 'French'), ('English', 'English')],
        widget=forms.CheckboxSelectMultiple,
        label="Spoken Languages"
    )
    
    # Pricing
    full_day_price = forms.DecimalField(
        max_digits=10,
        decimal_places=2,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': '0.00'
        })
    )
    
    half_day_price = forms.DecimalField(
        max_digits=10,
        decimal_places=2,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': '0.00'
        })
    )
    
    additional_hour_price = forms.DecimalField(
        max_digits=10,
        decimal_places=2,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': '0.00'
        })
    )
    
    custom_request_markup = forms.DecimalField(
        max_digits=5,
        decimal_places=2,
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': '0.00'
        })
    )
    
    # Certifications
    certification_files = forms.FileField(
        widget=MultipleFileInput(attrs={
            'class': 'form-control',
            'accept': '.pdf,.jpg,.jpeg,.png'
        }),
        required=False,
        help_text='Upload your certifications (PDF, JPG, PNG)'
    )
    
    # Coverage Areas
    coverage_wilayas = forms.ModelMultipleChoiceField(
        queryset=Wilaya.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        label="Coverage Wilayas"
    )
    
    # ADDED: Phone validation method
    def clean_phone(self):
        """Validate Algerian phone number format and add +213 prefix"""
        phone = self.cleaned_data.get('phone')
        
        if not phone:
            raise forms.ValidationError('Phone number is required')
        
        # Remove any spaces or dashes
        phone = phone.replace(' ', '').replace('-', '')
        
        # Check if it has exactly 9 digits
        if len(phone) != 9:
            raise forms.ValidationError(
                'Phone number must have exactly 9 digits'
            )
        
        # Check if all characters are digits
        if not phone.isdigit():
            raise forms.ValidationError(
                'Phone number must contain only digits'
            )
        
        # Check if it starts with valid Algerian mobile prefixes (5, 6, or 7)
        first_digit = phone[0]
        if first_digit not in ['5', '6', '7']:
            raise forms.ValidationError(
                'Algerian mobile numbers must start with 5, 6, or 7'
            )
        
        # Add +213 prefix
        return f"+213{phone}"
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError(
                'This email is already registered. Please use a different email.'
            )
        
        return email


class VerificationForm(forms.Form):
    """
    Form for email verification code
    """
    verification_code = forms.CharField(
        max_length=6,
        min_length=6,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': '000000',
            'maxlength': '6',
            'pattern': '[0-9]{6}'
        }),
        label='Verification Code',
        help_text='Enter the 6-digit code sent to your email'
    )
    
    def clean_verification_code(self):
        code = self.cleaned_data.get('verification_code')
        
        # Ensure it's exactly 6 digits
        if not code.isdigit():
            raise forms.ValidationError('Code must contain only numbers')
        
        if len(code) != 6:
            raise forms.ValidationError('Code must be exactly 6 digits')
        
        return code