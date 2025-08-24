import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';

import InputButton from '@/components/Inputbutton';
import MyButton from '@/components/MyButton';
import BackgroundOne from '../../../components/BackgroundDesign';
import Colors from '@/constants/Color';

import {
  validateFullName,
  validateCNIC,
  validateAge,
  validatePhoneNumber,
  validateAddress,
} from '@/components/Validation';

const ClientProfile = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const getParam = (key: string): string => {
    const value = params[key];
    if (Array.isArray(value)) return value[0];
    if (typeof value === 'string') return value;
    return '';
  };

  const [name, setName] = useState(getParam('name'));
  const [cnic, setCnic] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState(getParam('phone'));
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(
    getParam('dp') || null
  );

  const handleIconPress = async () => {
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    if (!mediaPermission.granted || !cameraPermission.granted) {
      Alert.alert('Permission Denied', 'Allow camera and gallery access.');
      return;
    }

    Alert.alert('Select Image', 'Choose an option', [
      {
        text: 'Camera',
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
          if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
          }
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
          if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSaveProfile = () => {
    const nameError = validateFullName(name);
    const cnicError = validateCNIC(cnic);
    const ageError = validateAge(age);
    const phoneError = validatePhoneNumber(phone);
    const addressError = validateAddress(address);

    if (nameError || cnicError || ageError || phoneError || addressError) {
      const firstError = nameError || cnicError || ageError || phoneError || addressError;
      Alert.alert('Validation Error', firstError);
      return;
    }

    Alert.alert('Success', 'Profile Saved!');

    const profileData = {
      name,
      phone,
      role: 'Client',
      status: 'Active',
      dp: profileImage || '',
    };

    if (getParam('editing') === 'true') {
      router.replace({
        pathname: '/(tabs)/Client/MenuOptions/Profile/ProfileScreen',
        params: profileData,
      });
    } else {
      router.push({
        pathname: '/GrantLocation',
        params: profileData,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <BackgroundOne
          imageSource={
            <TouchableOpacity onPress={handleIconPress}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <Ionicons name="person-circle-outline" size={120} color="white" />
              )}
            </TouchableOpacity>
          }
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <InputButton placeholder="Full Name" value={name} onChangeText={setName} />
            <InputButton placeholder="CNIC" value={cnic} onChangeText={setCnic} keyboardType="numeric" />
            <InputButton placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
            <InputButton placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <InputButton placeholder="Address" value={address} onChangeText={setAddress} />

            <View style={{ marginTop: 40 }}>
              <MyButton title="Save Profile" onPress={handleSaveProfile} />
            </View>
          </ScrollView>
        </BackgroundOne>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ClientProfile;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 200,
    gap: 2,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
});
