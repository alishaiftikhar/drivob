import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
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

    router.push('/OTP');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <BackgroundOne text="Email">
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Email Input with padding */}
            <InputButton
              placeholder="Enter your registered Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            {/* Button with spacing */}
            <View style={{ marginTop: 40 }}>
              <MyButton title="Submit" onPress={handleSubmit} />
            </View>

            {/* Info Text */}
            <Text style={styles.infoText}>
              We’ll send you an OTP to reset your password
            </Text>
          </ScrollView>
        </BackgroundOne>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default EnterEmail;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 200,
    gap: 25,
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
