from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drivo.views import (
    UserViewSet,
    DriverProfileViewSet,
    ClientProfileViewSet,
    SignupView,
    RideViewSet,
    PaymentViewSet,
    ReviewViewSet,
    SendOTPView,
    VerifyOTPView,
    SetUserTypeView,
    ClientProfileView,
    DriverProfileView,
    SaveLocationView,
    GeocodeView,  # Make sure this view has permission_classes = [AllowAny]
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'drivers', DriverProfileViewSet)
router.register(r'clients', ClientProfileViewSet)
router.register(r'rides', RideViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', SignupView.as_view(), name='signup'),
    path('send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('set-user-type/', SetUserTypeView.as_view(), name='set-user-type'),
    path('user-profile/', ClientProfileView.as_view(), name='client-profile'),
    path('driver-profile/', DriverProfileView.as_view(), name='driver-profile'),
    path('save-location/', SaveLocationView.as_view(), name='save-location'),
    path('geocode/', GeocodeView.as_view(), name='geocode'),

    # JWT Auth with trailing slashes
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
