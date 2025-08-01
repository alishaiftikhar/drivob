
from django.urls import path, include
from .views import send_email_otp, verify_email_otp
from drivo.views import test_email_view
from rest_framework.routers import DefaultRouter
from .views import (UserViewSet, DriverProfileViewSet, ClientProfileViewSet, SignupView, RideViewSet, PaymentViewSet, ReviewViewSet,
CheckCNICView, CheckLicenseView, CheckEmailUniqueView,IsLoggedInView, VerifyOTPView, LoginView
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
    path('check-cnic/', CheckCNICView.as_view()),
    path('check-license/', CheckLicenseView.as_view()),
    path('check-email/', CheckEmailUniqueView.as_view()),
    path('is-logged-in/', IsLoggedInView.as_view()),
    path('verify-otp/', VerifyOTPView.as_view()),
    path('login/', LoginView.as_view()),
    path('send-email-otp/', send_email_otp, name='send_email_otp'),
    path('verify-email-otp/', verify_email_otp, name='verify_email_otp'),
    path('test-email/', test_email_view, name='test-email'),
]

