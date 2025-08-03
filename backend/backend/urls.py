from django.contrib import admin
from django.urls import path, include
from drivo.views import test_email_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('drivo.urls')), 
    path('api/test-email/', test_email_view),


]