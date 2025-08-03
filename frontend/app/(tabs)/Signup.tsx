import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import BackgroundOne from '../../components/BackgroundDesign';
import InputButton from '@/components/Inputbutton';
import MyButton from '@/components/MyButton';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Color';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '@/components/Validation';

const Signup = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);

    if (emailError) return Alert.alert(emailError);
    if (passwordError) return Alert.alert(passwordError);
    if (confirmPasswordError) return Alert.alert(confirmPasswordError);

    // Direct navigation to OTP screen without API
    router.push({
      pathname: '/OTP',
      params: { flowType: 'Signup', email },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <BackgroundOne text="Signup">
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
              isSecure={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />

            <InputButton
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secure
              showToggle
              isSecure={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            <View style={styles.buttonWrapper}>
              <MyButton title="Sign Up" onPress={handleSignUp} />
            </View>

            <TouchableOpacity onPress={() => router.push('/Login')}>
              <Text style={styles.signupText}>Already have an account? Login</Text>
            </TouchableOpacity>
          </ScrollView>
        </BackgroundOne>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Signup;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 200,
    gap: 2,
  },
  buttonWrapper: {
    marginTop: 15,
  },
  signupText: {
    marginTop: 25,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
});
