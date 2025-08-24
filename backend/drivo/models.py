from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db import models
from django.utils import timezone
import datetime
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator
from .managers import CustomUserManager  # Import the custom manager

phone_validator = RegexValidator(regex=r'^\+?\d{10,15}$', message="Enter a valid phone number")

class User(AbstractUser):
    username = None 
    email = models.EmailField(unique=True)
    is_driver = models.BooleanField(default=False)
    is_client = models.BooleanField(default=False)
    
    # Use the custom manager
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    def __str__(self):
        return self.email

class DriverProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='driver_profile')
    full_name = models.CharField(max_length=100, blank=True, null=True)
    cnic = models.CharField(max_length=15, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    driving_license = models.CharField(max_length=50, blank=True, null=True)
    license_expiry = models.DateField(blank=True, null=True)
    phone_number = models.CharField(validators=[phone_validator], max_length=15, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=20, default='pending', choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ])
    dp = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    # Add current location fields
    current_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    current_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    last_location_update = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.full_name or "DriverProfile"

class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    full_name = models.CharField(max_length=100, blank=True, null=True)
    cnic = models.CharField(max_length=15, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    phone_number = models.CharField(validators=[phone_validator], max_length=15, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    dp = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    def __str__(self):
        return self.full_name or "ClientProfile"

class Ride(models.Model):
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE)
    driver = models.ForeignKey(DriverProfile, on_delete=models.SET_NULL, null=True, blank=True)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    
    # Update these fields to allow more digits before the decimal point
    pickup_latitude = models.DecimalField(max_digits=12, decimal_places=8, null=True, blank=True)
    pickup_longitude = models.DecimalField(max_digits=12, decimal_places=8, null=True, blank=True)
    dropoff_latitude = models.DecimalField(max_digits=12, decimal_places=8, null=True, blank=True)
    dropoff_longitude = models.DecimalField(max_digits=12, decimal_places=8, null=True, blank=True)
    
    scheduled_datetime = models.DateTimeField(null=True, blank=True)
    vehicle_type = models.CharField(max_length=50)
    fuel_type = models.CharField(
        max_length=20, 
        choices=[
            ('petrol', 'Petrol'),
            ('diesel', 'Diesel'),
            ('cng', 'CNG'),
            ('electric', 'Electric'),
            ('hybrid', 'Hybrid')
        ], 
        default='petrol'
    )
    trip_type = models.CharField(
        max_length=20, 
        choices=[
            ('one-way', 'One Way'),
            ('round-trip', 'Round Trip')
        ]
    )
    fare = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(
        max_length=20, 
        default='requested',
        choices=[
            ('requested', 'Requested'),
            ('accepted', 'Accepted'),
            ('completed', 'Completed'),
            ('cancelled', 'Cancelled')
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Ride {self.id} - {self.pickup_location} to {self.dropoff_location}"

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

class Review(models.Model):
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE, null=True, blank=True)  # Made nullable
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE)
    driver = models.ForeignKey(DriverProfile, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Review by {self.client.full_name or 'Unknown'} - {self.rating} stars"

class EmailOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    
    def is_expired(self):
        return timezone.now() > self.created_at + datetime.timedelta(minutes=5)
    
    def __str__(self):
        return f"OTP for {self.email} - {'Used' if self.is_used else 'Active'}"