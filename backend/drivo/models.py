from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import datetime
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator


# Validators
phone_validator = RegexValidator(regex=r'^\+?\d{10,15}$', message="Enter a valid phone number")


# User model
class User(AbstractUser):
    username = None  # remove username field
    email = models.EmailField(unique=True)
    is_driver = models.BooleanField(default=False)
    is_client = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


# Driver Profile
class DriverProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='driver_profile')
    full_name = models.CharField(max_length=100, blank=True, null=True)
    cnic = models.CharField(max_length=15, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    driving_license = models.CharField(max_length=50, blank=True, null=True)
    license_expiry = models.DateField(blank=True, null=True)
    phone_number = models.CharField(validators=[phone_validator], max_length=15, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.full_name or "DriverProfile"


# Client Profile
class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    full_name = models.CharField(max_length=100, blank=True, null=True)
    cnic = models.CharField(max_length=15, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    phone_number = models.CharField(validators=[phone_validator], max_length=15, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    dp = models.ImageField(upload_to='profile_pics/', null=True, blank=True)  # Profile picture field
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)  # For live location
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    def __str__(self):
        return self.full_name or "ClientProfile"


# Ride model
# models.py
from django.db import models
from django.conf import settings
class Ride(models.Model):
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE)
    driver = models.ForeignKey(DriverProfile, on_delete=models.SET_NULL, null=True, blank=True)
    
    pickup_location = models.CharField(max_length=255)  # This is your "source"
    dropoff_location = models.CharField(max_length=255)  # This is your "destination"
    
    # Coordinates for source and destination
    pickup_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    pickup_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    dropoff_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    dropoff_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Other fields
    date = models.DateField()
    time = models.TimeField()
    vehicle_type = models.CharField(max_length=50)
    fuel_type = models.CharField(max_length=20)
    ride_type = models.CharField(max_length=10)  # e.g., '1-Way', '2-Way'
    status = models.CharField(max_length=20, default='requested')
    created_at = models.DateTimeField(auto_now_add=True)

# Payment model
class Payment(models.Model):
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE)
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=20, choices=[
        ('JazzCash', 'JazzCash'),
        ('EasyPaisa', 'EasyPaisa'),
        ('Bank Transfer', 'Bank Transfer'),
        ('Cash', 'Cash')
    ])
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed')
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.id} - {self.amount} PKR"


# Review model
class Review(models.Model):
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE)
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE)
    driver = models.ForeignKey(DriverProfile, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.client.full_name or 'Unknown'} - {self.rating} stars"


# Email OTP
class EmailOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)  # prevent reuse

    def is_expired(self):
        return timezone.now() > self.created_at + datetime.timedelta(minutes=5)

    def __str__(self):
        return f"OTP for {self.email} - {'Used' if self.is_used else 'Active'}"
