from rest_framework import viewsets, status
from rest_framework.views import APIView
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import EmailOTP
from django.utils import timezone
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from .models import User, EmailOTP, DriverProfile, ClientProfile, Ride, Payment, Review
from drivo.serializers import (UserSerializer, DriverProfileSerializer, ClientProfileSerializer,
    RideSerializer, PaymentSerializer, ReviewSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

class DriverProfileViewSet(viewsets.ModelViewSet):
    queryset = DriverProfile.objects.all()
    serializer_class = DriverProfileSerializer
    permission_classes = [AllowAny] 

class ClientProfileViewSet(viewsets.ModelViewSet):
    queryset = ClientProfile.objects.all()
    serializer_class = ClientProfileSerializer
    permission_classes = [AllowAny] 

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
    permission_classes = [AllowAny]
    def post(self, request):
        data = request.data
        try:
            user = User.objects.create(
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
        exists = User.objects.filter(cnic=cnic).exists()
        return Response({"exists": exists})

class CheckLicenseView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        license_number = request.data.get("license_number")
        try:
            user = User.objects.get(license_number=license_number)
            if user.license_expiry_date and user.license_expiry_date < timezone.now().date():
                return Response({"expired": True})
            return Response({"valid": True})
        except User.DoesNotExist:
            return Response({"exists": False}, status=404)

class CheckEmailUniqueView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        exists = User.objects.filter(email=email).exists()
        return Response({"exists": exists})

class IsLoggedInView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
            return Response({"logged_in": user.is_logged_in})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
    
class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        try:
            user = User.objects.get(email=email)
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
            user = User.objects.get(email=email)
        except User.DoesNotExist:
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
@api_view(['POST'])
def send_email_otp(request):
    email = request.data.get('email')
    otp = str(random.randint(100000, 999999))

    obj, created = EmailOTP.objects.update_or_create(
        email=email,
        defaults={
            'otp_code': otp,
            'created_at': timezone.now(),
            'is_verified': False
        }
    )

    send_mail(
        subject='Your Email Verification OTP',
        message=f'Your OTP is {otp}',
        from_email='your-email@example.com',
        recipient_list=[email],
        fail_silently=False,
    )

    return Response({'message': 'OTP sent to email'})

@api_view(['POST'])
def verify_email_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')

    try:
        obj = EmailOTP.objects.get(email=email, otp_code=otp)
        if (timezone.now() - obj.created_at).seconds > 300:
            return Response({'message': 'OTP expired', 'status': False})

        obj.is_verified = True
        obj.save()
        return Response({'message': 'Email verified successfully', 'status': True})
    except EmailOTP.DoesNotExist:
        return Response({'message': 'Invalid OTP', 'status': False})
@api_view(['GET'])
def test_email_view(request):
    send_mail(
        subject='OTP Test Email',
        message='This is a test email to verify Django email settings.',
        from_email=None,  # Uses EMAIL_HOST_USER from settings
        recipient_list=['alishaiftikhar025@gmail.com'],  # ✅ Replace with your test email
        fail_silently=False,
    )
    return JsonResponse({'message': 'Test email sent successfully.'})
