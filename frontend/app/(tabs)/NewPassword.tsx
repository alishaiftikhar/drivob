import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import BackgroundOne from '../../components/BackgroundDesign';
import Colors from '@/constants/Color';
import MyButton from '@/components/MyButton';
import InputButton from '@/components/Inputbutton';
import { useRouter } from 'expo-router';
import {
  validatePassword,
  validateConfirmPassword,
} from '@/components/Validation';

const NewPassword = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    const passwordError = validatePassword(newPassword);
    const confirmPasswordError = validateConfirmPassword(newPassword, confirmPassword);

    if (passwordError) return Alert.alert(passwordError);
    if (confirmPasswordError) return Alert.alert(confirmPasswordError);

    // ✅ All checks passed
    router.push('/TypeSelector');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <BackgroundOne text="Password">
          <View style={styles.formContainer}>
            {/* New Password */}
            <InputButton
              placeholder="Enter New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secure
              showToggle
              isSecure={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />

            {/* Confirm Password */}
            <InputButton
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secure
              showToggle
              isSecure={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            {/* Submit Button */}
            <View style={{ marginTop: 80 }}>
              <MyButton title="Submit" onPress={handleSubmit} />
            </View>
          </View>
        </BackgroundOne>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewPassword;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
