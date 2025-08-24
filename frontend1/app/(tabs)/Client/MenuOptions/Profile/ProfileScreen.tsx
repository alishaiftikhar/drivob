import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import api from '@/constants/apiConfig';
import Colors from '@/constants/Color';

interface UserType {
  is_client: boolean;
  is_driver: boolean;
  email: string;
  user_id: number;
}

interface Profile {
  dp?: string;
  dp_url?: string;
  full_name?: string;
  phone_number?: string;
  cnic?: string;
  address?: string;
  age?: number;
  city?: string;
  status?: string;
  [key: string]: any;
}

const ProfileScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token missing. Please login again.');
        router.replace('/(tabs)/Login');
        return;
      }

      // Fetch user type
      const userTypeResponse = await api.get('/user-type/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserType(userTypeResponse.data);

      // Decide which profile endpoint to use
      const profileEndpoint = userTypeResponse.data.is_client
        ? '/user-profile/'
        : '/driver-profile/';

      const profileResponse = await api.get(profileEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (profileResponse && profileResponse.data) {
        setProfile(profileResponse.data);
        setImageError(false);
      } else {
        setProfile({
          full_name: userTypeResponse.data.email?.split('@')[0] || 'User',
          phone_number: '',
          address: '',
          city: '',
        });
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/Login') },
        ]);
        return;
      }
      setProfile({
        full_name: 'User',
        phone_number: '',
        address: '',
        city: '',
      });
      Alert.alert('Error', 'Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileOptions = () => setOptionsModalVisible(true);

  const handleViewProfile = () => {
    setOptionsModalVisible(false);
    router.push({
      pathname: '/(tabs)/Client/MenuOptions/Profile/ViewClientProfile',
      params: {
        profileData: JSON.stringify(profile),
        userType: JSON.stringify(userType),
      },
    });
  };

  const handleEditProfile = () => {
    setOptionsModalVisible(false);
    router.push({
      pathname: '/(tabs)/Client/MenuOptions/Profile/EditProfile',
      params: {
        profileData: JSON.stringify(profile),
        userType: JSON.stringify(userType),
      },
    });
  };

  const handleCancel = () => setOptionsModalVisible(false);

  const getUserStatus = () => {
    if (userType?.is_client) return 'Active Client';
    if (userType?.is_driver) return profile?.status || 'Driver';
    return 'User';
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </SafeAreaView>
    );
  }

  const getUserInitials = () => {
    if (profile?.full_name) {
      const names = profile.full_name.trim().split(' ');
      return (names[0][0] + (names[1]?.[0] || '')).toUpperCase();
    }
    return 'U';
  };

  const getProfileImageUrl = () => {
    if (profile?.dp_url && !imageError) {
      return profile.dp_url;
    }
    if (profile?.dp && !imageError) {
      if (profile.dp.startsWith('http')) {
        return profile.dp;
      } else {
        const baseUrl = 'http://192.168.100.7:8000';
        return `${baseUrl}/media/${profile.dp}`;
      }
    }
    return null;
  };

  const profileImageUrl = getProfileImageUrl();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileImageContainer}>
        <View style={[styles.profileCircle, { borderColor: Colors.primary }]}>
          {profileImageUrl ? (
            <Image
              source={{ uri: profileImageUrl }}
              style={styles.profileImage}
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.defaultProfileContainer}>
              <Text style={[styles.defaultProfileText, { color: Colors.primary }]}>
                {getUserInitials()}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Profile Information */}
      <View style={styles.profileInfoText}>
        <Text style={styles.infoText}>
          <Text style={styles.infoLabel}>Name: </Text>
          {profile?.full_name || 'Not provided'}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.infoLabel}>Phone: </Text>
          {profile?.phone_number || 'Not provided'}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.infoLabel}>Status: </Text>
          {getUserStatus()}
        </Text>
      </View>

      {/* Profile Options Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.profileOptionsButton} onPress={handleProfileOptions}>
          <Text style={styles.buttonText}>Profile Options</Text>
        </TouchableOpacity>
      </View>

      {/* Options Modal */}
      <Modal
        visible={optionsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Profile Options</Text>

            <TouchableOpacity style={styles.optionButton} onPress={handleViewProfile}>
              <Text style={styles.optionText}>View Full Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={handleEditProfile}>
              <Text style={styles.optionText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.primary,
    marginTop: 10,
    fontSize: 16,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 70,
  },
  profileCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  defaultProfileContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultProfileText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  profileInfoText: {
    alignItems: 'center',
    marginBottom: 30,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
    color: 'black',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: 'black',
  },
  buttonContainer: {
    width: '90%',
    marginTop: 20,
  },
  profileOptionsButton: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.primary,
  },
  optionButton: {
    paddingVertical: 15,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff3b30',
  },
});

export default ProfileScreen;
