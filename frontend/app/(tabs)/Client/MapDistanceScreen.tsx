import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import MyButton from '@/components/MyButton';
import Colors from '@/constants/Color';

const fuelRates: Record<string, number> = {
  Petrol: 280,
  Diesel: 265,
  Electric: 20,
};

const vehicleMultiplier: Record<string, number> = {
  Car: 1.2,
  Bike: 0.6,
  Rickshaw: 0.9,
};

const MapDistanceScreen = () => {
  const router = useRouter();
  const {
    sourceLat,
    sourceLng,
    destLat,
    destLng,
    fuelType,
    vehicleType,
    time,
  } = useLocalSearchParams();

  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationMin, setDurationMin] = useState<number | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [shortestRouteCoords, setShortestRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [longestRouteCoords, setLongestRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const source = {
    latitude: parseFloat(sourceLat as string),
    longitude: parseFloat(sourceLng as string),
  };

  const destination = {
    latitude: parseFloat(destLat as string),
    longitude: parseFloat(destLng as string),
  };

  const timeStr = Array.isArray(time) ? time[0] : time || '';
  const isNight =
    timeStr.toLowerCase().includes('pm') ||
    Number(timeStr.split(':')[0]) >= 21;

  const calculatePrice = (km: number): number => {
    const base = fuelRates[fuelType as string] || 250;
    const multiplier = vehicleMultiplier[vehicleType as string] || 1;
    const nightFactor = isNight ? 1.25 : 1;
    return Math.round(km * base * multiplier * nightFactor);
  };

  const fetchRoutes = async () => {
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${source.longitude},${source.latitude};${destination.longitude},${destination.latitude}`,
        {
          params: {
            overview: 'full',
            alternatives: true,
            geometries: 'geojson',
          },
        }
      );

      const routes = response.data.routes;
      if (!routes || routes.length === 0) {
        throw new Error('No routes found');
      }

      const sortedRoutes = [...routes].sort((a, b) => a.distance - b.distance);
      const shortest = sortedRoutes[0];
      const longest = sortedRoutes[sortedRoutes.length - 1];

      const km = shortest.distance / 1000;
      const min = shortest.duration / 60;

      setDistanceKm(km);
      setDurationMin(min);
      setEstimatedPrice(calculatePrice(km));

      setShortestRouteCoords(
        shortest.geometry.coordinates.map(([lng, lat]: number[]) => ({
          latitude: lat,
          longitude: lng,
        }))
      );

      setLongestRouteCoords(
        longest.geometry.coordinates.map(([lng, lat]: number[]) => ({
          latitude: lat,
          longitude: lng,
        }))
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleDone = () => {
    router.push('/(tabs)/Client/DriverList');
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 12, fontSize: 16, color: Colors.primary }}>
          Finding the best route...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: source.latitude,
          longitude: source.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        <Marker coordinate={source} title="Source" pinColor="green" />
        <Marker coordinate={destination} title="Destination" pinColor="red" />
        {longestRouteCoords.length > 0 && (
          <Polyline coordinates={longestRouteCoords} strokeColor="green" strokeWidth={3} />
        )}
        {shortestRouteCoords.length > 0 && (
          <Polyline coordinates={shortestRouteCoords} strokeColor="red" strokeWidth={4} />
        )}
      </MapView>

      <View style={styles.detailsBox}>
        <Text style={styles.detailText}>📏 Distance: {distanceKm?.toFixed(2)} KM</Text>
        <Text style={styles.detailText}>⏱ Duration: {durationMin?.toFixed(0)} min</Text>
        <Text style={styles.detailText}>💸 Payment: Rs. {estimatedPrice}</Text>
      </View>

      <View style={styles.buttonBox}>
        <MyButton title="Done" onPress={handleDone} />
      </View>
    </View>
  );
};

export default MapDistanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  map: {
    flex: 1,
  },
  detailsBox: {
    position: 'absolute',
    bottom: 80,
    left: 15,
    right: 15,
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  detailText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.primary,
  },
  buttonBox: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
