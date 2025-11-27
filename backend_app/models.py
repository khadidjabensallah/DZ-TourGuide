from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from datetime import timedelta
import secrets

class User(models.Model):
    """
    Base User model with email verification support
    """
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True, max_length=100)
    password = models.CharField(max_length=255)
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    photo_url = models.CharField(max_length=500, blank=True, null=True)
    isActive = models.BooleanField(default=False)
    
    # Email verification fields
    email_verified = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, blank=True, null=True)
    verification_code_created = models.DateTimeField(blank=True, null=True)
    
    # User type identifier
    user_type = models.CharField(
        max_length=10,
        choices=[('tourist', 'Tourist'), ('guide', 'Guide'), ('admin', 'Admin')],
        default='tourist'
    )

    class Meta:
        db_table = 'User'

    def __str__(self):
        return f"{self.firstname} {self.lastname}"
    
    def set_password(self, raw_password):
        """Hash and set password"""
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        """Verify password"""
        return check_password(raw_password, self.password)
    
    def generate_verification_code(self):
        """Generate 6-digit verification code"""
        self.verification_code = ''.join([str(secrets.randbelow(10)) for _ in range(6)])
        self.verification_code_created = timezone.now()
        self.save()
        return self.verification_code
    
    def verify_code(self, code):
        """Verify the code and check if it's still valid (10 minutes)"""
        if not self.verification_code or not self.verification_code_created:
            return False
        
        # Check if code matches
        if self.verification_code != code:
            return False
        
        # Check if code is expired (10 minutes validity)
        time_difference = timezone.now() - self.verification_code_created
        if time_difference > timedelta(minutes=10):
            return False
        
        # Mark as verified
        self.email_verified = True
        self.isActive = True
        self.verification_code = None
        self.verification_code_created = None
        self.save()
        return True


class Admin(models.Model):
    """Admin profile linked to User"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    
    class Meta:
        db_table = 'admin'

    def __str__(self):
        return f"Admin: {self.user.firstname} {self.user.lastname}"


class Tourist(models.Model):
    """Tourist profile linked to User"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    nationality = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'tourist'

    def __str__(self):
        return f"Tourist: {self.user.firstname} {self.user.lastname}"


class Guide(models.Model):
    """Guide profile linked to User"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    biography = models.TextField(blank=True, null=True)
    offering_spoken_languages = ArrayField(
        models.CharField(max_length=50),
        default=list
    )
    phone = models.CharField(max_length=13)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    number_of_reviews = models.IntegerField(default=0)
    
    # APPROVAL STATUS
    is_verified = models.BooleanField(default=False)
    approval_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending Review'),
            ('approved', 'Approved'),
            ('rejected', 'Rejected'),
        ],
        default='pending'
    )
    reviewed_by = models.ForeignKey(
        'Admin',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_guides'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    full_day_price = models.DecimalField(max_digits=10, decimal_places=2)
    half_day_price = models.DecimalField(max_digits=10, decimal_places=2)
    additional_hour_price = models.DecimalField(max_digits=10, decimal_places=2)
    certifications_files = ArrayField(
        models.CharField(max_length=500),
        blank=True,
        default=list
    )
    custom_request_markup = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        db_table = 'guide'

    def __str__(self):
        return f"Guide: {self.user.firstname} {self.user.lastname} [{self.approval_status}]"
    
    def get_phone_display(self):
        """Returns phone in display format: +213 555 123 456"""
        if self.phone and self.phone.startswith('+213'):
            digits = self.phone[4:]
            return f"+213 {digits[0:3]} {digits[3:6]} {digits[6:9]}"
        return self.phone
    
    def get_phone_digits(self):
        """Returns only the 9 digits without +213"""
        if self.phone and self.phone.startswith('+213'):
            return self.phone[4:]
        return self.phone
    
    def can_accept_bookings(self):
        """Check if guide can accept bookings"""
        return (
            self.user.isActive and 
            self.user.email_verified and 
            self.approval_status == 'approved' and 
            self.is_verified
        )
    
    def approve(self, admin_user):
        """Approve guide application"""
        self.approval_status = 'approved'
        self.is_verified = True
        self.reviewed_by = admin_user
        self.reviewed_at = timezone.now()
        self.save()
    
    def reject(self, admin_user):
        """Reject guide application"""
        self.approval_status = 'rejected'
        self.is_verified = False
        self.reviewed_by = admin_user
        self.reviewed_at = timezone.now()
        self.save()


class Wilaya(models.Model):
    code = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=100)
    region = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'wilayas'

    def __str__(self):
        return f"{self.code} - {self.name}"


class CoverageZone(models.Model):
    guide = models.ForeignKey(
        Guide,
        on_delete=models.CASCADE,
        related_name='coverage_zones'
    )
    wilaya = models.ForeignKey(
        Wilaya,
        on_delete=models.CASCADE,
        related_name='coverage_zones'
    )
    displayed = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'coveragezone'
        unique_together = ('guide', 'wilaya')

    def __str__(self):
        return f"{self.guide.user.firstname} covers {self.wilaya.name}"