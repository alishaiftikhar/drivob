import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import MyButton from '@/components/MyButton';
import * as SecureStore from 'expo-secure-store';
import api from '@/constants/apiConfig'; // Use axios instance

type Coords = {
  latitude: number;
  longitude: number;
};

const LiveLocation = () => {
  const [location, setLocation] = useState<Coords | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const storedToken = await SecureStore.getItemAsync('userToken');
      if (!storedToken) {
        Alert.alert('Authentication Error', 'You are not logged in. Please login again.');
        router.replace('/OTP'); // Redirect to login/OTP
        return;
      }
      setToken(storedToken);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({});

      setLocation({ latitude, longitude });
      setLoading(false);
    })();
  }, [router]);

  const saveLocationToDB = async () => {
    if (!token || !location) {
      Alert.alert('Error', 'Location or token missing.');
      return;
    }

    try {
      await api.post(
        '/save-location/',
        {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Success', 'Location saved successfully');
      router.push('/(tabs)/Client/Ride/RideDetails');
    } catch (error: any) {
      console.log('Error saving location:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to save location');
    }
  };

  if (loading || !location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        showsUserLocation
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={location} title="You are here" />
      </MapView>

      <View style={styles.buttonContainer}>
        <MyButton title="Save Location" onPress={saveLocationToDB} />
      </View>
    </View>
  );
};

export default LiveLocation;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
});
