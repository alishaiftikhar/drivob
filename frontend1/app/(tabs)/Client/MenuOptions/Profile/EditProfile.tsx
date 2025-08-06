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
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import InputButton from '@/components/Inputbutton';
import MyButton from '@/components/MyButton';
import BackgroundOne from '@/components/BackgroundDesign';
import Colors from '@/constants/Color';

const EditClientProfile = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [name, setName] = useState(typeof params.name === 'string' ? params.name : '');
  const [phone, setPhone] = useState(typeof params.phone === 'string' ? params.phone : '');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');
  const [cnic, setCnic] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(
    typeof params.dp === 'string' ? params.dp : null
  );

  const handleIconPress = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission is needed to access the gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!name || !phone) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    // Navigate back to Menu Profile with updated data
    router.replace({
      pathname: '/(tabs)/Client/MenuOptions/Profile/ProfileScreen',
      params: {
        name,
        phone,
        dp: profileImage || '',
        role: 'Client',
        status: 'Active',
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
          <ScrollView contentContainerStyle={styles.container}>
            <InputButton placeholder="Full Name" value={name} onChangeText={setName} />
            <InputButton placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <InputButton placeholder="Address" value={address} onChangeText={setAddress} />
            <InputButton placeholder="CNIC" value={cnic} onChangeText={setCnic} keyboardType="numeric" />
            <InputButton placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />

            <View style={{ marginTop: 30 }}>
              <MyButton title="Save Profile" onPress={handleSave} />
            </View>
          </ScrollView>
        </BackgroundOne>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default EditClientProfile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 100,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
  },
});
