import React, { useState, useRef } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import axios from 'axios';
import BackgroundOne from '../../components/BackgroundDesign';
import MyButton from '@/components/MyButton';
import Colors from '@/constants/Color';
import { useRouter, useLocalSearchParams } from 'expo-router';

const API_BASE_URL = 'http://192.168.100.7:8000/api';

const OTP = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const from = (params.from as string) || 'signup';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) inputs.current[index + 1]?.focus();
    else if (!text && index > 0) inputs.current[index - 1]?.focus();
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return Alert.alert('Validation Error', 'OTP must be 6 digits.');

    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp/`, { email, otp: otpCode });


      if (response.data.success) {
        Alert.alert('Success', 'OTP verified successfully!');

        const token = response.data.access; // JWT access token

        // Navigate to TypeSelector with token
        if (from === 'signup') {
          router.push({
            pathname: '/TypeSelector',
            params: { token },
          });
        } else {
          router.push('/NewPassword');
        }
      } else {
        Alert.alert('Error', response.data.message || 'Invalid OTP.');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'OTP verification failed.';
      Alert.alert('Error', message);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/send-otp/`, { email });
      if (response.data.success) {
        Alert.alert('Success', 'OTP resent successfully!');
        setOtp(['', '', '', '', '', '']);
        inputs.current[0]?.focus();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to resend OTP.');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to resend OTP.';
      Alert.alert('Error', message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <BackgroundOne text="Verify OTP">
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.infoText}>
            Enter the 6-digit OTP sent to your email: {email}
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                keyboardType="numeric"
                maxLength={1}
                value={value}
                onChangeText={(text) => handleChange(text, index)}
                ref={(ref) => { inputs.current[index] = ref }}
                textAlign="center"
              />
            ))}
          </View>

          <View style={styles.buttonWrapper}>
            <MyButton title="Verify OTP" onPress={handleVerifyOtp} />
          </View>

          <TouchableOpacity onPress={handleResendOtp}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        </ScrollView>
      </BackgroundOne>
    </KeyboardAvoidingView>
  );
};

export default OTP;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 200,
    gap: 15,
  },
  infoText: { fontSize: 16, color: Colors.primary, textAlign: 'center', marginBottom: 20 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '80%' },
  otpInput: { borderWidth: 1, borderColor: Colors.primary, borderRadius: 8, padding: 12, fontSize: 20, width: '13%', color: Colors.primary },
  buttonWrapper: { marginTop: 25, width: '100%' },
  resendText: { marginTop: 20, fontSize: 16, color: Colors.primary, fontWeight: '600', textAlign: 'center' },  
});