// MenuOptions/Profile/ProfileScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Color';

const ProfileScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [profile, setProfile] = useState({
    name: typeof params.name === 'string' ? params.name : 'Your Name',
    phone: typeof params.phone === 'string' ? params.phone : '03XX-XXXXXXX',
    role: typeof params.role === 'string' ? params.role : 'Client',
    status: typeof params.status === 'string' ? params.status : 'Active',
    dp:
      typeof params.dp === 'string'
        ? params.dp
        : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  });

  const [showMenu, setShowMenu] = useState(false);

  const handleMenuOption = (action: 'view' | 'edit' | 'logout') => {
    setShowMenu(false);

    switch (action) {
      case 'view':
        router.push({
          pathname: '/(tabs)/Client/MenuOptions/Profile/ViewClientProfile',
          params: profile,
        });
        break;
      case 'edit':
        router.push({
          pathname: '/(tabs)/Client/MenuOptions/Profile/EditProfile',
          params: { ...profile, editing: 'true' },
        });
        break;
      case 'logout':
        Alert.alert('Logout', 'You have been logged out.');
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Your Profile</Text>
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Ionicons name="ellipsis-vertical" size={26} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Dropdown menu */}
      {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuOption('view')}
          >
            <Text style={styles.menuText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuOption('edit')}
          >
            <Text style={styles.menuText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuOption('logout')}
          >
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Profile Info */}
      <Image source={{ uri: profile.dp }} style={styles.profileImage} />
      <Text style={styles.text}><Text style={styles.label}>Name:</Text> {profile.name}</Text>
      <Text style={styles.text}><Text style={styles.label}>Phone:</Text> {profile.phone}</Text>
      <Text style={styles.text}><Text style={styles.label}>Role:</Text> {profile.role}</Text>
      <Text style={styles.text}><Text style={styles.label}>Status:</Text> {profile.status}</Text>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginTop: 20,
    marginBottom: 30,
  },
  text: {
    fontSize: 18,
    marginBottom: 12,
    color: Colors.text,
  },
  label: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  menu: {
    position: 'absolute',
    top: 65,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 6,
    zIndex: 99,
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
    color: Colors.primary,
  },
});
