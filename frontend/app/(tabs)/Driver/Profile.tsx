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
import * as SecureStore from 'expo-secure-store';
import api from '@/constants/apiConfig'; // axios instance

import InputButton from '@/components/Inputbutton';
import MyButton from '@/components/MyButton';
import BackgroundOne from '../../../components/BackgroundDesign';
import Colors from '@/constants/Color';

const DriverProfile: React.FC = () => {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile fields
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Token load on mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (!storedToken) {
          Alert.alert('Authentication Error', 'You are not logged in. Please login again.');
          router.replace('/OTP');
          return;
        }
        setToken(storedToken);
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch authentication token.');
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, [router]);

  // CNIC Formatter with dashes (12345-1234567-1)
  const formatCNIC = (text: string) => {
    const digits = text.replace(/\D/g, '');
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return digits.slice(0, 5) + '-' + digits.slice(5);
    return digits.slice(0, 5) + '-' + digits.slice(5, 12) + '-' + digits.slice(12, 13);
  };

  const onChangeCNIC = (text: string) => {
    setCnic(formatCNIC(text));
  };

  // Phone number formatter (+92 prefix, remove leading zero)
  const formatPhoneNumber = (text: string) => {
    let digits = text.replace(/\D/g, '');
    if (digits.startsWith('0')) digits = digits.slice(1);
    if (!digits.startsWith('92')) digits = '92' + digits;
    return '+' + digits;
  };

  const onChangePhone = (text: string) => {
    setPhone(formatPhoneNumber(text));
  };

  // Handle selecting profile image
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
          if (!result.canceled && result.assets && result.assets.length > 0) {
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
          if (!result.canceled && result.assets && result.assets.length > 0) {
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
      router.replace('/OTP');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('full_name', name);
      formData.append('cnic', cnic);
      formData.append('age', age);
      formData.append('phone_number', phone);
      formData.append('address', address);
      formData.append('license_number', licenseNumber);
      formData.append('license_expiry', licenseExpiry);

      if (profileImage) {
        const filename = profileImage.split('/').pop() ?? 'profile.jpg';
        const ext = filename.includes('.') ? filename.split('.').pop()! : 'jpg';
        const type = `image/${ext}`;

        formData.append('dp', {
          uri: profileImage,
          name: filename,
          type,
        } as any);
      }

      // Updated API endpoint from /user-profile/ to /driver-profile/
      await api.put('/driver-profile/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Profile saved successfully');
      router.push('/(tabs)/GrantLocation');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to save profile';
      Alert.alert('Error', message);
    }
  };

  if (loading) {
    return null; // or a loading spinner while token loads
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
              onChangeText={onChangeCNIC}
              keyboardType="numeric"
              maxLength={15} // Format 12345-1234567-1
            />
            <InputButton placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
            <InputButton
              placeholder="Phone Number"
              value={phone}
              onChangeText={onChangePhone}
              keyboardType="phone-pad"
            />
            <InputButton placeholder="Address" value={address} onChangeText={setAddress} />
            <InputButton placeholder="License Number" value={licenseNumber} onChangeText={setLicenseNumber} />
            <InputButton
              placeholder="License Expiry (YYYY-MM-DD)"
              value={licenseExpiry}
              onChangeText={setLicenseExpiry}
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

export default DriverProfile;

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
