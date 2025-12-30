from django.db import models

from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
import secrets
from django.db.models import Avg
from django.core.validators import MinValueValidator, MaxValueValidator

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
    
    def verify_password_reset_code(self, code):
        """Verify password reset code without changing email verification status"""
        if not self.verification_code or not self.verification_code_created:
            return False
        
        # Check if code matches
        if self.verification_code != code:
            return False
        
        # Check if code is expired (10 minutes validity)
        time_difference = timezone.now() - self.verification_code_created
        if time_difference > timedelta(minutes=10):
            return False
        
        # Clear verification code (but don't change email_verified or isActive)
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
    
    # FIXED: Changed from ArrayField to JSONField for SQLite compatibility
    offering_spoken_languages = models.JSONField(default=list)
    
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
    
    # FIXED: Changed from ArrayField to JSONField for SQLite compatibility
    certifications_files = models.JSONField(default=list, blank=True)
    
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
    
    def update_rating(self):
        """
        Update guide rating from the average of all individual review ratings across all tours.
        Guide rating = average of all review ratings from all tours.
        """
        # Get all tours for this guide
        tours = self.tours.all()
        
        # Collect all individual review ratings from all tours
        all_ratings = []
        for tour in tours:
            for review in tour.reviews.all():
                all_ratings.append(review.rating)
        
        self.number_of_reviews = len(all_ratings)
        
        # Calculate average rating from all individual review ratings
        if self.number_of_reviews > 0:
            self.average_rating = sum(all_ratings) / self.number_of_reviews
        else:
            self.average_rating = 0
        
        self.save(update_fields=['average_rating', 'number_of_reviews'])


class Wilaya(models.Model):
    code = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=100)
    region = models.CharField(max_length=50, blank=True, null=True)
    
    # Coordinates for weather and location mapping
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

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

class Tour(models.Model):
    """
    Tour model - Guides create predefined tour offerings
    """
    # Basic Information
    id = models.AutoField(primary_key=True)
    guide = models.ForeignKey(
        'Guide',
        on_delete=models.CASCADE,
        related_name='tours'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateField(help_text="Scheduled date of the tour")
    # Itinerary
    itinerary = models.TextField(
        help_text="Suggested itinerary and route"
    )
    
    # FIXED: Changed from ArrayField to TextField for SQLite compatibility
    # Store as newline-separated text instead of array
    highlights = models.TextField(
        help_text="Key attractions (one per line)"
    )
    whats_included = models.TextField(help_text="What's included (one per line)")
    whats_excluded = models.TextField()
    
    # Duration (in hours)
    estimated_duration = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        help_text="Duration in hours (e.g., 3.5)"
    )
    scheduled_time = models.TimeField(null=True, blank=True, help_text="Scheduled time of the tour")
    # Auto-calculated price from guide's pricing grid
    calculated_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        editable=False
    )
    
    # Location (must be in guide's coverage zones)
    wilaya = models.ForeignKey(
        'Wilaya',
        on_delete=models.PROTECT,
        related_name='tours'
    )
    starting_point = models.CharField(max_length=200)
    
    # GPS for weather API - Optional, defaults to Wilaya coordinates
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # AVAILABLE PLACES
    max_places = models.IntegerField(
        validators=[MinValueValidator(1)],
        default=10,
        help_text="Maximum number of places for this tour (set by guide)"
    )
    available_places = models.IntegerField(
        validators=[MinValueValidator(0)],
        default=10,
        help_text="Number of available places remaining for this tour"
    )
    
    # Photos
    photo_urls = models.JSONField(default=list)
    cover_photo = models.CharField(max_length=500, blank=True, null=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Ratings
    average_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    number_of_reviews = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tour'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} by {self.guide.user.firstname}"
    
    def save(self, *args, **kwargs):
        # Validate wilaya is in guide's coverage zones
        if not self.guide.coverage_zones.filter(wilaya=self.wilaya).exists():
            raise ValueError("Tour location must be in guide's coverage zones")
        
        # Auto-calculate price
        self.calculated_price = self.calculate_price()
        
        # If this is a new tour, set available_places to max_places
        if self.pk is None:
            if self.available_places is None or self.available_places == 10:
                self.available_places = self.max_places
        
        super().save(*args, **kwargs)
    
    def calculate_price(self):
        """Calculate price from guide's pricing grid"""
        duration = float(self.estimated_duration)
        
        if duration <= 4:
            return self.guide.half_day_price
        elif duration <= 8:
            return self.guide.full_day_price
        else:
            additional_hours = duration - 8
            return (
                self.guide.full_day_price + 
                (Decimal(str(additional_hours)) * self.guide.additional_hour_price)
            )
    
    def has_available_places(self, requested_places):
        """Check if enough places available"""
        return self.available_places >= requested_places
    
    def update_rating(self):
        """Update rating from reviews"""
        from django.db.models import Avg
        reviews = self.reviews.all()
        self.number_of_reviews = reviews.count()
        if self.number_of_reviews > 0:
            self.average_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0
        else:
            self.average_rating = 0
        self.save(update_fields=['average_rating', 'number_of_reviews'])


class Reservation(models.Model):
    """
    Reservation - Tourist books a tour
    Status is AUTOMATIC: accepted if places available
    """
    STATUS_CHOICES = [
        ('accepted', 'Accepted'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.AutoField(primary_key=True)
    tour = models.ForeignKey(
        'Tour',
        on_delete=models.CASCADE,
        related_name='reservations'
    )
    guide = models.ForeignKey(
        'Guide',
        on_delete=models.CASCADE,
        related_name='reservations'
    )
    tourist = models.ForeignKey(
        'Tourist',
        on_delete=models.CASCADE,
        related_name='reservations',
        null=True,
        blank=True
    )
    number_of_people = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='accepted')
    final_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    scheduled_time = models.TimeField(null=True, blank=True, help_text="Scheduled time of the tour")
    
    class Meta:
        db_table = 'reservation'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.tour.title} - {self.tourist.user.email} ({self.number_of_people} people)"
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        
        if is_new:
            if not self.tour.has_available_places(self.number_of_people):
                raise ValueError("Not enough available places for this tour")
            
            self.final_price = self.tour.calculated_price * Decimal(str(self.number_of_people))
            self.tour.available_places -= self.number_of_people
            self.tour.save(update_fields=['available_places'])
            
        super().save(*args, **kwargs)

    @property
    def tour_date(self):
        return self.tour.date


class Review(models.Model):
    """
    Review - Users can only rate tours, not guides directly.
    Guide rating is calculated as the average of all their tour ratings.
    """
    id = models.AutoField(primary_key=True)
    
    tour = models.ForeignKey(
        'Tour',
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    tourist = models.ForeignKey(
        'Tourist',
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    
    publication_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'review'
        ordering = ['-publication_date']
    
    def __str__(self):
        return f"Review by {self.tourist.user.email} - {self.rating}★"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.tour.update_rating()
        self.tour.guide.update_rating()


class WeatherInfo(models.Model):
    """
    Stores weather information for a specific date and location
    """
    id = models.AutoField(primary_key=True)
    date = models.DateField()  # The date of the weather forecast
    max_temperature = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    min_temperature = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    conditions = models.CharField(max_length=100, blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('date', 'latitude', 'longitude')
        indexes = [
            models.Index(fields=['date', 'latitude', 'longitude']),
        ]

    def __str__(self):
        return f"{self.date} - {self.latitude}, {self.longitude}: {self.conditions}"

    @classmethod
    def get_weather_for_tour(cls, tour, tour_date):
        """
        Get or fetch weather for a tour's location and date.
        Uses OpenWeatherMap as primary and Open-Meteo as fallback.
        Returns WeatherInfo object or None if not available.
        """
        import requests
        import os
        from datetime import datetime, timedelta
        from django.utils import timezone
        from decimal import Decimal
        
        # Only get weather if tour is within forecast window
        days_until = (tour_date - timezone.now().date()).days
        if not (0 <= days_until <= 7):
            return None
        
        # Use tour coordinates or Wilaya coordinates
        latitude = tour.latitude if tour.latitude else tour.wilaya.latitude
        longitude = tour.longitude if tour.longitude else tour.wilaya.longitude
        
        if not latitude or not longitude:
            return None
            
        try:
            # Check cache (3 hours)
            weather = cls.objects.filter(
                date=tour_date,
                latitude=latitude,
                longitude=longitude,
                last_updated__gt=timezone.now() - timedelta(hours=3)
            ).first()
            
            if weather:
                return weather
            
            # --- PRIMARY: OpenWeatherMap (requires API key) ---
            api_key = os.getenv('OPENWEATHERMAP_API_KEY') or os.getenv('OPENWEATHER_API_KEY')
            if api_key:
                try:
                    # OpenWeatherMap (5-day forecast - note current logic uses tour_date)
                    # For dates beyond 5 days, OWM Free might fail, but Open-Meteo works up to 7+
                    if days_until <= 5:
                        owm_response = requests.get(
                            "https://api.openweathermap.org/data/2.5/forecast",
                            params={
                                'lat': float(latitude),
                                'lon': float(longitude),
                                'appid': api_key,
                                'units': 'metric'
                            }
                        )
                        if owm_response.status_code == 200:
                            owm_data = owm_response.json()
                            # Find the closest forecast for noon on tour_date
                            target_dt = f"{tour_date.isoformat()} 12:00:00"
                            closest = min(owm_data['list'], key=lambda x: abs(
                                datetime.fromisoformat(x['dt_txt'].replace(' ', 'T')) - 
                                datetime.fromisoformat(target_dt.replace(' ', 'T'))
                            ))
                            
                            # Filter daily max/min for that day from all 3-hour slots
                            day_forecasts = [f for f in owm_data['list'] if f['dt_txt'].startswith(tour_date.isoformat())]
                            if day_forecasts:
                                max_temp = max(f['main']['temp_max'] for f in day_forecasts)
                                min_temp = min(f['main']['temp_min'] for f in day_forecasts)
                            else:
                                max_temp = closest['main']['temp_max']
                                min_temp = closest['main']['temp_min']

                            weather, _ = cls.objects.update_or_create(
                                date=tour_date,
                                latitude=latitude,
                                longitude=longitude,
                                defaults={
                                    'max_temperature': Decimal(str(max_temp)),
                                    'min_temperature': Decimal(str(min_temp)),
                                    'conditions': closest['weather'][0]['description'].capitalize(),
                                    'icon': closest['weather'][0]['icon']
                                }
                            )
                            return weather
                except Exception as owm_err:
                    print(f"OpenWeatherMap error, falling back: {owm_err}")

            # --- FALLBACK / SECONDARY: Open-Meteo (keyless) ---
            response = requests.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    'latitude': float(latitude),
                    'longitude': float(longitude),
                    'daily': 'temperature_2m_max,temperature_2m_min,weathercode',
                    'timezone': 'auto'
                }
            )
            response.raise_for_status()
            data = response.json()
            
            if 'daily' not in data:
                return None
                
            date_str = tour_date.isoformat()
            try:
                idx = data['daily']['time'].index(date_str)
                
                # Weather code mapping (WMO codes)
                wmo_code = data['daily']['weathercode'][idx]
                conditions_map = {
                    0: ('Clear sky', '01d'),
                    1: ('Mainly clear', '02d'),
                    2: ('Partly cloudy', '02d'),
                    3: ('Overcast', '03d'),
                    45: ('Fog', '50d'),
                    48: ('Fog', '50d'),
                    51: ('Light drizzle', '09d'),
                    53: ('Moderate drizzle', '09d'),
                    55: ('Dense drizzle', '09d'),
                    61: ('Slight rain', '10d'),
                    63: ('Moderate rain', '10d'),
                    65: ('Heavy rain', '10d'),
                    71: ('Slight snow', '13d'),
                    73: ('Moderate snow', '13d'),
                    75: ('Heavy snow', '13d'),
                    80: ('Slight rain showers', '09d'),
                    81: ('Moderate rain showers', '09d'),
                    82: ('Violent rain showers', '09d'),
                    95: ('Thunderstorm', '11d'),
                }
                
                cond_text, cond_icon = conditions_map.get(wmo_code, ('Cloudy', '03d'))
                
                weather, created = cls.objects.update_or_create(
                    date=tour_date,
                    latitude=latitude,
                    longitude=longitude,
                    defaults={
                        'max_temperature': Decimal(str(data['daily']['temperature_2m_max'][idx])),
                        'min_temperature': Decimal(str(data['daily']['temperature_2m_min'][idx])),
                        'conditions': cond_text,
                        'icon': cond_icon
                    }
                )
                return weather
            except (ValueError, IndexError):
                return None
                
        except Exception as e:
            print(f"Weather fetch error: {str(e)}")
            return None


class Report(models.Model):
    """
    Report made by a Tourist about a Guide (for admin review)
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('resolved', 'Resolved'),
        ('rejected', 'Rejected'),
    ]

    id = models.AutoField(primary_key=True)
    guide = models.ForeignKey('Guide', on_delete=models.CASCADE, related_name='reports')
    tourist = models.ForeignKey('Tourist', on_delete=models.SET_NULL, null=True, blank=True, related_name='reports')
    tour = models.ForeignKey('Tour', on_delete=models.SET_NULL, null=True, blank=True, related_name='reports')
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'report'

    def __str__(self):
        return f"Report #{self.id} - {self.title} ({self.status})"


class PersonalizedRequest(models.Model):
    """
    Custom/Personalized tour request from a Tourist to a Guide
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    id = models.AutoField(primary_key=True)
    guide = models.ForeignKey('Guide', on_delete=models.CASCADE, related_name='personalized_requests')
    tourist = models.ForeignKey('Tourist', on_delete=models.CASCADE, related_name='personalized_requests')
    
    preferred_date = models.DateField()
    departure_time = models.TimeField()
    duration_hours = models.DecimalField(max_digits=4, decimal_places=1)
    number_of_people = models.PositiveIntegerField(default=1)
    
    wilaya = models.ForeignKey('Wilaya', on_delete=models.SET_NULL, null=True, blank=True)
    departure_location = models.CharField(max_length=255, blank=True)
    tourist_phone = models.CharField(max_length=20, blank=True, null=True)
    
    description = models.TextField()
    special_requests = models.TextField(blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'personalized_request'
        ordering = ['-created_at']

    def __str__(self):
        return f"Request for {self.preferred_date} - {self.tourist.user.email}"

    @staticmethod
    def _normalize_phone(phone):
        if not phone: return None
        clean = phone.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        if clean.startswith('+'): return clean
        if clean.startswith('0'): return '+213' + clean[1:]
        return '+213' + clean

    def get_tourist_phone_display(self):
        if not self.tourist_phone: return "N/A"
        p = self.tourist_phone
        if p.startswith('+213') and len(p) == 13:
            return f"+213 {p[4:7]} {p[7:9]} {p[9:11]} {p[11:13]}"
        return p
