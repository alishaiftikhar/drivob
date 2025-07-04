import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackgroundOne from '../../components/BackgroundDesign';
import Colors from '@/constants/Color';
import { useRouter } from 'expo-router';

const GrantLocation = () => {
  const router = useRouter();

  return (
    <BackgroundOne text="Location">
      <View style={styles.container}>
        {/* Branded Icon Container */}
        <View style={styles.iconWrapper}>
          <Ionicons name="location-outline" size={150} color={Colors.primary} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Grant Location Access</Text>

        {/* Branded Button */}
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/LiveLocation')}>
          <Text style={styles.buttonText}>Enable Location</Text>
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
    gap: 30,
    paddingHorizontal: 20,
  },
  iconWrapper: {
    backgroundColor: 'Colors.primary',
    padding: 1,
    borderRadius: 100,
    elevation: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 40,
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
