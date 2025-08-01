import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useRide } from './RideContext';

const DestinationMapScreen = () => {
  const router = useRouter();
  const { setDestination } = useRide();

  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [formattedAddress, setFormattedAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  // Ask for location permission on mount
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to select destination.');
        return;
      }
      setLocationPermissionGranted(true);
    };

    requestPermission();
  }, []);

  const handleMapPress = async (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });

    setLoading(true);
    try {
      const addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addressResponse.length > 0) {
        const addr = addressResponse[0];
        const formatted = `${addr.name || ''}, ${addr.city || ''}, ${addr.region || ''}, ${addr.country || ''}`.trim();
        setFormattedAddress(formatted);
      } else {
        setFormattedAddress('Address not found');
      }
    } catch (error) {
      setFormattedAddress('Unknown address');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation && formattedAddress) {
      setDestination({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        address: formattedAddress,
      });
      router.push('/(tabs)/Client/Ride/RideDetails');
    } else {
      Alert.alert('Incomplete Selection', 'Please select a destination on the map.');
    }
  };

  return (
    <View style={styles.container}>
      {locationPermissionGranted ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 31.5204,
            longitude: 74.3587,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={handleMapPress}
        >
          {selectedLocation && (
            <Marker coordinate={selectedLocation} title="Selected Destination" />
          )}
        </MapView>
      ) : (
        <View style={styles.permissionWarning}>
          <Text style={styles.warningText}>Waiting for location permission...</Text>
        </View>
      )}

      {selectedLocation && !loading && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.buttonText}>{formattedAddress || 'Confirm Destination'}</Text>
        </TouchableOpacity>
      )}

      {loading && (
        <ActivityIndicator style={styles.loader} size="large" color="#FF5722" />
      )}
    </View>
  );
};

export default DestinationMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  confirmButton: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    backgroundColor: '#FF5722',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loader: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
  },
  permissionWarning: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 16,
    color: '#555',
  },
});
