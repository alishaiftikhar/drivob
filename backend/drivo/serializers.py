from rest_framework import serializers
from drivo.models import User, DriverProfile, ClientProfile, Ride, Payment, Review


class UserSerializer(serializers.ModelSerializer):
    is_driver = serializers.BooleanField(required=False, default=False)
    is_client = serializers.BooleanField(required=False, default=False)

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'is_driver', 'is_client']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # hash password
        user.save()
        return user


class DriverProfileSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = DriverProfile
        fields = '__all__'
        extra_kwargs = {
            'user': {'read_only': True},
        }

    def update(self, instance, validated_data):
        # update each field individually to ensure save works well
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class ClientProfileSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = ClientProfile
        fields = ['id', 'user', 'full_name', 'cnic', 'age', 'address', 'phone_number', 'dp', 'latitude', 'longitude']
        extra_kwargs = {
            'user': {'read_only': True},
        }


# serializers.py
from rest_framework import serializers
from .models import Ride

class RideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ride
        fields = '__all__'
        read_only_fields = ('client', 'driver', 'status', 'created_at')


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
