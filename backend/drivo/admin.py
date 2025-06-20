from django.contrib import admin
from .models import User, DriverProfile, ClientProfile

admin.site.register(User)
admin.site.register(DriverProfile)
admin.site.register(ClientProfile)

