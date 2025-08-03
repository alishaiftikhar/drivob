import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MyButton from '@/components/MyButton';

const perHourDriverRate = 300;

const MapDistanceScreen = () => {
  const router = useRouter();
  const {
    sourceLat,
    sourceLng,
    destLat,
    destLng,
    vehicleType,
    fuelType,
  } = useLocalSearchParams<{
    sourceLat: string;
    sourceLng: string;
    destLat: string;
    destLng: string;
    vehicleType: string;
    fuelType: string;
  }>();

  const source = {
    latitude: parseFloat(sourceLat),
    longitude: parseFloat(sourceLng),
  };

  const destination = {
    latitude: parseFloat(destLat),
    longitude: parseFloat(destLng),
  };

  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [crossCountry, setCrossCountry] = useState(false);

  const fetchRoute = async () => {
    try {
      const url = `http://router.project-osrm.org/route/v1/driving/${source.longitude},${source.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.routes || data.routes.length === 0) {
        throw new Error('No route found');
      }

      const route = data.routes[0];
      setDistance(route.distance / 1000); // meters to km
      setDuration(route.duration / 60); // seconds to mins
      setRouteCoords(
        route.geometry.coordinates.map(([lng, lat]: [number, number]) => ({
          latitude: lat,
          longitude: lng,
        }))
      );

      // ✅ Real Country Validation using OpenStreetMap (Nominatim)
      const [srcRes, dstRes] = await Promise.all([
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${source.latitude}&lon=${source.longitude}&zoom=3&addressdetails=1`),
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${destination.latitude}&lon=${destination.longitude}&zoom=3&addressdetails=1`),
      ]);

      const [srcData, dstData] = await Promise.all([srcRes.json(), dstRes.json()]);

      const srcCountry = srcData?.address?.country;
      const dstCountry = dstData?.address?.country;

      console.log('📍 Source Country:', srcCountry);
      console.log('📍 Destination Country:', dstCountry);

      if (!srcCountry || !dstCountry) {
        Alert.alert('Error', 'Could not determine country information.');
      }

      setCrossCountry(srcCountry !== dstCountry);
    } catch (err) {
      Alert.alert('Error', 'Could not fetch route or country data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, []);

  const driverPayment = (duration / 60) * perHourDriverRate;

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="purple" />
        <Text style={styles.loaderText}>Calculating route...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: source.latitude,
          longitude: source.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker coordinate={source} title="Source" pinColor="green" />
        <Marker coordinate={destination} title="Destination" pinColor="red" />
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeColor="blue" strokeWidth={5} />
        )}
      </MapView>

      <View style={styles.summaryBox}>
        {crossCountry ? (
          <Text style={styles.errorText}>
            ❌ Source and Destination must be in the same country.
          </Text>
        ) : (
          <>
            <Text style={styles.rideInfo}>📏 Distance: {distance.toFixed(2)} km</Text>
            <Text style={styles.rideInfo}>⏱️ Estimated Time: {duration.toFixed(1)} mins</Text>
            <Text style={styles.rideInfo}>💰 Driver Payment: Rs. {driverPayment.toFixed(0)}</Text>
            <MyButton title="Done" onPress={() => router.push('/(tabs)/Client/DriverList')} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 18,
    color: 'purple',
  },
  summaryBox: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  rideInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginVertical: 5,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default MapDistanceScreen;
