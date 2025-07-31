from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from .models import CustomUser, EmailOTP, DriverProfile, ClientProfile, Ride, Payment, Review
from drivo.serializers import (UserSerializer, DriverProfileSerializer, ClientProfileSerializer,
    RideSerializer, PaymentSerializer, ReviewSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
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

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

class SignupView(APIView):
    def post(self, request):
        data = request.data
        try:
            user = CustomUser.objects.create(
                username=data['username'],
                email=data.get('email', ''),
                password=make_password(data['password']),
                is_driver=data.get('is_driver', False),
                is_client=data.get('is_client', False)
            )
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'username': user.username
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"message": "Signup failed", "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CheckCNICView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        cnic = request.data.get("cnic")
        exists = CustomUser.objects.filter(cnic=cnic).exists()
        return Response({"exists": exists})

class CheckLicenseView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        license_number = request.data.get("license_number")
        try:
            user = CustomUser.objects.get(license_number=license_number)
            if user.license_expiry_date and user.license_expiry_date < timezone.now().date():
                return Response({"expired": True})
            return Response({"valid": True})
        except CustomUser.DoesNotExist:
            return Response({"exists": False}, status=404)

class CheckEmailUniqueView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        exists = CustomUser.objects.filter(email=email).exists()
        return Response({"exists": exists})

class IsLoggedInView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        try:
            user = CustomUser.objects.get(email=email)
            return Response({"logged_in": user.is_logged_in})
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        try:
            user = CustomUser.objects.get(email=email)
            otp_obj = EmailOTP.objects.get(user=user)
            if otp_obj.otp != otp:
                return Response({"valid": False, "message": "Incorrect OTP"}, status=400)
            if otp_obj.is_expired():
                return Response({"valid": False, "message": "OTP expired"}, status=400)
            return Response({"valid": True})
        except:
            return Response({"valid": False, "message": "OTP or User not found"}, status=400)

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        user = authenticate(request, username=user.username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            user.is_logged_in = True
            user.save()
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'message': 'Login successful'
            })
        return Response({"error": "Invalid password"}, status=400)
