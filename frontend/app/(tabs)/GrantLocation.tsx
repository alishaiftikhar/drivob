import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import BackgroundOne from '../../components/BackgroundDesign';
import Colors from '@/constants/Color';
import { useRouter } from 'expo-router';

const GrantLocation = () => {
  const router = useRouter();

  return (
    <BackgroundOne text="Location">
      <View style={styles.container}>
        
        {/* Custom Location Image Icon */}
        <Image
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTUK7yX5T8YXKBUbAwCyW8KFCkRDxCQECYjA&s' }}
          style={styles.icon}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Grant Location Access</Text>

        {/* Button */}
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

  icon: {
    width: 150,
    height: 150,
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
    marginTop: 10,
  },

  buttonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
