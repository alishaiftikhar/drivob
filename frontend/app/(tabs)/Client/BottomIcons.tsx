import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BottomTabs() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/(tabs)/Client/Home')}>
        <Ionicons name="home-outline" size={24} color="purple" />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(tabs)/Client/LiveTracking')}>
        <Ionicons name="navigate" size={24} color="purple" />
        <Text style={styles.label}>Live</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(tabs)/Client/Emergency')}>
        <Ionicons name="alert-circle-outline" size={24} color="purple" />
        <Text style={styles.label}>Emergency</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(tabs)/Client/Profile')}>
        <Ionicons name="person-outline" size={24} color="purple" />
        <Text style={styles.label}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  label: {
    fontSize: 12,
    color: 'purple',
    textAlign: 'center',
  },
});
