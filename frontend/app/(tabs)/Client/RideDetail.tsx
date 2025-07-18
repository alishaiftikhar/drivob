import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Colors from '@/constants/Color';
import MyButton from '@/components/MyButton';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import BottomTabs from './Icons/BottomIcons';
import MenuNavigation from './MenuOptions/Manunavigation';


const SCREEN_WIDTH = Dimensions.get('window').width;

const RideDetail = () => {
  const router = useRouter();

  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [rideType, setRideType] = useState('');
  const [fuelOptionsVisible, setFuelOptionsVisible] = useState(false);
  const [rideOptionsVisible, setRideOptionsVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const fuelOptions = ['Petrol', 'CNG', 'Diesel'];
  const rideOptions = ['1-Way', '2-Way'];

  const isValidDate = (inputDate: string): boolean => {
    const [day, month, year] = inputDate.split('-').map(Number);
    if (!day || !month || !year) return false;
    const today = new Date();
    const input = new Date(year, month - 1, day);
    return input >= today;
  };

  const isValidTime = (inputTime: string): boolean => {
    const timeRegex = /^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/i;
    return timeRegex.test(inputTime);
  };

  const getCoordinates = async (place: string) => {
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: { q: place, format: 'json', limit: 1 },
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'ReactNativeApp',
        },
      });
      const loc = res.data[0];
      return loc ? { latitude: parseFloat(loc.lat), longitude: parseFloat(loc.lon) } : null;
    } catch (err) {
      console.error('Nominatim error:', err);
      return null;
    }
  };

  const handleSave = async () => {
    if (!source || !destination)
      return Alert.alert('Error', 'Please enter source and destination.');
    if (source.trim().toLowerCase() === destination.trim().toLowerCase())
      return Alert.alert('Error', 'Source and destination must be different.');
    if (!isValidDate(date))
      return Alert.alert('Invalid Date', 'Use format DD-MM-YYYY and future dates only.');
    if (!isValidTime(time))
      return Alert.alert('Invalid Time', 'Use format HH:MM AM/PM.');
    if (!vehicleType || !fuelType || !rideType)
      return Alert.alert('Missing Info', 'Please fill all fields.');

    const sourceCoords = await getCoordinates(source);
    const destCoords = await getCoordinates(destination);
    if (!sourceCoords || !destCoords)
      return Alert.alert('Location Error', 'Could not fetch coordinates.');

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
      },
    });
  };

  const toggleSidebar = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        if (menuOpen) toggleSidebar();
        setFuelOptionsVisible(false);
        setRideOptionsVisible(false);
      }}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Ride Details</Text>
          <TouchableOpacity onPress={toggleSidebar}>
            <Ionicons name="menu" size={30} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TextInput placeholder="Source" value={source} onChangeText={setSource} style={styles.roundInput} placeholderTextColor="gray" />
          <TextInput placeholder="Destination" value={destination} onChangeText={setDestination} style={styles.roundInput} placeholderTextColor="gray" />
          <TextInput placeholder="Date (DD-MM-YYYY)" value={date} onChangeText={setDate} style={styles.roundInput} placeholderTextColor="gray" />
          <TextInput placeholder="Time (e.g. 02:30 PM)" value={time} onChangeText={setTime} style={styles.roundInput} placeholderTextColor="gray" />
          <TextInput placeholder="Vehicle Type" value={vehicleType} onChangeText={setVehicleType} style={styles.roundInput} placeholderTextColor="gray" />

          <TouchableOpacity onPress={() => setFuelOptionsVisible(!fuelOptionsVisible)} style={styles.roundInput}>
            <Text style={fuelType ? styles.dropdownText : styles.dropdownPlaceholder}>
              {fuelType || 'Select Fuel Type'}
            </Text>
          </TouchableOpacity>
          {fuelOptionsVisible && fuelOptions.map((opt) => (
            <TouchableOpacity key={opt} onPress={() => { setFuelType(opt); setFuelOptionsVisible(false); }}>
              <Text style={styles.option}>{opt}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={() => setRideOptionsVisible(!rideOptionsVisible)} style={styles.roundInput}>
            <Text style={rideType ? styles.dropdownText : styles.dropdownPlaceholder}>
              {rideType || 'Select Ride Type'}
            </Text>
          </TouchableOpacity>
          {rideOptionsVisible && rideOptions.map((opt) => (
            <TouchableOpacity key={opt} onPress={() => { setRideType(opt); setRideOptionsVisible(false); }}>
              <Text style={styles.option}>{opt}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.buttonWrapper}>
            <MyButton title="Save Ride Details" onPress={handleSave} />
          </View>
        </ScrollView>

        {/* Sidebar */}
        <MenuNavigation visible={menuOpen} toggleSidebar={toggleSidebar} />

        {/* Bottom Tabs */}
        <BottomTabs />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RideDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 100,
  },
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
  dropdownText: {
    fontSize: 18,
    color: Colors.primary,
  },
  dropdownPlaceholder: {
    fontSize: 18,
    color: 'gray',
  },
  option: {
    alignSelf: 'center',
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  buttonWrapper: {
    marginTop: 10,
    marginBottom: 50,
  },
});
