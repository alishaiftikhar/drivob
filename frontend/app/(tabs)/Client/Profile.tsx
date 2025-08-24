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
import api from '@/constants/apiConfig'; // Use axios instance

import InputButton from '@/components/Inputbutton';
import MyButton from '@/components/MyButton';
import BackgroundOne from '../../../components/BackgroundDesign';
import Colors from '@/constants/Color';

const ClientProfile: React.FC = () => {
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

  // Load token securely once on mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (!storedToken) {
          console.log('⚠️ Token not found in storage');
          Alert.alert('Authentication Error', 'You are not logged in. Please login again.');
          router.replace('/OTP');
          return;
        }
        setToken(storedToken);
      } catch (err) {
        console.error('Error loading token:', err);
        Alert.alert('Error', 'Failed to fetch authentication token.');
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, [router]);

  // Format CNIC like 12345-1234567-1
  const formatCNIC = (text: string) => {
    const digits = text.replace(/\D/g, '');
    let formatted = '';
    if (digits.length <= 5) {
      formatted = digits;
    } else if (digits.length <= 12) {
      formatted = digits.slice(0, 5) + '-' + digits.slice(5);
    } else {
      formatted = digits.slice(0, 5) + '-' + digits.slice(5, 12) + '-' + digits.slice(12, 13);
    }
    return formatted;
  };

  // Format phone with +92 prefix, remove leading zero
  const formatPhoneNumber = (text: string) => {
    let digits = text.replace(/\D/g, '');
    if (digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    if (!digits.startsWith('92')) {
      digits = '92 ' + digits;
    }
    return '+' + digits;
  };

  const onChangeCNIC = (text: string) => {
    setCnic(formatCNIC(text));
  };

  const onChangePhone = (text: string) => {
    setPhone(formatPhoneNumber(text));
  };

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

      if (profileImage) {
        const filename = profileImage.split('/').pop() ?? 'profile.jpg';
        const ext = filename.includes('.') ? filename.split('.').pop()! : 'jpg';
        const type = `image/${ext}`;

        formData.append('dp', {
          uri: profileImage,
          name: filename,
          type: type,
        } as any);
      }

      await api.put('/user-profile/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Profile saved successfully');
      router.push('/(tabs)/GrantLocation');
    } catch (err: any) {
      console.log('❌ Save profile error:', err.response?.data || err.message);
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
              maxLength={15} // Format: 12345-1234567-1
            />
            <InputButton placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
            <InputButton
              placeholder="Phone Number"
              value={phone}
              onChangeText={onChangePhone}
              keyboardType="phone-pad"
            />
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
