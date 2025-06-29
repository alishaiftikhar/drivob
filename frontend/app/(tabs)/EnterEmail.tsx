import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import BackgroundOne from '../../components/BackgroundDesign';
import MyButton from '../../components/MyButton';
import InputButton from '@/components/Inputbutton';
import Colors from '@/constants/Color';
import { validateEmail } from '@/components/Validation';

const EnterEmail = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    const emailError = validateEmail(email);
    if (emailError) return Alert.alert(emailError);

    // If valid, navigate to OTP screen
    router.push('/OTP');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <BackgroundOne text="Enter Email">
          <View style={styles.formContainer}>
            {/* Email Input */}
            <InputButton
              placeholder="Enter your registered Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            {/* Submit Button */}
            <View style={{ marginTop: 125 }}>
              <MyButton title="Submit" onPress={handleSubmit} />
            </View>

            {/* Info */}
            <Text style={styles.infoText}>
              We’ll send you an OTP to reset your password
            </Text>
          </View>
        </BackgroundOne>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EnterEmail;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoText: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
  },
});
