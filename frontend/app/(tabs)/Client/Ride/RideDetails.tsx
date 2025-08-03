import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
  TouchableWithoutFeedback, Keyboard, TextInput, StyleSheet, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import MyButton from '@/components/MyButton';
import Colors from '@/constants/Color';


import BottomIcons from '../Icons/BottomIcons';
import MenuNavigation from '../MenuOptions/Manunavigation';



import { useRide } from './RideContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

const getCoordinatesFromAddress = async (address: string) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.length > 0) {
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  }
  throw new Error('Address not found');
};

const RideDetail = () => {
  const router = useRouter();
  const {
    source, setSource,
    destination, setDestination,
    date, setDate,
    time, setTime,
  } = useRide();

  const [vehicleType, setVehicleType] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [rideType, setRideType] = useState('');
  const [fuelOptionsVisible, setFuelOptionsVisible] = useState(false);
  const [rideOptionsVisible, setRideOptionsVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const fuelOptions = ['Petrol', 'CNG', 'Diesel'];
  const rideOptions = ['1-Way', '2-Way'];

  const getAddressString = (loc: any) => typeof loc === 'string' ? loc : loc?.address || '';

  const isValidDate = (d: string) => {
    const dt = new Date(d);
    return d && dt.toString() !== 'Invalid Date' && dt >= new Date();
  };

  const isValidTime = (t: string) =>
    /^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/i.test(t);

  const handleSave = async () => {
    if (!source || !destination) {
      return Alert.alert('Error', 'Please enter both source & destination.');
    }

    const srcAddress = getAddressString(source);
    const destAddress = getAddressString(destination);

    if (srcAddress.trim().toLowerCase() === destAddress.trim().toLowerCase()) {
      return Alert.alert('Error', 'Source and destination must be different.');
    }

    if (!isValidDate(date)) {
      return Alert.alert('Invalid Date', 'Choose future date.');
    }

    if (!isValidTime(time)) {
      return Alert.alert('Invalid Time', 'Use HH:MM AM/PM.');
    }

    if (!vehicleType || !fuelType || !rideType) {
      return Alert.alert('Missing Info', 'Fill all fields.');
    }

    try {
      const sourceCoords =
        source.latitude && source.longitude
          ? source
          : await getCoordinatesFromAddress(srcAddress);

      const destCoords =
        destination.latitude && destination.longitude
          ? destination
          : await getCoordinatesFromAddress(destAddress);

      router.push({
        pathname: '/(tabs)/Client/MapDistanceScreen',
        params: {
          sourceLat: sourceCoords.latitude.toString(),
          sourceLng: sourceCoords.longitude.toString(),
          destLat: destCoords.latitude.toString(),
          destLng: destCoords.longitude.toString(),
          fuelType,
          vehicleType,
          time,
        },
      });
    } catch (error) {
      Alert.alert('Location Error', 'Could not fetch coordinates for given addresses.');
    }
  };

  const toggleSidebar = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setFuelOptionsVisible(false); setRideOptionsVisible(false); if (menuOpen) toggleSidebar(); }}>
      <View style={styles.container}>
        {/* Header with menu icon */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Ride Details</Text>
          <TouchableOpacity onPress={toggleSidebar}>
            <Text style={{ color: Colors.primary, fontSize: 18 }}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Scroll content */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/Client/Ride/SourceMapScreen')} style={styles.roundInput}>
            <Text style={source ? styles.dropdownText : styles.dropdownPlaceholder}>
              {getAddressString(source) || 'Select Source on Map'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(tabs)/Client/Ride/DestinationMapScreen')} style={styles.roundInput}>
            <Text style={destination ? styles.dropdownText : styles.dropdownPlaceholder}>
              {getAddressString(destination) || 'Select Destination on Map'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(tabs)/Client/Ride/DatePickerScreen')} style={styles.roundInput}>
            <Text style={date ? styles.dropdownText : styles.dropdownPlaceholder}>
              {date || 'Select Date'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(tabs)/Client/Ride/TimePickerScreen')} style={styles.roundInput}>
            <Text style={time ? styles.dropdownText : styles.dropdownPlaceholder}>
              {time || 'Select Time'}
            </Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Vehicle Type"
            value={vehicleType}
            onChangeText={setVehicleType}
            style={styles.roundInput}
            placeholderTextColor="gray"
          />

          <TouchableOpacity onPress={() => setFuelOptionsVisible(!fuelOptionsVisible)} style={styles.roundInput}>
            <Text style={fuelType ? styles.dropdownText : styles.dropdownPlaceholder}>
              {fuelType || 'Select Fuel Type'}
            </Text>
          </TouchableOpacity>
          {fuelOptionsVisible && fuelOptions.map(opt => (
            <TouchableOpacity key={opt} onPress={() => { setFuelType(opt); setFuelOptionsVisible(false); }}>
              <Text style={styles.option}>{opt}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={() => setRideOptionsVisible(!rideOptionsVisible)} style={styles.roundInput}>
            <Text style={rideType ? styles.dropdownText : styles.dropdownPlaceholder}>
              {rideType || 'Select Ride Type'}
            </Text>
          </TouchableOpacity>
          {rideOptionsVisible && rideOptions.map(opt => (
            <TouchableOpacity key={opt} onPress={() => { setRideType(opt); setRideOptionsVisible(false); }}>
              <Text style={styles.option}>{opt}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.buttonWrapper}>
            <MyButton title="Save Ride Details" onPress={handleSave} />
          </View>
        </ScrollView>

        {/* Sidebar Menu and Bottom Icons */}
        <MenuNavigation visible={menuOpen} toggleSidebar={toggleSidebar} />
        <BottomIcons />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 15 },
  headerText: { fontSize: 22, fontWeight: 'bold', color: Colors.primary },
  scrollContainer: { flexGrow: 1, paddingTop: 20, paddingBottom: 100 },
  roundInput: {
    backgroundColor: Colors.text,
    borderColor: Colors.primary,
    borderWidth: 3,
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 15,
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
    width: 300,
    alignSelf: 'center',
  },
  dropdownText: { fontSize: 18, color: Colors.primary },
  dropdownPlaceholder: { fontSize: 18, color: 'gray' },
  option: {
    alignSelf: 'center',
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    backgroundColor: '#f2f2f2',
    padding: 8,
    borderRadius: 20,
    width: 200,
    textAlign: 'center',
  },
  buttonWrapper: { marginTop: 10, marginBottom: 50, alignItems: 'center' },
});

export default RideDetail;
