
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, DriverProfileViewSet, ClientProfileViewSet, SignupView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'drivers', DriverProfileViewSet)
router.register(r'clients', ClientProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', SignupView.as_view(), name='signup'),
]