import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BackgroundOne from '../../components/BackgroundDesign';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Color';

const TypeSelector = () => {
  const router = useRouter();

  return (
    <BackgroundOne text="Select Role">
      <View style={styles.container}>
        {/* Client Button */}
        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => router.push('/client/Profile')}
        >
          <Text style={styles.roleText}>Client</Text>
        </TouchableOpacity>

        {/* Driver Button */}
        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => router.push('/driver/Profile')}
        >
          <Text style={styles.roleText}>Driver</Text>
        </TouchableOpacity>
      </View>
    </BackgroundOne>
  );
};

export default TypeSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Move content to top
    alignItems: 'center',
    paddingTop: 180, // 👈 pushes the buttons downward but still higher on screen
    gap: 30,
  },
  roleButton: {
    backgroundColor: Colors.primary,
    width: 250,
    paddingVertical: 15,
    borderRadius: 70,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    elevation: 5,
  },
  roleText: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
