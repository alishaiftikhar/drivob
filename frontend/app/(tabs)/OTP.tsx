import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
} from 'react-native';
import BackgroundDesign from '@/components/Background Design';
import MyButton from '@/components/MyButton';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Color';

const OTP = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6 || otp.includes('')) {
      Alert.alert('Error', 'Please enter a 6-digit OTP.');
      return;
    }

    // Navigate after OTP is complete
    router.push('/TypeSelector');
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <BackgroundDesign text="Enter OTP">
        <View style={styles.container}>
          <Text style={styles.infoText}>A 6-digit code was sent to your email</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                value={digit}
                onChangeText={(text) => handleChange(text.replace(/[^0-9]/g, ''), index)}
                maxLength={1}
                keyboardType="number-pad"
                style={styles.otpInput}
                returnKeyType="next"
              />
            ))}
          </View>

          <View style={{ marginTop: 30 }}>
            <MyButton title="Verify OTP" onPress={handleVerify} />
          </View>
        </View>
      </BackgroundDesign>
    </TouchableOpacity>
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
  infoText: {
    color: Colors.primary,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 22,
    color: 'black',
    backgroundColor: 'white',
  },
});
