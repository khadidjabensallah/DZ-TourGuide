from django.db import models

# Crfrom django.db import models

class User(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    photo_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.firstname} {self.lastname}"
class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Admin: {self.user.firstname} {self.user.lastname}"

class Tourist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nationality = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"Tourist: {self.user.firstname} {self.user.lastname}"
class Guide(models.Model):
    user = models.OneToOneField('User', on_delete=models.CASCADE)
    biography = models.TextField()
    offering_spoken_languages = models.JSONField()
    phone = models.CharField(max_length=20)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    number_of_reviews = models.IntegerField(default=0)
    is_verified = models.BooleanField(default=False)
    full_day_price = models.DecimalField(max_digits=10, decimal_places=2)
    half_day_price = models.DecimalField(max_digits=10, decimal_places=2)
    additional_hour_price = models.DecimalField(max_digits=10, decimal_places=2)
    certifications_files = models.JSONField()
    custom_request_markup = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"Guide: {self.user.firstname} {self.user.lastname}"
