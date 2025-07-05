// RideDetail.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import MyButton from '@/components/MyButton';
import Colors from '@/constants/Color';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const RideDetail = () => {
  const router = useRouter();

  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [fuelType, setFuelType] = useState('Petrol');
  const [rideType, setRideType] = useState('One-way');
  const [rideDuration, setRideDuration] = useState('');
  const [extraNote, setExtraNote] = useState('');

  const handleSave = () => {
    // Save ride details to state or backend
    // Navigate to MapDistanceScreen
    router.push('/(tabs)/Client/MapDistanceScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Enter Ride Details</Text>

      <TextInput placeholder="Source" value={source} onChangeText={setSource} style={styles.input} />
      <TextInput placeholder="Destination" value={destination} onChangeText={setDestination} style={styles.input} />
      <TextInput placeholder="Date (e.g. 2025-07-06)" value={date} onChangeText={setDate} style={styles.input} />
      <TextInput placeholder="Time (e.g. 21:00)" value={time} onChangeText={setTime} style={styles.input} />

      <Text style={styles.label}>Vehicle Type</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={vehicleType} onValueChange={setVehicleType}>
          <Picker.Item label="Car" value="Car" />
          <Picker.Item label="Bike" value="Bike" />
          <Picker.Item label="Rickshaw" value="Rickshaw" />
        </Picker>
      </View>

      <Text style={styles.label}>Fuel Type</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={fuelType} onValueChange={setFuelType}>
          <Picker.Item label="Petrol" value="Petrol" />
          <Picker.Item label="Diesel" value="Diesel" />
          <Picker.Item label="Electric" value="Electric" />
        </Picker>
      </View>

      <Text style={styles.label}>Ride Type</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={rideType} onValueChange={setRideType}>
          <Picker.Item label="One-way" value="One-way" />
          <Picker.Item label="Round-trip" value="Round-trip" />
        </Picker>
      </View>

      <TextInput placeholder="Estimated Ride Duration (minutes)" value={rideDuration} onChangeText={setRideDuration} style={styles.input} />
      <TextInput placeholder="Extra Notes (optional)" value={extraNote} onChangeText={setExtraNote} style={styles.input} />

      <View style={styles.buttonWrapper}>
        <MyButton title="Save Details" onPress={handleSave} />
      </View>
    </ScrollView>
  );
};

export default RideDetail;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.primary,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  buttonWrapper: {
    marginTop: 20,
  },
});
