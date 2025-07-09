import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import MyButton from '@/components/MyButton';
import Colors from '@/constants/Color';
import { useRouter } from 'expo-router';
import BackgroundOne from '@/components/BackgroundDesign';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCkreU2c_ffAc-erK2xe42PCjxhpBrJRTs'; // Paste your real key here

const RideDetail = () => {
  const router = useRouter();

  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [rideType, setRideType] = useState('');
  const [rideDuration, setRideDuration] = useState('');

  const getCoordinates = async (place: string) => {
    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: place,
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );

      const loc = res.data.results[0]?.geometry?.location;
      return loc ? { latitude: loc.lat, longitude: loc.lng } : null;
    } catch (err) {
      console.error('Geocode error:', err);
      return null;
    }
  };

  const handleSave = async () => {
    if (!source || !destination) {
      Alert.alert('Error', 'Please enter both source and destination.');
      return;
    }

    const sourceCoords = await getCoordinates(source);
    const destCoords = await getCoordinates(destination);

    if (!sourceCoords) {
      Alert.alert('Invalid Source', 'Google Maps could not find the source location.');
      return;
    }

    if (!destCoords) {
      Alert.alert('Invalid Destination', 'Google Maps could not find the destination location.');
      return;
    }

    router.push({
      pathname: '/(tabs)/Client/MapDistanceScreen',
      params: {
        sourceLat: sourceCoords.latitude.toString(),
        sourceLng: sourceCoords.longitude.toString(),
        destLat: destCoords.latitude.toString(),
        destLng: destCoords.longitude.toString(),
        date,
        time,
        vehicleType,
        fuelType,
        rideType,
        rideDuration,
      },
    });
  };

  return (
    <BackgroundOne text="Ride Details">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.row}>
          <TextInput placeholder="Source" value={source} onChangeText={setSource} style={[styles.input, styles.inputHalf]} />
          <TextInput placeholder="Destination" value={destination} onChangeText={setDestination} style={[styles.input, styles.inputHalf]} />
        </View>

        <View style={styles.row}>
          <TextInput placeholder="Date" value={date} onChangeText={setDate} style={[styles.input, styles.inputHalf]} />
          <TextInput placeholder="Time" value={time} onChangeText={setTime} style={[styles.input, styles.inputHalf]} />
        </View>

        <View style={styles.row}>
          <TextInput placeholder="Vehicle Type" value={vehicleType} onChangeText={setVehicleType} style={[styles.input, styles.inputHalf]} />
          <TextInput placeholder="Fuel Type" value={fuelType} onChangeText={setFuelType} style={[styles.input, styles.inputHalf]} />
        </View>

        <View style={styles.row}>
          <TextInput placeholder="Ride Type" value={rideType} onChangeText={setRideType} style={[styles.input, styles.inputHalf]} />
          <TextInput placeholder="Duration" value={rideDuration} onChangeText={setRideDuration} style={[styles.input, styles.inputHalf]} />
        </View>

        <View style={styles.buttonWrapper}>
          <MyButton title="Save Details" onPress={handleSave} />
        </View>
      </ScrollView>
    </BackgroundOne>
  );
};

export default RideDetail;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 10,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  inputHalf: {
    width: '48%',
  },
  buttonWrapper: {
    marginTop: 30,
    marginBottom: 50,
  },
});
