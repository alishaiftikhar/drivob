from rest_framework import serializers
from .models import User, DriverProfile, ClientProfile, Ride, Payment, Review

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'is_driver', 'is_client', 'is_active', 'date_joined']
        read_only_fields = ['id', 'is_active', 'date_joined']


class DriverProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = DriverProfile
        fields = [
            'id', 'user', 'full_name', 'age', 'cnic', 'driving_license',
            'license_expiry', 'phone_number', 'city', 'latitude', 'longitude'
        ]


class ClientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ClientProfile
        fields = [
            'id', 'user', 'full_name', 'cnic', 'age', 'address',
            'phone_number', 'latitude', 'longitude'
        ]


class RideSerializer(serializers.ModelSerializer):
    client = ClientProfileSerializer(read_only=True)
    driver = DriverProfileSerializer(read_only=True)

    class Meta:
        model = Ride
        fields = [
            'id', 'client', 'driver', 'pickup_location', 'dropoff_location',
            'requested_time', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['requested_time', 'created_at', 'updated_at']


class PaymentSerializer(serializers.ModelSerializer):
    ride = RideSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'ride', 'amount', 'payment_method', 'transaction_id', 'payment_date']
        read_only_fields = ['payment_date']


class ReviewSerializer(serializers.ModelSerializer):
    ride = RideSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'ride', 'rating', 'comment', 'created_at']
        read_only_fields = ['created_at']
