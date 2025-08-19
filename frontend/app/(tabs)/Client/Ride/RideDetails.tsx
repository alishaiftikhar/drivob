import React, { useState, useCallback } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Colors from '@/constants/Color';
import MyButton from '@/components/MyButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '@/constants/apiConfig'; // axios instance
import { Ionicons } from '@expo/vector-icons';
import BottomTabs from '../Icons/BottomIcons';
import MenuNavigation from '../MenuOptions/Manunavigation';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

const fuelOptions = ['Petrol', 'CNG', 'Diesel'];
const rideOptions = ['1-Way', '2-Way'];
const validVehicleTypes = ['Car', 'Bike', 'Van', 'Truck', 'SUV'];

const shortenAddress = (fullAddress: string) => {
  if (!fullAddress) return '';
  const parts = fullAddress.split(',');
  return parts.length > 0 ? parts[0].trim() : fullAddress;
};

const RideDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (params.source && typeof params.source === 'string') {
        const shortSrc = shortenAddress(params.source);
        setSource(shortSrc);
      }
      if (params.destination && typeof params.destination === 'string') {
        const shortDest = shortenAddress(params.destination);
        setDestination(shortDest);
      }
      if (params.date && typeof params.date === 'string') setDate(params.date);
      if (params.time && typeof params.time === 'string') setTime(params.time);
    }, [params])
  );

  const isValidDate = (inputDate: string): boolean => {
    const [day, month, year] = inputDate.split('-').map(Number);
    if (!day || !month || !year) return false;
    const today = new Date();
    const input = new Date(year, month - 1, day);
    input.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return input >= today;
  };

  const isValidTime = (inputTime: string): boolean => {
    const timeRegex = /^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/i;
    return timeRegex.test(inputTime);
  };

  const onSelectLocation = (type: 'source' | 'destination') => {
    router.push({
      pathname: '/(tabs)/Client/Ride/MapSelectScreen',
      params: {
        type,
        source,
        destination,
      },
    });
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      setDate(`${day}-${month}-${year}`);
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (event.type === 'set' && selectedTime) {
      let hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    }
  };

  const getCoordinates = async (place: string) => {
    try {
      const res = await api.get('/geocode/', {
        params: { q: place, format: 'json', limit: 1 },
      });
      if (!res.data || res.data.length === 0) return null;
      const loc = res.data[0];
      return { latitude: parseFloat(loc.lat), longitude: parseFloat(loc.lon) };
    } catch (err) {
      console.error('Geocode error:', err);
      return null;
    }
  };

  const handleSave = async () => {
    if (!source || !destination) {
      return Alert.alert('Error', 'Please enter source and destination.');
    }
    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      return Alert.alert('Error', 'Source and destination must be different.');
    }
    if (!isValidDate(date)) {
      return Alert.alert('Invalid Date', 'Use format DD-MM-YYYY and select today or future date.');
    }
    if (!isValidTime(time)) {
      return Alert.alert('Invalid Time', 'Use format HH:MM AM/PM.');
    }
    if (!validVehicleTypes.includes(vehicleType.trim())) {
      return Alert.alert(
        'Invalid Vehicle Type',
        `Please enter a valid vehicle type: ${validVehicleTypes.join(', ')}`
      );
    }
    if (!fuelType || !rideType) {
      return Alert.alert('Missing Info', 'Please fill all fields.');
    }

    try {
      const [sourceCoords, destCoords] = await Promise.all([
        getCoordinates(source),
        getCoordinates(destination),
      ]);
      if (!sourceCoords || !destCoords) throw new Error('Could not fetch coordinates.');

      const rideData = {
        source,
        destination,
        sourceLat: sourceCoords.latitude,
        sourceLng: sourceCoords.longitude,
        destLat: destCoords.latitude,
        destLng: destCoords.longitude,
        date,
        time,
        vehicleType,
        fuelType,
        rideType,
      };

      const response = await api.post('/rides/', rideData);

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Ride details saved successfully!');
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
      } else {
        Alert.alert('Error', 'Failed to save ride details.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'An error occurred during saving.');
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        if (menuOpen) setMenuOpen(false);
        setFuelOptionsVisible(false);
        setRideOptionsVisible(false);
      }}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Ride Details</Text>
          <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
            <Ionicons name="menu" size={30} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity onPress={() => onSelectLocation('source')} style={styles.roundInput}>
            <Text style={source ? styles.dropdownText : styles.dropdownPlaceholder}>
              {source || 'Select Source'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onSelectLocation('destination')} style={styles.roundInput}>
            <Text style={destination ? styles.dropdownText : styles.dropdownPlaceholder}>
              {destination || 'Select Destination'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.roundInput}>
            <Text style={date ? styles.dropdownText : styles.dropdownPlaceholder}>
              {date || 'Select Date (DD-MM-YYYY)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.roundInput}>
            <Text style={time ? styles.dropdownText : styles.dropdownPlaceholder}>
              {time || 'Select Time (e.g. 02:30 PM)'}
            </Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Vehicle Type"
            value={vehicleType}
            onChangeText={setVehicleType}
            style={styles.roundInput}
            placeholderTextColor="gray"
            autoCapitalize="words"
            autoCorrect={false}
          />

          {/* Fuel Dropdown */}
          <TouchableOpacity onPress={() => setFuelOptionsVisible(!fuelOptionsVisible)} style={styles.roundInput}>
            <Text style={fuelType ? styles.dropdownText : styles.dropdownPlaceholder}>
              {fuelType || 'Select Fuel Type'}
            </Text>
          </TouchableOpacity>
          {fuelOptionsVisible &&
            fuelOptions.map(opt => (
              <TouchableOpacity
                key={opt}
                onPress={() => {
                  setFuelType(opt);
                  setFuelOptionsVisible(false);
                }}
              >
                <Text style={styles.option}>{opt}</Text>
              </TouchableOpacity>
            ))}

          {/* Ride Dropdown */}
          <TouchableOpacity onPress={() => setRideOptionsVisible(!rideOptionsVisible)} style={styles.roundInput}>
            <Text style={rideType ? styles.dropdownText : styles.dropdownPlaceholder}>
              {rideType || 'Select Ride Type'}
            </Text>
          </TouchableOpacity>
          {rideOptionsVisible &&
            rideOptions.map(opt => (
              <TouchableOpacity
                key={opt}
                onPress={() => {
                  setRideType(opt);
                  setRideOptionsVisible(false);
                }}
              >
                <Text style={styles.option}>{opt}</Text>
              </TouchableOpacity>
            ))}

          {/* Save Button */}
          <View style={styles.buttonWrapper}>
            <MyButton title="Save Ride Details" onPress={handleSave} />
          </View>
        </ScrollView>

        {/* Date & Time Pickers */}
        {showDatePicker && (
          <DateTimePicker value={new Date()} mode="date" display="default" onChange={onDateChange} />
        )}
        {showTimePicker && (
          <DateTimePicker value={new Date()} mode="time" display="default" onChange={onTimeChange} />
        )}

        {/* Sidebar + Tabs */}
        <MenuNavigation visible={menuOpen} toggleSidebar={() => setMenuOpen(false)} />
        <BottomTabs />
      </View>
    </TouchableWithoutFeedback>
  );
};

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
    borderWidth: 2,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
    color: 'black',
    width: '85%',
    alignSelf: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.primary,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: 'gray',
  },
  option: {
    alignSelf: 'center',
    fontSize: 15,
    marginBottom: 5,
    color: '#333',
  },
  buttonWrapper: {
    marginTop: 20,
    marginBottom: 60,
    alignSelf: 'center',
    width: '85%',
  },
});

export default RideDetails;
