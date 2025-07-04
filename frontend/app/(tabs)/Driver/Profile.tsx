import React, { useState } from 'react';
import {
  Alert,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
  const [licenseImage, setLicenseImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const pickImage = async (setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const camera = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted || !camera.granted) {
      Alert.alert('Permission Denied', 'Camera & Gallery access is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDPPress = () => pickImage(setProfileImage);
  const handleLicenseImage = () => pickImage(setLicenseImage);

  const handleSave = () => {
    if (!licenseImage) {
      Alert.alert('Missing License', 'Please upload your license image.');
      return;
    }
    Alert.alert('Profile Saved', 'Driver profile submitted.');
  };

  return (
    <BackgroundOne
      imageSource={
        <TouchableOpacity onPress={handleDPPress}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.dpImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={120} color="white" />
          )}
        </TouchableOpacity>
      }
    >
      <ScrollView contentContainerStyle={styles.form}>
        {/* Standard Input Fields */}
        <InputButton placeholder="Full Name" value={name} onChangeText={setName} />
        <InputButton placeholder="CNIC" value={cnic} onChangeText={setCnic} keyboardType="numeric" />
        <InputButton placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
        <InputButton placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <InputButton placeholder="Address" value={address} onChangeText={setAddress} />

        {/* Upload License MyButton */}
        <MyButton title="Upload License Image" onPress={handleLicenseImage} />

        {/* License Preview */}
        {licenseImage && (
          <Image source={{ uri: licenseImage }} style={styles.licensePreview} />
        )}

        {/* Save Button */}
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
    paddingTop: 20,
    alignItems: 'center',
    gap: 15,
    paddingBottom: 80,
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
});
