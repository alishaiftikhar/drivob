from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('drivo.urls')),  # All API routes will be in drivo/urls.py
]
