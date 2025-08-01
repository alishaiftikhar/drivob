import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MyButton from '@/components/MyButton';

const fuelRates = {
  Petrol: 280,
  Diesel: 265,
  Electric: 20,
};

const vehicleMultiplier = {
  Car: 1.2,
  Bike: 0.6,
  Rickshaw: 0.9,
};

type FuelType = keyof typeof fuelRates;
type VehicleType = keyof typeof vehicleMultiplier;

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
    } catch (err) {
      Alert.alert('Error', 'Could not fetch route. Try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, []);

  const validFuelType: FuelType = fuelType in fuelRates ? (fuelType as FuelType) : 'Petrol';
  const validVehicleType: VehicleType = vehicleType in vehicleMultiplier ? (vehicleType as VehicleType) : 'Car';

  const fuelRate = fuelRates[validFuelType];
  const multiplier = vehicleMultiplier[validVehicleType];
  const estimatedCost = distance * fuelRate * multiplier;
  const driverPayment = estimatedCost * 0.7; // Assuming driver gets 70%

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
        <Marker coordinate={source} title="Source Location" pinColor="green" />
        <Marker coordinate={destination} title="Destination" pinColor="red" />
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeColor="blue" strokeWidth={5} />
        )}
      </MapView>

      {/* Detail Section */}
      <View style={styles.detailContainer}>
        <Text style={styles.heading}>Ride Summary</Text>

        <Text style={styles.label}>🚩 Source:</Text>
        <Text style={styles.value}>
          Latitude: {source.latitude.toFixed(4)}, Longitude: {source.longitude.toFixed(4)}
        </Text>

        <Text style={styles.label}>🏁 Destination:</Text>
        <Text style={styles.value}>
          Latitude: {destination.latitude.toFixed(4)}, Longitude: {destination.longitude.toFixed(4)}
        </Text>

        <Text style={styles.label}>📏 Distance:</Text>
        <Text style={styles.value}>{distance.toFixed(2)} km</Text>

        <Text style={styles.label}>⏱️ Estimated Time:</Text>
        <Text style={styles.value}>{duration.toFixed(1)} mins</Text>

        <Text style={styles.label}>💰 Estimated Driver Payment:</Text>
        <Text style={styles.value}>Rs. {driverPayment.toFixed(0)}</Text>

        <View style={{ marginTop: 15 }}>
          <MyButton title="Done" onPress={() => router.push('/(tabs)/Client/DriverList')} />
        </View>
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
  detailContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 8,
  },
  value: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MapDistanceScreen;
