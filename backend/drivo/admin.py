from django.contrib import admin
from .models import User, DriverProfile, ClientProfile,Ride, Payment, Review

admin.site.register(User)
admin.site.register(DriverProfile)
admin.site.register(ClientProfile)
admin.site.register(Ride)
admin.site.register(Payment)
admin.site.register(Review)
