import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';

// Type for location coordinates
type Coordinates = {
  latitude: number;
  longitude: number;
};

const RideTracking = () => {
  const [region, setRegion] = useState<Region | null>(null);
  const [driverLocation, setDriverLocation] = useState<Coordinates | null>(null);
  const [clientLocation, setClientLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const userLat = location.coords.latitude;
      const userLng = location.coords.longitude;

      setRegion({
        latitude: userLat,
        longitude: userLng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      // Simulated driver and client positions
      setDriverLocation({
        latitude: userLat + 0.01,
        longitude: userLng + 0.01,
      });

      setClientLocation({
        latitude: userLat - 0.01,
        longitude: userLng - 0.01,
      });

      setLoading(false);
    })();
  }, []);

  if (loading || !region || !driverLocation || !clientLocation) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4B7BEC" />
        <Text style={{ marginTop: 10 }}>Loading Ride Tracking...</Text> {/* ✅ Fixed */}
      </View>
    );
  }

  return (
    <MapView style={styles.map} initialRegion={region}>
      <Marker coordinate={driverLocation} title="Driver" pinColor="green" />
      <Marker coordinate={clientLocation} title="Client" pinColor="blue" />
    </MapView>
  );
};

export default RideTracking;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
