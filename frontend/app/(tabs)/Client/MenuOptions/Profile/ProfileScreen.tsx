
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
import axios from 'axios';

import InputButton from '@/components/Inputbutton';
import MyButton from '@/components/MyButton';
import BackgroundOne from '@/components/BackgroundDesign';
import Colors from '@/constants/Color';


const API_BASE_URL = 'http://192.168.43.20:8000/api'; // <-- Make sure this is your backend URL

const ClientProfile = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Get token from params
  const token = (params.token as string) || '';

  // Pre-filled if editing, empty if new user
  const [name, setName] = useState(params.name as string || '');
  const [cnic, setCnic] = useState(params.cnic as string || '');
  const [age, setAge] = useState(params.age as string || '');
  const [phone, setPhone] = useState(params.phone as string || '');
  const [address, setAddress] = useState(params.address as string || '');
  const [profileImage, setProfileImage] = useState<string | null>(
    params.dp as string || null
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

  // Save profile function
  const handleSaveProfile = async () => {
    if (!token) {
      Alert.alert('Error', 'Token is missing');
      return;
    }

    const data = {
      full_name: name,
      phone_number: phone,
      cnic: cnic,
      age: age,
      address: address,
      dp: profileImage,
    };

    try {
      const response = await axios.put(`${API_BASE_URL}/user-profile/`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Success', 'Profile saved successfully');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to save profile';
      Alert.alert('Error', message);
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
            <InputButton
              placeholder="CNIC"
              value={cnic}
              onChangeText={setCnic}
              keyboardType="numeric"
            />
            <InputButton
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            <InputButton
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <InputButton
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />

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
