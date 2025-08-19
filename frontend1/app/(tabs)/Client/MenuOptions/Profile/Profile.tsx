import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import InputButton from '@/components/Inputbutton';
import MyButton from '@/components/MyButton';
import BackgroundOne from '@/components/BackgroundDesign';
import Colors from '@/constants/Color';

// API base URL
const API_BASE_URL = 'http://192.168.100.7:8000/api'; // Replace with your backend URL

const ClientProfile = () => {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile fields
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Load token once when screen mounts
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (!storedToken) {
          console.log('⚠ Token not found in storage');
        }
        setToken(storedToken);
      } catch (err) {
        console.error('Error loading token:', err);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

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

  const handleSaveProfile = async () => {
    if (!token) {
      Alert.alert('Error', 'Authentication token is missing. Please log in again.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('full_name', name);
      formData.append('cnic', cnic);
      formData.append('age', age);
      formData.append('phone_number', phone);
      formData.append('address', address);

      if (profileImage) {
  const filename = profileImage.split('/').pop() ?? 'profile.jpg';
  const ext = filename.includes('.') ? filename.split('.').pop() : 'jpg';
  const type = `image/${ext}`;
        formData.append('dp', {
          uri: profileImage,
          name: filename,
          type: type,
        } as any);
      }

     await axios.put(`${API_BASE_URL}/user-profile/`, formData, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  },
});

      Alert.alert('Success', 'Profile saved successfully');
      router.push('/(tabs)/LiveLocation'); // or wherever you want to go after saving
    } catch (err: any) {
      console.log('❌ Save profile error:', err.response?.data || err.message);
      const message = err.response?.data?.message || 'Failed to save profile';
      Alert.alert('Error', message);
    }
  };

  if (loading) {
    return null; // Or show a loader/spinner
  }

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