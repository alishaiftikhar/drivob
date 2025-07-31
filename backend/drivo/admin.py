from django.contrib import admin
from .models import CustomUser, DriverProfile, ClientProfile, Ride, Payment, Review

@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_driver', 'is_client', 'is_staff')
    list_filter = ('is_driver', 'is_client', 'is_staff')
    search_fields = ('username', 'email')

@admin.register(DriverProfile)
class DriverProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'cnic', 'age', 'phone_number', 'city')
    search_fields = ('full_name', 'cnic', 'phone_number', 'city')

@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'cnic', 'age', 'phone_number', 'address')
    search_fields = ('full_name', 'cnic', 'phone_number', 'address')

@admin.register(Ride)
class RideAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'driver', 'pickup_location', 'dropoff_location', 'status', 'created_at')
    list_filter = ('status', 'trip_type')
    search_fields = ('pickup_location', 'dropoff_location')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'ride', 'client', 'amount', 'method', 'status', 'created_at')
    list_filter = ('status', 'method')
    search_fields = ('ride__id', 'client__full_name')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('ride', 'client', 'driver', 'rating', 'created_at')
    search_fields = ('client__full_name', 'driver__full_name')
