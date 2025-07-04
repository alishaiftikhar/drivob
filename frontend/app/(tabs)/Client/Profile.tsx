import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router'; // ✅ Navigation added

import InputButton from '@/components/Inputbutton';
import MyButton from '@/components/MyButton';
import BackgroundOne from '../../../components/BackgroundDesign';
import Colors from '@/constants/Color';

const ClientProfile = () => {
  const router = useRouter(); // ✅ useRouter for navigation

  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleIconPress = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow gallery access');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSaveProfile = () => {
    // ✅ Perform validation here if needed
    if (!name || !cnic || !age || !phone || !address) {
      Alert.alert('Incomplete Info', 'Please fill in all fields.');
      return;
    }

    Alert.alert('Success', 'Profile Saved!');
    router.push('/GrantLocation'); // ✅ Navigate to next screen
  };

  return (
    <BackgroundOne
      imageSource={
        <TouchableOpacity onPress={handleIconPress}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{ width: 120, height: 120, borderRadius: 60 }}
            />
          ) : (
            <Ionicons name="person-circle-outline" size={120} color="white" />
          )}
        </TouchableOpacity>
      }
    >
      <View style={styles.form}>
        <InputButton placeholder="Full Name" value={name} onChangeText={setName} />
        <InputButton placeholder="CNIC" value={cnic} onChangeText={setCnic} keyboardType="numeric" />
        <InputButton placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
        <InputButton placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <InputButton placeholder="Address" value={address} onChangeText={setAddress} />

        <View style={{ marginTop: 50 }}>
          <MyButton title="Save Profile" onPress={handleSaveProfile} />
        </View>
      </View>
    </BackgroundOne>
  );
};

export default ClientProfile;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 40,
    gap: 15,
  },
});
