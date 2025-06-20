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
