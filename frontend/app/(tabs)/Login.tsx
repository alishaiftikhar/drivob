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

    router.push('/TypeSelector');
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
              isSecure={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />

            {/* Forget Password */}
            <TouchableOpacity onPress={() => router.push('/EnterEmail')}>
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
    paddingBottom: 200, // for scroll space
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
