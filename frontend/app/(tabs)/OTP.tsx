// File: app/OTP.tsx

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import BackgroundOne from '../../components/BackgroundDesign';
import MyButton from '@/components/MyButton';

const OTP = () => {
  const router = useRouter();
  const { from } = useLocalSearchParams(); // "signup" or "login"

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < inputs.current.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const code = otp.join('');
    if (code.length < 4) {
      Alert.alert('Incomplete OTP', 'Please enter all 4 digits.');
      return;
    }

    // Conditional navigation
    if (from === 'signup') {
      router.push('/tabs/TypeSelectorScreen');
    } else if (from === 'login') {
      router.push('/NewPasswordScreen');
    } else {
      Alert.alert('Navigation Error', 'Unknown source screen.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <BackgroundOne />

        <View style={styles.container}>
          <Text style={styles.title}>Enter OTP</Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.otpInput}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
              />
            ))}
          </View>
          <MyButton title="Verify OTP" onPress={handleSubmit} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default OTP;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '35%',
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: 20,
  },
  otpInput: {
    borderBottomWidth: 2,
    borderColor: '#fff',
    width: 40,
    height: 50,
    fontSize: 24,
    textAlign: 'center',
    color: '#fff',
  },
});
