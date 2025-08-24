from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, DriverProfileViewSet, ClientProfileViewSet, RideViewSet, 
    PaymentViewSet, ReviewViewSet, AvailableDriversView, DebugDriversView,
    SignupView, SendOTPView, VerifyOTPView, SetUserTypeView, ClientProfileView,
    DriverProfileView, UpdateDriverLocationView, UpdateClientLocationView,
    SaveLocationView, GetCurrentLocationView, GeocodeView, CacheStatsView,
    ResetPasswordView, UserTypeView, RequestDebugView, test_media_view, 
    serve_media_view, UserProfileView, CurrentUserView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'driver-profiles', DriverProfileViewSet)
router.register(r'client-profiles', ClientProfileViewSet)
router.register(r'rides', RideViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'reviews', ReviewViewSet)

app_name = 'drivo'

urlpatterns = [
    # Router endpoints
    path('', include(router.urls)),
    
    # Authentication endpoints
    path('signup/', SignupView.as_view(), name='signup'),
    path('send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('set-user-type/', SetUserTypeView.as_view(), name='set-user-type'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    
    # Profile endpoints
    path('user-type/', UserTypeView.as_view(), name='user-type'),
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('client-profile/', ClientProfileView.as_view(), name='client-profile'),
    path('driver-profile/', DriverProfileView.as_view(), name='driver-profile'),
    path('current-user/', CurrentUserView.as_view(), name='current-user'),
    
    # Location endpoints
    path('driver/update-location/', UpdateDriverLocationView.as_view(), name='update-driver-location'),
    path('client/update-location/', UpdateClientLocationView.as_view(), name='update-client-location'),
    path('save-location/', SaveLocationView.as_view(), name='save-location'),
    path('get-current-location/', GetCurrentLocationView.as_view(), name='get-current-location'),
    
    # Other endpoints
    path('available-drivers/', AvailableDriversView.as_view(), name='available-drivers'),
    path('debug-drivers/', DebugDriversView.as_view(), name='debug-drivers'),
    path('geocode/', GeocodeView.as_view(), name='geocode'),
    path('cache-stats/', CacheStatsView.as_view(), name='cache-stats'),
    path('request-debug/', RequestDebugView.as_view(), name='request-debug'),
    
    # Media debug endpoints
    path('test-media/', test_media_view, name='test-media'),
]