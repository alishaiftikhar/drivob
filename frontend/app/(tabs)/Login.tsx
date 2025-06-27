import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Alert,
} from 'react-native';
import BackgroundDesign from '@/components/Background Design';
import MyButton from '@/components/MyButton';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Color';
import { validateEmail, validatePassword } from '@/components/Validation';

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      Alert.alert('Validation Error', `${emailError}\n${passwordError}`);
      return;
    }

    // Move to next screen
    router.push('/TypeSelector');
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <BackgroundDesign text="Login">
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#555"
          />

          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              placeholderTextColor="#555"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={24}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push('/EnterEmail')}
          >
            <Text style={styles.forgotText}>Forget Password?</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 20 }}>
            <MyButton title="Login" onPress={handleLogin} />
          </View>

          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => router.push('/Signup')}
          >
            <Text style={styles.signupText}>
              Don’t have an account? <Text style={styles.signupLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </BackgroundDesign>
    </TouchableOpacity>
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
  input: {
    backgroundColor: 'white',
    borderColor: Colors.primary,
    borderWidth: 3,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: 'black',
    width: 300,
    marginVertical: 10,
  },
  inputWrapper: {
    width: 300,
    justifyContent: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: 35,
    marginTop: 5,
  },
  forgotText: {
    color: Colors.primary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  signupContainer: {
    marginTop: 30,
  },
  signupText: {
    color: Colors.primary,
    fontSize: 16,
  },
  signupLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
