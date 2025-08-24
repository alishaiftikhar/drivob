import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import BackgroundOne from '../../components/BackgroundDesign';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/Color';
import api from '@/constants/apiConfig';  // Use axios instance here
import * as SecureStore from 'expo-secure-store';

const TypeSelector: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        let tok: string | undefined;

        // Params might be string or string[] (from URL)
        const paramToken = params.token;
        if (Array.isArray(paramToken)) {
          tok = paramToken[0]; // Take first if array
        } else {
          tok = paramToken;
        }

        if (!tok) {
          // Try SecureStore for stored token
          tok = (await SecureStore.getItemAsync('userToken')) || '';
        } else {
          // Save token for future use securely
          await SecureStore.setItemAsync('userToken', tok);
        }

        if (!tok) {
          Alert.alert('Error', 'No token found. Please verify OTP first.');
          router.replace('/OTP');
          return;
        }
        setToken(tok);
      } catch (error) {
        console.log('Token fetch error:', error);
        Alert.alert('Error', 'Something went wrong while fetching token.');
      }
    };

    fetchToken();
  }, [params.token, router]);

  const handleSelectRole = async (role: 'driver' | 'client') => {
    if (!token) {
      Alert.alert('Error', 'Authentication token is missing. Please verify OTP first.');
      return;
    }

    try {
      const response = await api.post(
        '/set-user-type/',
        { user_type: role },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // ✅ JWT token passed in headers
          },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', `You selected ${role}`);
        router.push(role === 'driver' ? '/Driver/Profile' : '/Client/Profile');
      } else {
        Alert.alert('Error', response.data.error || 'Failed to save role.');
      }
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Something went wrong';
      Alert.alert('Error', message);
    }
  };

  return (
    <BackgroundOne text="Selection">
      <View style={styles.container}>
        <Text style={styles.title}>Choose Your Role</Text>

        <TouchableOpacity style={styles.roleButton} onPress={() => handleSelectRole('client')}>
          <Text style={styles.roleText}>Client</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.roleButton} onPress={() => handleSelectRole('driver')}>
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
    paddingTop: 10,
    gap: 15,
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
