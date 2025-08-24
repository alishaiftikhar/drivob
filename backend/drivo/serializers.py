from rest_framework import serializers
from .models import User, DriverProfile, ClientProfile, Ride, Payment, Review
from decimal import Decimal
import os
import re

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'is_client', 'is_driver', 'is_active', 'date_joined']
        read_only_fields = ['id', 'is_active', 'date_joined']

class PhoneNumberField(serializers.CharField):
    """Custom phone number field that formats and validates phone numbers"""
    
    def to_internal_value(self, data):
        # Remove all non-digit characters
        phone_number = re.sub(r'[^\d]', '', str(data))
        
        # Validate length (assuming 10-15 digits is valid)
        if len(phone_number) < 10 or len(phone_number) > 15:
            raise serializers.ValidationError("Phone number must be between 10 and 15 digits")
        
        return phone_number
    
    def to_representation(self, value):
        # Format the phone number for display
        if not value:
            return ""
        
        # Remove all non-digit characters
        digits = re.sub(r'[^\d]', '', str(value))
        
        # Format based on length
        if len(digits) == 10:
            return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
        elif len(digits) == 11:
            return f"{digits[0]} ({digits[1:4]}) {digits[4:7]}-{digits[7:]}"
        else:
            # For other lengths, just return with spaces
            formatted = ""
            for i, digit in enumerate(digits):
                if i > 0 and i % 3 == 0:
                    formatted += " "
                formatted += digit
            return formatted

class DriverProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    phone_number = PhoneNumberField(required=False, allow_blank=True)
    
    # Custom field to return full URL for profile image
    dp_url = serializers.SerializerMethodField()
    
    class Meta:
        model = DriverProfile
        fields = [
            'id', 'user', 'full_name', 'cnic', 'age', 'driving_license',
            'license_expiry', 'phone_number', 'city', 'status', 'dp',
            'current_latitude', 'current_longitude', 'last_location_update', 'dp_url'
        ]
        read_only_fields = ['id', 'user', 'status', 'last_location_update']
    
    def get_dp_url(self, obj):
        request = self.context.get('request')
        dp = obj.dp
        
        # Check if dp exists and has a name (meaning it's a file)
        if dp and hasattr(dp, 'name') and dp.name:
            # Get the URL of the image
            dp_url = dp.url
            if dp_url:
                # If it's already a full URL, return it
                if dp_url.startswith('http'):
                    return dp_url
                # Otherwise, construct the full URL using the request
                if request:
                    return request.build_absolute_uri(dp_url)
                # If no request context, return the URL as is
                return dp_url
        return None

class ClientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    phone_number = PhoneNumberField(required=False, allow_blank=True)
    
    # Custom field to return full URL for profile image
    dp_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ClientProfile
        fields = [
            'id', 'user', 'full_name', 'cnic', 'age', 'phone_number',
            'address', 'dp', 'latitude', 'longitude', 'dp_url'
        ]
        read_only_fields = ['id', 'user']
    
    def get_dp_url(self, obj):
        request = self.context.get('request')
        dp = obj.dp
        
        # Check if dp exists and has a name (meaning it's a file)
        if dp and hasattr(dp, 'name') and dp.name:
            # Get the URL of the image
            dp_url = dp.url
            if dp_url:
                # If it's already a full URL, return it
                if dp_url.startswith('http'):
                    return dp_url
                # Otherwise, construct the full URL using the request
                if request:
                    return request.build_absolute_uri(dp_url)
                # If no request context, return the URL as is
                return dp_url
        return None

class RideSerializer(serializers.ModelSerializer):
    client = ClientProfileSerializer(read_only=True)
    driver = DriverProfileSerializer(read_only=True)
    
    # Update these fields to allow more digits before the decimal point
    pickup_latitude = serializers.DecimalField(
        max_digits=12, 
        decimal_places=8,
        coerce_to_string=False,
        required=False,
        allow_null=True
    )
    pickup_longitude = serializers.DecimalField(
        max_digits=12, 
        decimal_places=8,
        coerce_to_string=False,
        required=False,
        allow_null=True
    )
    dropoff_latitude = serializers.DecimalField(
        max_digits=12, 
        decimal_places=8,
        coerce_to_string=False,
        required=False,
        allow_null=True
    )
    dropoff_longitude = serializers.DecimalField(
        max_digits=12, 
        decimal_places=8,
        coerce_to_string=False,
        required=False,
        allow_null=True
    )
    
    # Fuel type with case-insensitive handling
    fuel_type = serializers.CharField(max_length=20, required=False, allow_null=True)
    
    # Trip type with case-insensitive handling
    trip_type = serializers.CharField(max_length=20, required=False)
    
    def validate_fuel_type(self, value):
        if value is None:
            return None
        # Convert to lowercase for case insensitivity
        value = value.lower()
        valid_choices = ['petrol', 'diesel', 'cng', 'electric', 'hybrid']
        if value not in valid_choices:
            raise serializers.ValidationError(f"Valid options are: {', '.join(valid_choices)}")
        return value
    
    def validate_trip_type(self, value):
        # Convert to lowercase and normalize
        value = value.lower().replace('_', '-')
        # Handle both "1-way" and "one-way" formats
        if value == '1-way':
            value = 'one-way'
        elif value == '2-way':
            value = 'round-trip'  # Assuming 2-way means round-trip
        
        valid_choices = ['one-way', 'round-trip']
        if value not in valid_choices:
            raise serializers.ValidationError(f"Valid options are: {', '.join(valid_choices)}")
        return value
    
    def validate(self, data):
        # Ensure coordinates are properly converted to Decimal if they exist
        if 'pickup_latitude' in data and data['pickup_latitude'] is not None:
            data['pickup_latitude'] = round(Decimal(str(data['pickup_latitude'])), 8)
        if 'pickup_longitude' in data and data['pickup_longitude'] is not None:
            data['pickup_longitude'] = round(Decimal(str(data['pickup_longitude'])), 8)
        if 'dropoff_latitude' in data and data['dropoff_latitude'] is not None:
            data['dropoff_latitude'] = round(Decimal(str(data['dropoff_latitude'])), 8)
        if 'dropoff_longitude' in data and data['dropoff_longitude'] is not None:
            data['dropoff_longitude'] = round(Decimal(str(data['dropoff_longitude'])), 8)
        return data
    
    class Meta:
        model = Ride
        fields = [
            'id', 'client', 'driver', 'pickup_location', 'dropoff_location',
            'pickup_latitude', 'pickup_longitude', 'dropoff_latitude', 'dropoff_longitude',
            'scheduled_datetime', 'vehicle_type', 'fuel_type', 'trip_type',
            'status', 'created_at', 'fare'
        ]
        read_only_fields = ['id', 'client', 'driver', 'status', 'created_at', 'fare']

class PaymentSerializer(serializers.ModelSerializer):
    client = ClientProfileSerializer(read_only=True)
    
    class Meta:
        model = Payment
        fields = ['id', 'ride', 'client', 'amount', 'method', 'status', 'created_at']
        read_only_fields = ['id', 'client', 'created_at']

class ReviewSerializer(serializers.ModelSerializer):
    client = ClientProfileSerializer(read_only=True)
    driver = DriverProfileSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'client', 'driver', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'client', 'driver', 'created_at']