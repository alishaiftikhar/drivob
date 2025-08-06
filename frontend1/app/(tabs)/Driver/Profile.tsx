import React, { useState } from 'react';
import {
  Alert,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import InputButton from '@/components/Inputbutton';
import MyButton from '@/components/MyButton';
import BackgroundOne from '../../../components/BackgroundDesign';
import Colors from '@/constants/Color';

const DriverProfile = () => {
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [licenseFront, setLicenseFront] = useState<string | null>(null);
  const [licenseBack, setLicenseBack] = useState<string | null>(null);
  const [uploadStage, setUploadStage] = useState<'front' | 'back' | 'done'>('front');
  const [uploadMessage, setUploadMessage] = useState('Tap below to upload License Images');

  // Smart Picker Handler
  const handleLicenseUpload = async () => {
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    if (!mediaPermission.granted || !cameraPermission.granted) {
      Alert.alert('Permission Denied', 'Camera & Gallery access required.');
      return;
    }

    Alert.alert('Choose Image', 'Pick method', [
      {
        text: 'Camera',
        onPress: () => openPicker('camera'),
      },
      {
        text: 'Gallery',
        onPress: () => openPicker('gallery'),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openPicker = async (mode: 'camera' | 'gallery') => {
    const result =
      mode === 'camera'
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
          });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      if (uploadStage === 'front') {
        setLicenseFront(uri);
        setUploadMessage('Now upload the BACK side of the license');
        setUploadStage('back');
      } else if (uploadStage === 'back') {
        setLicenseBack(uri);
        setUploadMessage('✅ Both sides uploaded!');
        setUploadStage('done');
      }
    }
  };

  const handleProfileImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const camera = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted || !camera.granted) {
      Alert.alert('Permission Denied', 'Camera & Gallery access required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!licenseFront || !licenseBack) {
      Alert.alert('Missing Info', 'Please upload both front and back images of license.');
      return;
    }
    Alert.alert('Success', 'Driver profile saved successfully.');
  };

  return (
    <BackgroundOne
      imageSource={
        <TouchableOpacity onPress={handleProfileImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.dpImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={120} color="white" />
          )}
        </TouchableOpacity>
      }
    >
      <ScrollView contentContainerStyle={styles.form}>
        <InputButton placeholder="Full Name" value={name} onChangeText={setName} />
        <InputButton placeholder="CNIC" value={cnic} onChangeText={setCnic} keyboardType="numeric" />
        <InputButton placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
        <InputButton placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <InputButton placeholder="Address" value={address} onChangeText={setAddress} />

        {/* 🔘 Smart Upload Button */}
        <View style={styles.uploadButtonBox}>
          <MyButton title="Upload License Images" onPress={handleLicenseUpload} />
          <Text style={styles.uploadMessage}>{uploadMessage}</Text>
        </View>

        {/* 🖼️ Preview Both */}
        {licenseFront && (
          <Image source={{ uri: licenseFront }} style={styles.licensePreview} />
        )}
        {licenseBack && (
          <Image source={{ uri: licenseBack }} style={styles.licensePreview} />
        )}

        {/* ✅ Save Profile */}
        <View style={{ marginTop: 30 }}>
          <MyButton title="Save Profile" onPress={handleSave} />
        </View>
      </ScrollView>
    </BackgroundOne>
  );
};

export default DriverProfile;

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 20,
    paddingTop: 0,
    alignItems: 'center',
    gap: 2,
    paddingBottom: 200,
  },
  dpImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  licensePreview: {
    width: 220,
    height: 120,
    borderRadius: 10,
    marginTop: 10,
  },
  uploadMessage: {
    marginTop: 5,
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  uploadButtonBox: {
    alignItems: 'center',
    marginTop: 10,
  },
});
