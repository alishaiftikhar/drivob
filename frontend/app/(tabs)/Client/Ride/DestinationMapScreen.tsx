import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

const DestinationMapScreen = () => {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleConfirm = async () => {
    if (selectedLocation) {
      setLoading(true);
      try {
        const addressResponse = await Location.reverseGeocodeAsync({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        });

        const address = addressResponse[0];
        const formattedAddress = `${address.name || ''}, ${address.city || ''}, ${address.region || ''}, ${address.country || ''}`;

        router.push({
          pathname: '/(tabs)/Client/Ride/RideDetails',
          params: {
            destinationLat: selectedLocation.latitude.toString(),
            destinationLng: selectedLocation.longitude.toString(),
            destinationAddress: formattedAddress,
          },
        });
      } catch (error) {
        alert('Failed to get address');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
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

      {selectedLocation && !loading && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm Destination</Text>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator style={styles.loader} size="large" color="#FF5722" />}
    </View>
  );
};

export default DestinationMapScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  confirmButton: {
    position: 'absolute',
    bottom: 40,
    left: 50,
    right: 50,
    backgroundColor: '#FF5722',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
  },
});
