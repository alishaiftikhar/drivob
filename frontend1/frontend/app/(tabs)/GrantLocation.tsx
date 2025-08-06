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

        {/* Centered Simple Icon */}
        <Ionicons name="location-outline" size={120} color={Colors.primary} style={styles.icon} />

        {/* Title */}
        <Text style={styles.title}>Grant Location Access</Text>

        {/* Lifted Button */}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  // Removed icon background styling
  icon: {
    marginBottom: 50,
  },

  title: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },

  // Raised Button with more top margin
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 40,
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    marginTop: 10, // keeps it raised
  },

  buttonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
