import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import BackgroundOne from '../../components/BackgroundDesign';
import Colors from '@/constants/Color';
import MyButton from '@/components/MyButton';
import { useRouter, useLocalSearchParams } from 'expo-router';

const OTP = () => {
  const router = useRouter();
  const { next } = useLocalSearchParams(); // 🔐 supports dynamic route redirection
  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOTP = otp.join('');
    if (enteredOTP.length !== 6) {
      Alert.alert('Please enter the complete 6-digit OTP');
      return;
    }

    // 🔁 Navigate to the next screen passed in query
    const redirectTo = typeof next === 'string' ? next : 'TypeSelector';
    router.push('/NewPassword');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <BackgroundOne text="OTP">
          <View style={styles.container}>
            <Text style={styles.title}>Enter 6-digit OTP</Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref!)}
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                />
              ))}
            </View>

            <View style={{ marginTop: 180 }}>
              <MyButton title="Verify OTP" onPress={handleVerify} />
            </View>
          </View>
        </BackgroundOne>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default OTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    color: Colors.primary,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
    color: 'black',
    fontSize: 22,
    textAlign: 'center',
  },
});
