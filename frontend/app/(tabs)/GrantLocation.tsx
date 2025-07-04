import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackgroundOne from '../../components/BackgroundDesign';
import Colors from '@/constants/Color';
import { useRouter } from 'expo-router';

const GrantLocation = () => {
  const router = useRouter();

  return (
    <BackgroundOne text="Location Access">
      <View style={styles.container}>
        <Ionicons name="location-outline" size={100} color={Colors.primary} />
        <Text style={styles.title}>Grant Location Access</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/LiveLocation')}>
          <Text style={styles.buttonText}> Location</Text>
        </TouchableOpacity>
      </View>
    </BackgroundOne>
  );
};

export default GrantLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  title: {
    fontSize: 22,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 4,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 18,
  },
});
