import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import BackgroundOne from '../../components/BackgroundDesign';
import InputButton from '@/components/Inputbutton';
import MyButton from '@/components/MyButton';
import Colors from '@/constants/Color';
import { useRouter } from 'expo-router';
import { validateEmail, validatePassword } from '@/components/Validation';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) return alert(emailError);
    if (passwordError) return alert(passwordError);

    // All good → Move to TypeSelector screen
    router.push('/TypeSelector');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <BackgroundOne text="Login">
          <View style={styles.formContainer}>
            {/* Email Input */}
            <InputButton
              placeholder="Enter Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            {/* Password Input */}
            <InputButton
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secure
              showToggle
              isSecure={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />

            {/* Forget Password Link */}
            <TouchableOpacity
              onPress={() => router.push('/EnterEmail')}
              style={styles.forgetContainer}
            >
              <Text style={styles.forgetText}>Forget Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <View style={{ marginTop: 40 }}>
              <MyButton title="Login" onPress={handleLogin} />
            </View>

            {/* Signup Link */}
            <TouchableOpacity onPress={() => router.push('/Signup')}>
              <Text style={styles.signupText}>Create New Account</Text>
            </TouchableOpacity>
          </View>
        </BackgroundOne>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  forgetContainer: {
    alignSelf: 'flex-end',
    marginTop: 5,
    marginRight: 100,
  },
  forgetText: {
    color: Colors.primary,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  signupText: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
});
