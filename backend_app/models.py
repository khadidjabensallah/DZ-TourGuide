

from django.db import models
from django.contrib.postgres.fields import ArrayField

from django.http import JsonResponse

class User(models.Model):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True, max_length=100)
    password = models.CharField(max_length=255)
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    photo_url = models.CharField(max_length=500, blank=True, null=True)
    isActive = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'User'
    
    def __str__(self):
        return f"{self.firstname} {self.lastname}"


class Admin(User):
    class Meta:
        db_table = 'admin'
    
    def __str__(self):
        return f"Admin: {self.firstname} {self.lastname}"


class Tourist(User):
    nationality = models.CharField(max_length=50, blank=True, null=True)
    
    class Meta:
        db_table = 'tourist'
    
    def __str__(self):
        return f"Tourist: {self.firstname} {self.lastname}"


class Guide(User):
    biography = models.TextField(blank=True, null=True)
    offering_spoken_languages = ArrayField(
        models.CharField(max_length=50),

        default=list
    )
    phone = models.CharField(max_length=20)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    number_of_reviews = models.IntegerField(default=0)
    is_verified = models.BooleanField(default=False)
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
        return f"Guide: {self.firstname} {self.lastname}"


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
        return f"{self.guide.firstname} covers {self.wilaya.name}"