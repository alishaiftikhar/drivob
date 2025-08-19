// app/Login.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import BackgroundOne from '../../components/BackgroundDesign';
import MyButton from '@/components/MyButton';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://192.168.100.7:8000/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Email and password are required');

    try {
      const response = await axios.post(`${API_BASE_URL}/login/`, { email, password });

      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;

        await SecureStore.setItemAsync('accessToken', access_token);
        await SecureStore.setItemAsync('refreshToken', refresh_token);

        router.push('/(tabs)/TypeSelector'); // Navigate to TypeSelector directly
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      Alert.alert('Error', message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <BackgroundOne text="Login">
        <View style={styles.container}>
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={{ marginTop: 20 }}>
            <MyButton title="Login" onPress={handleLogin} />
          </View>
        </View>
      </BackgroundOne>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 100 },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
});
