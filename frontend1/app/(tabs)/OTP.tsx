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
import Colors from '@/constants/Color';

const OTP = () => {
  const router = useRouter();
  const { next } = useLocalSearchParams(); // either 'forgot' or 'signup'

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (index < 5) {
        inputs.current[index + 1]?.focus();
      }
    } else if (text === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      Alert.alert('Please enter a valid 6-digit OTP');
      return;
    }

    // Determine navigation based on source
    const origin = typeof next === 'string' ? next.toLowerCase() : '';

    if (origin === 'Forget Password?') {
      router.push('/NewPassword');
    } else {
      router.push('/TypeSelector');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <BackgroundOne text="OTP">
          <View style={styles.container}>
            <Text style={styles.title}>Enter the 6-digit OTP</Text>

            <View style={styles.otpBoxContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpBox}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  ref={(ref) => {
                    if (ref) inputs.current[index] = ref;
                  }}
                />
              ))}
            </View>

            <MyButton title="Verify OTP" onPress={handleVerify} />

            <Text style={styles.infoText}>
              Please check your email for the OTP.
            </Text>
          </View>
        </BackgroundOne>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default OTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 30,
  },
  title: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  otpBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  otpBox: {
    width: 50,
    height: 55,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
    color: Colors.primary,
    backgroundColor: '#fff',
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
  },
});
