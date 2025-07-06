import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import MyButton from '@/components/MyButton';
import Colors from '@/constants/Color';
import { useRouter } from 'expo-router';
import BackgroundOne from '@/components/BackgroundDesign';

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

  const handleSave = () => {
    if (!source || !destination) {
      Alert.alert('Error', 'Please enter both source and destination.');
      return;
    }

    router.push({
      pathname: '/(tabs)/Client/MapDistanceScreen',
      params: {
        source,
        destination,
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
    <BackgroundOne text={'Ride\nDetails'}>
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
          <TextInput placeholder="Duration (e.g. 2h 30m)" value={rideDuration} onChangeText={setRideDuration} style={[styles.input, styles.inputHalf]} />
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
