import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BackgroundOne from '../../components/BackgroundDesign';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Color';

const TypeSelector = () => {
  const router = useRouter();

  return (
    <BackgroundOne text="Selection">
      <View style={styles.container}>
        <Text style={styles.title}>Choose Your Role</Text>

        {/* Client Button */}
        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => router.push('/Client/Profile')}
        >
          <Text style={styles.roleText}>Client</Text>
        </TouchableOpacity>

        {/* Driver Button */}
        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => router.push('/Driver/Profile')}
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
    alignItems: 'center',
    paddingTop: 10, // 🔁 Change this to move everything up/down
    gap: 15, // Space between title and buttons
  },
  title: {
    fontSize: 26,
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roleButton: {
    backgroundColor: Colors.primary,
    width: 260,
    paddingVertical: 16,
    borderRadius: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 6 },
    shadowRadius: 6,
    elevation: 6,
  },
  roleText: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
