import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

import BackgroundOne from '../../components/BackgroundDesign';
import InputButton from '@/components/Inputbutton';
import MyButton from '@/components/MyButton';
import Colors from '@/constants/Color';
import { useRouter } from 'expo-router';
import { validateEmail, validatePassword } from '@/components/Validation';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://192.168.43.20:8000/api';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) return Alert.alert('Error', emailError);
    if (passwordError) return Alert.alert('Error', passwordError);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/login/`,
        { username: email, password }, // Use 'username' as key for Django SimpleJWT
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log('Login response:', response.data);

      if (response.status === 200) {
        Alert.alert('Success', 'Login successful');

        // Save access token securely
        if (response.data.access) {
          await SecureStore.setItemAsync('userToken', response.data.access);
        }

        // Navigate to home or appropriate screen after login
        router.push('/');
      } else {
        Alert.alert('Error', response.data.message || 'Login failed');
      }
    } catch (err: any) {
      console.log('Login error:', err.response?.data || err.message);
      const message =
        err.response?.data?.message || 'Something went wrong during login';
      Alert.alert('Error', message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <BackgroundOne text="Login">
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <InputButton
              placeholder="Enter Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <InputButton
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secure
              showToggle
              isSecure={!showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />

            <TouchableOpacity onPress={() => router.push('/EnterEmail')}>
              <Text style={styles.forgetText}>Forget Password?</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 40 }}>
              <MyButton title="Login" onPress={handleLogin} />
            </View>

            <TouchableOpacity onPress={() => router.push('/Signup')}>
              <Text style={styles.signupText}>Create New Account</Text>
            </TouchableOpacity>
          </ScrollView>
        </BackgroundOne>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 200,
    gap: 2,
  },
  forgetText: {
    alignSelf: 'flex-end',
    marginTop: 5,
    marginRight: -140,
    color: Colors.primary,
    fontSize: 20,
    textDecorationLine: 'underline',
  },
  signupText: {
    marginTop: 25,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
});
