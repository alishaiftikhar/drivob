from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_driver = models.BooleanField(default=False)
    is_client = models.BooleanField(default=False)

class DriverProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='driver_profile')
    full_name = models.CharField(max_length=100)
    cnic = models.CharField(max_length=15)
    age = models.IntegerField()
    driving_license = models.CharField(max_length=50)
    license_expiry = models.DateField()
    phone_number = models.CharField(max_length=15)
    city = models.CharField(max_length=50)

    def __str__(self):
        return self.full_name

class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    full_name = models.CharField(max_length=100)
    cnic = models.CharField(max_length=15)
    age = models.IntegerField()
    phone_number = models.CharField(max_length=15)
    address = models.CharField(max_length=255)

    def __str__(self):
        return self.full_name

class Ride(models.Model):
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE)
    driver = models.ForeignKey(DriverProfile, on_delete=models.CASCADE)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    trip_type = models.CharField(max_length=20, choices=[('one-way', 'One Way'), ('round-trip', 'Round Trip')])
    vehicle_type = models.CharField(max_length=50)
    fare = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('requested', 'Requested'), ('accepted', 'Accepted'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='requested')
    created_at = models.DateTimeField(auto_now_add=True)

class Payment(models.Model):
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE)
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=20, choices=[('JazzCash', 'JazzCash'), ('EasyPaisa', 'EasyPaisa'), ('Bank Transfer', 'Bank Transfer'), ('Cash', 'Cash')])
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('paid', 'Paid'), ('failed', 'Failed')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class Review(models.Model):
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE)
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE)
    driver = models.ForeignKey(DriverProfile, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
