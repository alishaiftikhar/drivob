from django.contrib import admin
from django.core.mail import send_mail
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
                # Assuming 'is_approved' is a field related to driver approval on User or related model
                if hasattr(old_obj, 'driver_profile'):
                    old_driver_profile = old_obj.driver_profile
                    if hasattr(old_driver_profile, 'is_approved'):
                        if not old_driver_profile.is_approved and obj.driver_profile.is_approved:
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
    list_display = ('full_name', 'cnic', 'age', 'phone_number', 'city', 'driving_license', 'license_expiry')
    search_fields = ('full_name', 'cnic', 'phone_number', 'city', 'driving_license')


@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'cnic', 'age', 'phone_number', 'address', 'dp')
    search_fields = ('full_name', 'cnic', 'phone_number', 'address')


class RideAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'driver', 'pickup_location', 'dropoff_location', 'status', 'created_at')
    list_filter = ('status', 'ride_type')  # Correct field name here
    search_fields = ('pickup_location', 'dropoff_location')

@admin.register(Ride)
class RideAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'client',
        'driver',
        'pickup_location',
        'dropoff_location',
        'ride_type',
        'status',
        'created_at',
    )
    list_filter = ('status', 'ride_type')
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


@admin.register(EmailOTP)
class EmailOTPAdmin(admin.ModelAdmin):
    list_display = ('email', 'otp', 'created_at')
    search_fields = ('email', 'otp')
    list_filter = ('created_at',)
