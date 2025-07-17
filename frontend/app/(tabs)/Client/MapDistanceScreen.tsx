import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import MyButton from '@/components/MyButton';
import Colors from '@/constants/Color';

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace it

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

  const [distance, setDistance] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const source = {
    latitude: parseFloat(sourceLat as string),
    longitude: parseFloat(sourceLng as string),
  };

  const destination = {
    latitude: parseFloat(destLat as string),
    longitude: parseFloat(destLng as string),
  };

  const isNight = time?.toLowerCase().includes('pm') || Number(time?.split(':')[0]) >= 21;

  const getDistanceAndPrice = async () => {
    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json`,
        {
          params: {
            origin: `${source.latitude},${source.longitude}`,
            destination: `${destination.latitude},${destination.longitude}`,
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );

      const distanceInMeters = res.data.routes[0]?.legs[0]?.distance?.value || 0;
      const distanceInKm = distanceInMeters / 1000;
      setDistance(distanceInKm);

      // Simulated fuel rates (you can fetch from API)
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

      const baseRate = fuelRates[fuelType as string] || 250;
      const multiplier = vehicleMultiplier[vehicleType as string] || 1;
      const nightSurcharge = isNight ? 1.25 : 1;

      const total = distanceInKm * baseRate * multiplier * nightSurcharge;
      setPrice(Math.round(total));
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getDistanceAndPrice();
  }, []);

  const handleDone = () => {
    router.push('/(tabs)/Client/DriverList');
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10 }}>Calculating route...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: source.latitude,
          longitude: source.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker coordinate={source} title="Source" />
        <Marker coordinate={destination} title="Destination" />
        <Polyline
          coordinates={[source, destination]}
          strokeColor="red"
          strokeWidth={4}
        />
      </MapView>

      <View style={styles.detailsBox}>
        <Text style={styles.detailText}>📍 Distance: {distance?.toFixed(2)} KM</Text>
        <Text style={styles.detailText}>💰 Payment: Rs. {price}</Text>
        <MyButton title="Done" onPress={handleDone} />
      </View>
    </View>
  );
};

export default MapDistanceScreen;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  detailsBox: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    elevation: 10,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  detailText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.primary,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
