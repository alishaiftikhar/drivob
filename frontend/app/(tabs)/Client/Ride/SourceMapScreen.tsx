// File: SourceMapScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useRide } from './RideContext'; // Ensure correct context path

const SourceMapScreen = () => {
  const router = useRouter();
  const { setSource } = useRide();

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [formattedAddress, setFormattedAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleMapPress = async (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    setLoading(true);

    try {
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = addressResponse[0];
      const formatted = `${address.name || ''}, ${address.city || ''}, ${address.region || ''}, ${address.country || ''}`;
      setFormattedAddress(formatted);
    } catch (error) {
      setFormattedAddress('Unknown address');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation && formattedAddress) {
      setSource({
        ...selectedLocation,
        address: formattedAddress,
      });
      router.push('/(tabs)/Client/Ride/RideDetails');
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
          <Marker coordinate={selectedLocation} title="Source Location" />
        )}
      </MapView>

      {selectedLocation && !loading && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>
            {formattedAddress || 'Confirm Source'}
          </Text>
        </TouchableOpacity>
      )}

      {loading && (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color="#FF5722"
        />
      )}
    </View>
  );
};

export default SourceMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  confirmButton: {
    position: 'absolute',
    bottom: 40,
    left: 30,
    right: 30,
    backgroundColor: '#673AB7',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 7,
  },
  confirmText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  loader: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
  },
});
