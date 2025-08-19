from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.hashers import make_password
import random
import requests  # Required for geocode API view

from drivo.models import (
    User, DriverProfile, ClientProfile, Ride, Payment, Review, EmailOTP
)
from drivo.serializers import (
    UserSerializer, DriverProfileSerializer, ClientProfileSerializer,
    RideSerializer, PaymentSerializer, ReviewSerializer
)


# ------------------- MODEL VIEWSETS -------------------
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class DriverProfileViewSet(viewsets.ModelViewSet):
    queryset = DriverProfile.objects.all()
    serializer_class = DriverProfileSerializer


class ClientProfileViewSet(viewsets.ModelViewSet):
    queryset = ClientProfile.objects.all()
    serializer_class = ClientProfileSerializer


class RideViewSet(viewsets.ModelViewSet):
    queryset = Ride.objects.all()
    serializer_class = RideSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        client_profile = self.request.user.client_profile
        serializer.save(client=client_profile)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


# ------------------- SIGNUP -------------------
class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"message": "Email and password are required."}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({"message": "Email already registered."}, status=400)

        try:
            user = User.objects.create(
                email=email,
                password=make_password(password),
                is_active=False
            )

            # Generate OTP
            otp = str(random.randint(100000, 999999))
            EmailOTP.objects.create(email=email, otp=otp)

            send_mail(
                subject='Your OTP Code',
                message=f'Your OTP code is {otp}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )

            return Response({"message": "Signup successful. OTP sent to email.", "email": email}, status=201)

        except Exception as e:
            return Response({"message": "Signup failed", "error": str(e)}, status=400)


# ------------------- RESEND OTP -------------------
class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'success': False, 'message': 'Email is required'}, status=400)

        if not User.objects.filter(email=email).exists():
            return Response({'success': False, 'message': 'User not found'}, status=404)

        otp = str(random.randint(100000, 999999))
        EmailOTP.objects.create(email=email, otp=otp)

        send_mail(
            subject='Your OTP Code',
            message=f'Your OTP code is {otp}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        return Response({'success': True, 'message': 'OTP sent to your email'})


# ------------------- VERIFY OTP -------------------
class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response({'success': False, 'message': 'Email and OTP are required'}, status=400)

        try:
            otp_obj = EmailOTP.objects.filter(email=email, otp=otp).latest('created_at')

            if otp_obj.is_expired():
                return Response({'success': False, 'message': 'OTP has expired'}, status=400)

            user = User.objects.get(email=email)
            user.is_active = True
            user.save()

            otp_obj.delete()

            refresh = RefreshToken.for_user(user)

            return Response({
                'success': True,
                'message': 'OTP verified successfully',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'email': user.email
            }, status=200)

        except EmailOTP.DoesNotExist:
            return Response({'success': False, 'message': 'Invalid OTP'}, status=400)


# ------------------- SET USER TYPE -------------------
class SetUserTypeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_type = request.data.get('user_type') or request.data.get('type')
        user = request.user

        if user_type == 'driver':
            user.is_driver = True
            user.is_client = False
            user.save()
            DriverProfile.objects.get_or_create(user=user, defaults={
                'full_name': '',
                'age': None,
                'cnic': '',
                'driving_license': '',
                'license_expiry': None,
                'phone_number': '',
                'city': ''
            })
        elif user_type == 'client':
            user.is_client = True
            user.is_driver = False
            user.save()
            ClientProfile.objects.get_or_create(user=user, defaults={
                'full_name': '',
                'age': None,
                'cnic': '',
                'phone_number': '',
                'address': ''
            })
        else:
            return Response({"error": "Invalid user type"}, status=400)

        return Response({"success": True, "message": "User type updated and profile created"}, status=200)


# ------------------- CLIENT PROFILE VIEW -------------------
class ClientProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # Enable multipart form parsing

    def get(self, request):
        profile, _ = ClientProfile.objects.get_or_create(user=request.user, defaults={
            'full_name': '',
            'age': None,
            'cnic': '',
            'phone_number': '',
            'address': ''
        })
        serializer = ClientProfileSerializer(profile)
        return Response(serializer.data, status=200)

    def put(self, request):
        profile, _ = ClientProfile.objects.get_or_create(user=request.user, defaults={
            'full_name': '',
            'age': None,
            'cnic': '',
            'phone_number': '',
            'address': ''
        })
        serializer = ClientProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            print(serializer.errors)  # Log errors to console for debugging
            return Response(serializer.errors, status=400)


# ------------------- DRIVER PROFILE VIEW -------------------
class DriverProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # Enable multipart form parsing

    def get(self, request):
        profile, _ = DriverProfile.objects.get_or_create(user=request.user, defaults={
            'full_name': '',
            'age': None,
            'cnic': '',
            'driving_license': '',
            'license_expiry': None,
            'phone_number': '',
            'city': ''
        })
        serializer = DriverProfileSerializer(profile)
        return Response(serializer.data, status=200)

    def put(self, request):
        profile, _ = DriverProfile.objects.get_or_create(user=request.user, defaults={
            'full_name': '',
            'age': None,
            'cnic': '',
            'driving_license': '',
            'license_expiry': None,
            'phone_number': '',
            'city': ''
        })
        serializer = DriverProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=400)


# ------------------- SAVE LOCATION VIEW -------------------
class SaveLocationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')

        if latitude is None or longitude is None:
            return Response({"error": "Both latitude and longitude are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Save coordinate for ClientProfile or DriverProfile depending on user role
        if getattr(user, 'is_client', False):
            profile, _ = ClientProfile.objects.get_or_create(user=user)
        elif getattr(user, 'is_driver', False):
            profile, _ = DriverProfile.objects.get_or_create(user=user)
        else:
            return Response({"error": "User has no associated profile."}, status=status.HTTP_400_BAD_REQUEST)

        profile.latitude = latitude
        profile.longitude = longitude
        profile.save()

        return Response({"success": "Location saved successfully."}, status=status.HTTP_200_OK)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.core.cache import cache
import requests
import re

def sanitize_cache_key(query):
    # Replace unsafe characters (including spaces) with underscore
    return re.sub(r'[^A-Za-z0-9_-]', '_', query)

class GeocodeView(APIView):
    permission_classes = [AllowAny]  # Allow public access

    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response(
                {"error": "Query parameter 'q' is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cache_key = f'geocode_{sanitize_cache_key(query)}'
        cached_response = cache.get(cache_key)
        if cached_response:
            return Response(cached_response, status=status.HTTP_200_OK)

        url = 'https://nominatim.openstreetmap.org/search'
        params = {
            'q': query,
            'format': 'json',
            'limit': 1
        }
        headers = {
            'User-Agent': 'Drivo/1.0 (gdooduii@gmail.com)'
        }

        try:
            response = requests.get(url, params=params, headers=headers, timeout=5)
            response.raise_for_status()
            data = response.json()
            if data:
                cache.set(cache_key, data[0], timeout=3600)  # Cache for 1 hour
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Location not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        except requests.RequestException as e:
            return Response(
                {"error": "External API request failed", "details": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
