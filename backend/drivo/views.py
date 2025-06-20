from rest_framework import viewsets
from drivo.models import User, DriverProfile, ClientProfile
from drivo.serializers import UserSerializer, DriverProfileSerializer, ClientProfileSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class DriverProfileViewSet(viewsets.ModelViewSet):
    queryset = DriverProfile.objects.all()
    serializer_class = DriverProfileSerializer

class ClientProfileViewSet(viewsets.ModelViewSet):
    queryset = ClientProfile.objects.all()
    serializer_class = ClientProfileSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

class SignupView(APIView):
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
           return Response({"message": "User signed up successfully"})