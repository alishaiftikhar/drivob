from rest_framework import viewsets, status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.views.static import serve
import random
import requests
from django.core.cache import cache
import re
from datetime import datetime, timedelta
import os
from drivo.models import (
    User, DriverProfile, ClientProfile, Ride, Payment, Review, EmailOTP
)
from drivo.serializers import (
    UserSerializer, DriverProfileSerializer, ClientProfileSerializer,
    RideSerializer, PaymentSerializer, ReviewSerializer,
)

# ------------------- TEST MEDIA VIEW -------------------
def test_media_view(request):
    media_root = settings.MEDIA_ROOT
    media_url = settings.MEDIA_URL
    
    # Check if media directory exists
    media_exists = os.path.exists(media_root)
    
    # Check if profile_pics directory exists
    profile_pics_path = os.path.join(media_root, 'profile_pics')
    profile_pics_exists = os.path.exists(profile_pics_path)
    
    # List files in profile_pics if it exists
    profile_pics_files = []
    if profile_pics_exists:
        profile_pics_files = os.listdir(profile_pics_path)
    
    response_content = f"""
    <h1>Media Debug Information</h1>
    <p>MEDIA_ROOT: {media_root}</p>
    <p>MEDIA_URL: {media_url}</p>
    <p>Media directory exists: {media_exists}</p>
    <p>Profile pics directory exists: {profile_pics_exists}</p>
    <p>Files in profile_pics: {profile_pics_files}</p>
    """
    
    return Response(response_content)

# ------------------- SERVE MEDIA VIEW -------------------
def serve_media_view(request, path):
    return serve(request, path, document_root=settings.MEDIA_ROOT)

# ------------------- USER TYPE VIEW -------------------
class UserTypeView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        return Response({
            'is_client': request.user.is_client,
            'is_driver': request.user.is_driver,
            'email': request.user.email,
            'user_id': request.user.id,
            'is_active': request.user.is_active  # Added is_active field
        }, status=200)

# ------------------- REQUEST DEBUG VIEW -------------------
class RequestDebugView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        print("=== FULL REQUEST DEBUG ===")
        print("Headers:", dict(request.headers))
        print("Auth header:", request.headers.get('Authorization'))
        print("User:", request.user)
        print("Authenticated:", request.user.is_authenticated)
        print("Is client:", request.user.is_client)
        print("Is driver:", request.user.is_driver)
        
        return Response({
            'headers': dict(request.headers),
            'auth_header': request.headers.get('Authorization'),
            'user': {
                'username': str(request.user),
                'authenticated': request.user.is_authenticated,
                'is_client': request.user.is_client,
                'is_driver': request.user.is_driver,
            }
        }, status=200)

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
    authentication_classes = [JWTAuthentication]
    
    def create(self, request, *args, **kwargs):
        print("=" * 60)
        print("=== RIDE CREATE DEBUG ===")
        print("=" * 60)
        print("User:", request.user.email)
        print("Authenticated:", request.user.is_authenticated)
        print("Is client:", request.user.is_client)
        print("Raw request data:", request.data)
        
        if not request.user.is_client:
            return Response(
                {"error": "Only clients can create rides. Please switch to client mode."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get or create client profile
        try:
            client_profile = ClientProfile.objects.get(user=request.user)
            print(f"Found existing client profile: {client_profile.id}")
        except ClientProfile.DoesNotExist:
            print("Creating new client profile")
            client_profile = ClientProfile.objects.create(
                user=request.user,
                full_name=request.user.email.split('@')[0],
                age=None,
                cnic='',
                phone_number='',
                address=''
            )
            print(f"Created new client profile: {client_profile.id}")
        
        # Verify the client profile exists and is linked to the user
        if not client_profile.user.id == request.user.id:
            return Response(
                {"error": "Client profile is not linked to the current user"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Map frontend field names to model field names
        mapped_data = {
            'pickup_location': request.data.get('pickup_location'),
            'dropoff_location': request.data.get('dropoff_location'),
            'pickup_latitude': request.data.get('pickup_latitude'),
            'pickup_longitude': request.data.get('pickup_longitude'),
            'dropoff_latitude': request.data.get('dropoff_latitude'),
            'dropoff_longitude': request.data.get('dropoff_longitude'),
            'vehicle_type': request.data.get('vehicle_type'),
            'fuel_type': request.data.get('fuel_type'),
            'trip_type': request.data.get('trip_type'),
            'client': client_profile.id
        }
        
        # Handle date and time conversion
        date_str = request.data.get('date')
        time_str = request.data.get('time')
        if date_str and time_str:
            try:
                # Parse date and time into a datetime object
                scheduled_datetime = datetime.strptime(f"{date_str} {time_str}", "%d-%m-%Y %I:%M %p")
                mapped_data['scheduled_datetime'] = scheduled_datetime
            except ValueError as e:
                print(f"Date parsing error: {e}")
                return Response(
                    {"error": "Invalid date or time format. Use DD-MM-YYYY and HH:MM AM/PM format."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        print("Mapped data:", mapped_data)
        
        serializer = self.get_serializer(data=mapped_data)
        
        if not serializer.is_valid():
            print("❌ SERIALIZER VALIDATION ERRORS:")
            print("-" * 40)
            for field, errors in serializer.errors.items():
                print(f"Field: {field}")
                for error in errors:
                    print(f"  Error: {error}")
                print("-" * 20)
            
            error_messages = []
            for field, errors in serializer.errors.items():
                for error in errors:
                    error_messages.append(f"{field}: {error}")
            
            return Response(
                {
                    "error": "Validation failed", 
                    "details": serializer.errors,
                    "messages": error_messages
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Create the ride instance with explicit driver=None
            ride = Ride.objects.create(
                client=client_profile,
                driver=None,  # Explicitly set driver to None
                pickup_location=serializer.validated_data['pickup_location'],
                dropoff_location=serializer.validated_data['dropoff_location'],
                pickup_latitude=serializer.validated_data.get('pickup_latitude'),
                pickup_longitude=serializer.validated_data.get('pickup_longitude'),
                dropoff_latitude=serializer.validated_data.get('dropoff_latitude'),
                dropoff_longitude=serializer.validated_data.get('dropoff_longitude'),
                scheduled_datetime=serializer.validated_data.get('scheduled_datetime'),
                vehicle_type=serializer.validated_data['vehicle_type'],
                fuel_type=serializer.validated_data.get('fuel_type'),
                trip_type=serializer.validated_data['trip_type'],
                status='requested'  # Default status
            )
            
            # Re-serialize the created ride to return the proper response
            response_serializer = self.get_serializer(ride)
            
            print("✅ Ride created successfully!")
            print("Saved data:", response_serializer.data)
            
            headers = self.get_success_headers(response_serializer.data)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            
        except Exception as e:
            print("❌ Error during ride creation:", str(e))
            import traceback
            traceback.print_exc()
            
            return Response(
                {"error": "Failed to create ride", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

# ------------------- AVAILABLE DRIVERS VIEW -------------------
class AvailableDriversView(generics.ListAPIView):
    """
    API endpoint that returns available drivers.
    """
    serializer_class = DriverProfileSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        # Debug: Print all drivers in the database
        all_drivers = DriverProfile.objects.all()
        print(f"=== DEBUG: Total drivers in database: {all_drivers.count()} ===")
        
        # Print details of each driver
        for driver in all_drivers:
            print(f"Driver ID: {driver.id}, Name: {driver.full_name}, Status: '{driver.status}', Phone: {driver.phone_number}")
            print(f"User: {driver.user.email if driver.user else 'No user linked'}, is_driver: {driver.user.is_driver if driver.user else 'N/A'}")
            print("-" * 40)
        
        # Try to get drivers with expected statuses
        available_drivers = DriverProfile.objects.filter(status__in=['available', 'online', 'active'])
        print(f"=== DEBUG: Drivers with expected status: {available_drivers.count()} ===")
        
        # If no drivers have expected status, return all drivers for debugging
        if not available_drivers.exists():
            print("=== DEBUG: No drivers with expected status, returning all drivers ===")
            return all_drivers
        
        return available_drivers
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        response_data = {
            'count': queryset.count(),
            'drivers': serializer.data
        }
        
        # Add debug information
        if queryset.count() == 0:
            response_data['debug'] = "No drivers found in database"
        else:
            response_data['debug'] = f"Found {queryset.count()} drivers"
        
        return Response(response_data)

# ------------------- DEBUG DRIVERS VIEW -------------------
class DebugDriversView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        # Get all drivers
        all_drivers = DriverProfile.objects.all()
        
        # Get driver statuses
        statuses = DriverProfile.objects.values_list('status', flat=True)
        
        # Prepare detailed driver information
        driver_details = []
        for driver in all_drivers:
            driver_info = {
                'id': driver.id,
                'full_name': driver.full_name,
                'status': driver.status,
                'phone_number': driver.phone_number,
                'city': driver.city,
                'user_id': driver.user.id if driver.user else None,
                'user_email': driver.user.email if driver.user else None,
                'user_is_driver': driver.user.is_driver if driver.user else None,
                'user_is_active': driver.user.is_active if driver.user else None,
            }
            driver_details.append(driver_info)
        
        return Response({
            'total_drivers': all_drivers.count(),
            'unique_statuses': list(set(statuses)),
            'all_statuses': list(statuses),
            'drivers': driver_details
        })

class SignupView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        data = request.data
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return Response(
                {"message": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.create(
                email=email,
                password=make_password(password),
                is_driver=data.get('is_driver', False),
                is_client=data.get('is_client', False)
            )
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'is_active': user.is_active,  # Added is_active field
                'next_step': 'verify_otp' if not user.is_active else 'set_user_type'
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"message": "Signup failed", "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# ------------------- OTP -------------------
class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'success': False, 'message': 'Email is required'}, status=400)
        otp = str(random.randint(100000, 999999))
        EmailOTP.objects.create(email=email, otp=otp)
        send_mail(
            subject='Your OTP Code',
            message=f'Your OTP code is {otp}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        return Response({'success': True, 'message': 'OTP sent successfully'})

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response({'success': False, 'message': 'Email and OTP are required'}, status=400)

        try:
            otp_obj = EmailOTP.objects.filter(email=email, otp=otp).latest('created_at')

            if hasattr(otp_obj, 'is_expired') and otp_obj.is_expired():
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
                'email': user.email,
                'is_active': user.is_active,  # Added is_active field
                'next_step': 'set_user_type'  # Added next step
            }, status=200)
        except EmailOTP.DoesNotExist:
            return Response({'success': False, 'message': 'Invalid OTP'}, status=400)

# ------------------- SET USER TYPE VIEW -------------------
class SetUserTypeView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def post(self, request):
        user_type = request.data.get('user_type') or request.data.get('type')
        user = request.user
        
        if user_type == 'driver':
            user.is_driver = True
            user.is_client = False
            user.save()
            
            driver_profile, created = DriverProfile.objects.get_or_create(user=user, defaults={
                'full_name': '',
                'age': None,
                'cnic': '',
                'driving_license': '',
                'license_expiry': None,
                'phone_number': '',
                'city': '',
                'status': 'available'
            })
            
            # Generate new tokens with updated user info
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "success": True, 
                "message": "Switched to driver mode",
                "is_driver": True,
                "is_client": False,
                "is_active": user.is_active,  # Added is_active field
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "profile_id": driver_profile.id,
                "next_step": "grant_location"  # Added next step for drivers
            }, status=200)
            
        elif user_type == 'client':
            user.is_client = True
            user.is_driver = False
            user.save()
            
            client_profile, created = ClientProfile.objects.get_or_create(user=user, defaults={
                'full_name': '',
                'age': None,
                'cnic': '',
                'phone_number': '',
                'address': ''
            })
            
            # Generate new tokens with updated user info
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "success": True, 
                "message": "Switched to client mode",
                "is_client": True,
                "is_driver": False,
                "is_active": user.is_active,  # Added is_active field
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "profile_id": client_profile.id,
                "next_step": "grant_location"  # Added next step for clients
            }, status=200)
        else:
            return Response(
                {"error": "Invalid user type"}, 
                status=400
            )
            
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    parser_classes = [MultiPartParser, FormParser]
    
    def get(self, request):
        if request.user.is_client:
            # Forward to client profile view
            return ClientProfileView().get(request)
        elif request.user.is_driver:
            # Forward to driver profile view
            return DriverProfileView().get(request)
        else:
            return Response(
                {"error": "User is neither a client nor a driver"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def put(self, request):
        if request.user.is_client:
            # Forward to client profile view
            response = ClientProfileView().put(request)
            # Add next_step to the response
            if response.status_code == 200:
                response_data = response.data
                response_data['next_step'] = 'grant_location'
                return Response(response_data, status=200)
            return response
        elif request.user.is_driver:
            # Forward to driver profile view
            response = DriverProfileView().put(request)
            # Add next_step to the response
            if response.status_code == 200:
                response_data = response.data
                response_data['next_step'] = 'grant_location'
                return Response(response_data, status=200)
            return response
        else:
            return Response(
                {"error": "User is neither a client nor a driver"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

# ------------------- CLIENT PROFILE VIEW -------------------
class ClientProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    parser_classes = [MultiPartParser, FormParser]
    
    def get(self, request):
        # Check if user is a client
        if not request.user.is_client:
            return Response(
                {"error": "User is not a client. Please switch to client mode."}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        profile, created = ClientProfile.objects.get_or_create(user=request.user, defaults={
            'full_name': '',
            'age': None,
            'cnic': '',
            'phone_number': '',
            'address': ''
        })
        
        serializer = ClientProfileSerializer(profile, context={'request': request})
        return Response(serializer.data, status=200)
    
    def put(self, request):
        # Check if user is a client
        if not request.user.is_client:
            return Response(
                {"error": "User is not a client. Please switch to client mode."}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        profile, created = ClientProfile.objects.get_or_create(user=request.user, defaults={
            'full_name': '',
            'age': None,
            'cnic': '',
            'phone_number': '',
            'address': ''
        })
        
        # Handle form data including file uploads
        data = request.data.copy()
        
        # Update fields from form data
        if 'full_name' in data:
            profile.full_name = data['full_name']
        if 'cnic' in data:
            profile.cnic = data['cnic']
        if 'age' in data and data['age']:
            try:
                profile.age = int(data['age'])
            except (ValueError, TypeError):
                profile.age = None
        if 'phone_number' in data:
            # Clean phone number by removing non-digit characters
            phone_number = re.sub(r'[^\d]', '', str(data['phone_number']))
            if 10 <= len(phone_number) <= 15:  # Validate length
                profile.phone_number = phone_number
        if 'address' in data:
            profile.address = data['address']
        
        # Handle profile image upload
        if 'dp' in request.FILES:
            profile.dp = request.FILES['dp']
        
        # Save the profile
        profile.save()
        
        # Serialize and return the updated profile
        serializer = ClientProfileSerializer(profile, context={'request': request})
        return Response(serializer.data, status=200)

# ------------------- DRIVER PROFILE VIEW -------------------
class DriverProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    parser_classes = [MultiPartParser, FormParser]
    
    def get(self, request):
        # Check if user is a driver
        if not request.user.is_driver:
            return Response(
                {"error": "User is not a driver. Please switch to driver mode."}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        profile, created = DriverProfile.objects.get_or_create(user=request.user, defaults={
            'full_name': '',
            'age': None,
            'cnic': '',
            'driving_license': '',
            'license_expiry': None,
            'phone_number': '',
            'city': '',
            'status': 'available'
        })
        
        serializer = DriverProfileSerializer(profile, context={'request': request})
        return Response(serializer.data, status=200)
    
    def put(self, request):
        # Check if user is a driver
        if not request.user.is_driver:
            return Response(
                {"error": "User is not a driver. Please switch to driver mode."}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        profile, created = DriverProfile.objects.get_or_create(user=request.user, defaults={
            'full_name': '',
            'age': None,
            'cnic': '',
            'driving_license': '',
            'license_expiry': None,
            'phone_number': '',
            'city': '',
            'status': 'available'
        })
        
        # Handle form data including file uploads
        data = request.data.copy()
        
        # Update fields from form data
        if 'full_name' in data:
            profile.full_name = data['full_name']
        if 'cnic' in data:
            profile.cnic = data['cnic']
        if 'age' in data and data['age']:
            try:
                profile.age = int(data['age'])
            except (ValueError, TypeError):
                profile.age = None
        if 'phone_number' in data:
            # Clean phone number by removing non-digit characters
            phone_number = re.sub(r'[^\d]', '', str(data['phone_number']))
            if 10 <= len(phone_number) <= 15:  # Validate length
                profile.phone_number = phone_number
        if 'address' in data:
            profile.address = data['address']
        if 'driving_license' in data:
            profile.driving_license = data['driving_license']
        if 'license_expiry' in data and data['license_expiry']:
            # Parse date from YYYY-MM-DD format
            try:
                profile.license_expiry = datetime.strptime(data['license_expiry'], '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {"error": "Invalid license expiry date format. Use YYYY-MM-DD."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        if 'city' in data:
            profile.city = data['city']
        
        # Handle profile image upload
        if 'dp' in request.FILES:
            profile.dp = request.FILES['dp']
        
        # Save the profile
        profile.save()
        
        # Serialize and return the updated profile
        serializer = DriverProfileSerializer(profile, context={'request': request})
        return Response(serializer.data, status=200)

# ------------------- UPDATE DRIVER LOCATION VIEW -------------------
class UpdateDriverLocationView(APIView):
    """
    API endpoint for drivers to update their current latitude and longitude.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def patch(self, request):
        try:
            # Get the logged-in user's driver profile
            profile = DriverProfile.objects.get(user=request.user)
            # Update latitude and longitude from request
            profile.current_latitude = request.data.get('current_latitude')
            profile.current_longitude = request.data.get('current_longitude')
            profile.save()
            return Response(
                {"success": True, "message": "Location updated successfully", "next_step": "driver_home"},
                status=status.HTTP_200_OK
            )
        except DriverProfile.DoesNotExist:
            return Response(
                {"success": False, "error": "Driver profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

# ------------------- UPDATE CLIENT LOCATION VIEW -------------------
class UpdateClientLocationView(APIView):
    """
    API endpoint for clients to update their current latitude and longitude.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def patch(self, request):
        try:
            # Get the logged-in user's client profile
            profile = ClientProfile.objects.get(user=request.user)
            # Update latitude and longitude from request
            profile.latitude = request.data.get('latitude')
            profile.longitude = request.data.get('longitude')
            profile.save()
            return Response(
                {"success": True, "message": "Location updated successfully", "next_step": "live_location"},
                status=status.HTTP_200_OK
            )
        except ClientProfile.DoesNotExist:
            return Response(
                {"success": False, "error": "Client profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

# ------------------- SAVE LOCATION VIEW -------------------
class SaveLocationView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def post(self, request):
        user = request.user
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        
        if latitude is None or longitude is None:
            return Response(
                {"error": "Both latitude and longitude are required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if getattr(user, 'is_client', False):
            profile, _ = ClientProfile.objects.get_or_create(user=user)
            profile.latitude = latitude
            profile.longitude = longitude
            profile.save()
            # For clients, next step is live location
            return Response({
                "success": "Location saved successfully.", 
                "is_active": user.is_active,
                "next_step": "live_location"
            }, status=status.HTTP_200_OK)
        elif getattr(user, 'is_driver', False):
            profile, _ = DriverProfile.objects.get_or_create(user=user)
            profile.current_latitude = latitude
            profile.current_longitude = longitude
            profile.save()
            # For drivers, next step is driver profile
            return Response({
                "success": "Location saved successfully.", 
                "is_active": user.is_active,
                "next_step": "driver_profile"
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "User has no associated profile."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

# ------------------- GET CURRENT LOCATION VIEW -------------------
class GetCurrentLocationView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        user = request.user
        
        if getattr(user, 'is_client', False):
            try:
                profile = ClientProfile.objects.get(user=user)
                if profile.latitude is not None and profile.longitude is not None:
                    return Response({
                        "latitude": profile.latitude,
                        "longitude": profile.longitude,
                        "last_updated": None,  # Client profiles don't have timestamp
                        "is_active": user.is_active,
                        "next_step": "live_location"
                    }, status=status.HTTP_200_OK)
                else:
                    return Response(
                        {"error": "No location data available for this user."}, 
                        status=status.HTTP_404_NOT_FOUND
                    )
            except ClientProfile.DoesNotExist:
                return Response(
                    {"error": "Client profile not found."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        elif getattr(user, 'is_driver', False):
            try:
                profile = DriverProfile.objects.get(user=user)
                if profile.current_latitude is not None and profile.current_longitude is not None:
                    return Response({
                        "latitude": profile.current_latitude,
                        "longitude": profile.current_longitude,
                        "last_updated": profile.last_location_update,
                        "is_active": user.is_active,
                        "next_step": "driver_home"
                    }, status=status.HTTP_200_OK)
                else:
                    return Response(
                        {"error": "No location data available for this user."}, 
                        status=status.HTTP_404_NOT_FOUND
                    )
            except DriverProfile.DoesNotExist:
                return Response(
                    {"error": "Driver profile not found."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            return Response(
                {"error": "User has no associated profile."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

# ------------------- GEOCODE VIEW (IMPROVED) -------------------
def sanitize_cache_key(query):
    # More robust sanitization that handles special characters consistently
    return re.sub(r'[^A-Za-z0-9]', '_', query.strip().lower())

class GeocodeView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        query = request.query_params.get('q', '').strip()
        
        if not query:
            return Response(
                {"error": "Query parameter 'q' is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Normalize the query for consistent caching
        normalized_query = ' '.join(query.split())
        cache_key = f'geocode_{sanitize_cache_key(normalized_query)}'
        
        # Try to get from cache
        cached_response = cache.get(cache_key)
        if cached_response is not None:
            print(f"Cache hit for: {query}")
            return Response(cached_response, status=status.HTTP_200_OK)
        
        print(f"Cache miss for: {query} - Making API request")
        
        # Default coordinates for major cities as fallback
        default_coordinates = {
            'lahore': {'lat': '31.5204', 'lon': '74.3587', 'display_name': 'Lahore, Pakistan'},
            'karachi': {'lat': '24.8607', 'lon': '67.0011', 'display_name': 'Karachi, Pakistan'},
            'islamabad': {'lat': '33.6844', 'lon': '73.0479', 'display_name': 'Islamabad, Pakistan'},
            'rawalpindi': {'lat': '33.6007', 'lon': '73.0679', 'display_name': 'Rawalpindi, Pakistan'},
            'peshawar': {'lat': '34.0151', 'lon': '71.5249', 'display_name': 'Peshawar, Pakistan'},
            'quetta': {'lat': '30.1798', 'lon': '66.9750', 'display_name': 'Quetta, Pakistan'},
            'multan': {'lat': '30.1575', 'lon': '71.5249', 'display_name': 'Multan, Pakistan'},
            'faisalabad': {'lat': '31.4187', 'lon': '73.0791', 'display_name': 'Faisalabad, Pakistan'},
        }
        
        url = 'https://nominatim.openstreetmap.org/search'
        params = {
            'q': normalized_query,
            'format': 'json',
            'limit': 1,
            'addressdetails': 1,
            'extratags': 1,
            'namedetails': 1
        }
        headers = {
            'User-Agent': 'Drivo/1.0 (gdooduii@gmail.com)'
        }
        
        try:
            response = requests.get(url, params=params, headers=headers, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            if data:
                # Cache the entire response for 24 hours
                cache.set(cache_key, data, timeout=86400)  # 24 hours
                print(f"Cached response for: {query}")
                return Response(data, status=status.HTTP_200_OK)
            else:
                # Check if the query matches any of our default cities
                query_lower = normalized_query.lower()
                for city, coords in default_coordinates.items():
                    if city in query_lower:
                        print(f"Using default coordinates for {city}")
                        default_data = [coords]
                        # Cache the default response
                        cache.set(cache_key, default_data, timeout=86400)
                        return Response(default_data, status=status.HTTP_200_OK)
                
                # Cache empty results for 1 hour to avoid repeated API calls
                cache.set(cache_key, [], timeout=3600)
                return Response(
                    {"error": "Location not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except requests.RequestException as e:
            # If external API fails, try to use default coordinates
            query_lower = normalized_query.lower()
            for city, coords in default_coordinates.items():
                if city in query_lower:
                    print(f"API failed, using default coordinates for {city}")
                    default_data = [coords]
                    # Cache the default response
                    cache.set(cache_key, default_data, timeout=86400)
                    return Response(default_data, status=status.HTTP_200_OK)
            
            # Cache errors for 5 minutes to avoid hammering the API
            cache.set(cache_key, {'error': str(e)}, timeout=300)
            return Response(
                {"error": "External API request failed", "details": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

# ------------------- CACHE STATS VIEW -------------------
class CacheStatsView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        from django.core.cache import cache
        
        # Get some basic cache stats (implementation depends on your cache backend)
        try:
            # For LocMemCache
            if hasattr(cache, '_cache'):
                geocode_keys = len([k for k in cache._cache.keys() if k.startswith('geocode')])
                total_keys = len(cache._cache.keys())
            else:
                geocode_keys = "N/A"
                total_keys = "N/A"
                
            stats = {
                'backend': str(cache.__class__),
                'geocode_cache_entries': geocode_keys,
                'total_cache_entries': total_keys,
                'cache_config': {
                    'timeout_default': settings.CACHES.get('default', {}).get('TIMEOUT', 'N/A'),
                    'backend': settings.CACHES.get('default', {}).get('BACKEND', 'N/A')
                }
            }
        except Exception as e:
            stats = {
                'error': str(e),
                'backend': str(cache.__class__)
            }
        
        return Response(stats, status=200)

# ------------------- RESET PASSWORD VIEW -------------------
class ResetPasswordView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def post(self, request):
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')
        
        if not new_password or not confirm_password:
            return Response(
                {"success": False, "message": "Both new_password and confirm_password are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if new_password != confirm_password:
            return Response(
                {"success": False, "message": "Passwords do not match"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = request.user
        user.set_password(new_password)
        user.save()
        
        return Response(
            {"success": True, "message": "Password updated successfully"}, 
            status=status.HTTP_200_OK
        )

# ------------------- CURRENT USER VIEW -------------------
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=200)