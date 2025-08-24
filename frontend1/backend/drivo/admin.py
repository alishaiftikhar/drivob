from django.contrib import admin
from django.core.mail import send_mail
from django.utils.safestring import mark_safe
from .models import User, DriverProfile, ClientProfile, Ride, Payment, Review, EmailOTP
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_driver', 'is_client', 'is_staff')
    list_filter = ('is_driver', 'is_client', 'is_staff')
    search_fields = ('email',)

    def save_model(self, request, obj, form, change):
        if change:
            try:
                old_obj = User.objects.get(pk=obj.pk)
                # Check for driver profile approval change
                if hasattr(old_obj, 'driver_profile') and hasattr(obj, 'driver_profile'):
                    old_driver_profile = old_obj.driver_profile
                    new_driver_profile = obj.driver_profile
                    if (
                        hasattr(old_driver_profile, 'is_approved') and
                        hasattr(new_driver_profile, 'is_approved')
                    ):
                        if not old_driver_profile.is_approved and new_driver_profile.is_approved:
                            send_mail(
                                subject='Your Driver Account Has Been Approved',
                                message=f"Hello {obj.email},\n\nYour driver account has been approved. You can now log in and start receiving rides.",
                                from_email=None,
                                recipient_list=[obj.email],
                                fail_silently=False,
                            )
            except User.DoesNotExist:
                pass
        super().save_model(request, obj, form, change)

@admin.register(DriverProfile)
class DriverProfileAdmin(admin.ModelAdmin):
    list_display = (
        'full_name', 'cnic', 'age', 'phone_number', 'city', 
        'driving_license', 'license_expiry', 'status', 'dp_thumbnail', 'show_location'
    )
    list_filter = ('status', 'city')
    search_fields = ('full_name', 'cnic', 'phone_number', 'city', 'driving_license')

    # Show driver profile picture
    def dp_thumbnail(self, obj):
        if obj.dp:
            return mark_safe(f'<img src="{obj.dp.url}" width="50" height="50" style="border-radius:50%;"/>')
        return "No Image"
    dp_thumbnail.short_description = 'Profile Picture'

    # Show Google Maps link for driver's current location
    def show_location(self, obj):
        if obj.current_latitude and obj.current_longitude:
            return mark_safe(
                f'<a href="https://www.google.com/maps?q={obj.current_latitude},{obj.current_longitude}" target="_blank">View on Map</a>'
            )
        return "No Location"
    show_location.short_description = "Current Location"

    # Organize fields in sections
    fieldsets = (
        ('Personal Information', {
            'fields': ('full_name', 'cnic', 'age', 'phone_number', 'city', 'dp')
        }),
        ('Driver Information', {
            'fields': ('driving_license', 'license_expiry', 'status')
        }),
        ('Location Information', {
            'fields': ('current_latitude', 'current_longitude', 'last_location_update', 'show_location'),
            'classes': ('collapse',),
        }),
    )

    # Make location fields readonly
    readonly_fields = ('current_latitude', 'current_longitude', 'last_location_update', 'show_location')

@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'cnic', 'age', 'phone_number', 'address','dp')
    search_fields = ('full_name', 'cnic', 'phone_number', 'address')
   
    def dp_thumbnail(self, obj):
        if obj.dp:
            return mark_safe(f'<img src="{obj.dp.url}" width="50" height="50" />')
        return "No Image"
    dp_thumbnail.short_description = 'Profile Picture'
    dp_thumbnail.allow_tags = True

@admin.register(Ride)
class RideAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'client', 'driver', 'pickup_location', 'dropoff_location',
        'trip_type', 'vehicle_type', 'fare', 'status', 'created_at',
    )
    list_filter = ('status', 'trip_type', 'vehicle_type')
    search_fields = ('pickup_location', 'dropoff_location', 'client__full_name', 'driver__full_name')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'ride', 'client', 'amount', 'method', 'status', 'created_at')
    list_filter = ('status', 'method')
    search_fields = ('ride_id', 'client__full_name')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('client', 'driver', 'rating', 'created_at')
    search_fields = ('client__full_name', 'driver__full_name')

@admin.register(EmailOTP)
class EmailOTPAdmin(admin.ModelAdmin):
    list_display = ('email', 'otp', 'created_at', 'is_used')
    search_fields = ('email', 'otp')
    list_filter = ('created_at', 'is_used')