import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Color';

const SCREEN_WIDTH = Dimensions.get('window').width;

const MenuNavigation = ({ visible, toggleSidebar }: { visible: boolean, toggleSidebar: () => void }) => {
  const router = useRouter();

  const menuOptions = [
    { label: 'Profile', path: '/(tabs)/Client/MenuOptions/Profile/ProfileScreen' },
    { label: 'Settings', path: '/(tabs)/Client/MenuOptions/Setting/SettingScreen' },
    { label: 'Language', path: '/(tabs)/Client/MenuOptions/Language/LanguageScreen' },
    { label: 'Type Selector', path: '/(tabs)/Client/MenuOptions/TypeSelector/TypeSelectorScreen' },
    { label: 'Payment', path: '/(tabs)/Client/MenuOptions/Payment/PaymentScreen' },
    { label: 'Ride History', path: '/(tabs)/Client/MenuOptions/RideHistory/RideHistoryScreen' },
    { label: 'Reviews', path: '/(tabs)/Client/MenuOptions/Reviews/ReviewsScreen' },
    { label: 'Ride Details', path: '/(tabs)/Client/RideDetail' },  // ✅ Added this line
    { label: 'Logout', path: 'logout' }
  ];

  const sidebarAnim = useRef(new Animated.Value(visible ? 0 : -SCREEN_WIDTH * 0.7)).current;

  useEffect(() => {
    Animated.timing(sidebarAnim, {
      toValue: visible ? 0 : -SCREEN_WIDTH * 0.7,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  const handlePress = (item: { label: string; path: string }) => {
    toggleSidebar();
    if (item.path === 'logout') {
      alert('You have been logged out.');
    } else {
      router.push(item.path as any);
    }
  };

  return (
    <Animated.View style={[styles.sidebar, { right: sidebarAnim }]}>
      {menuOptions.map((item, index) => (
        <TouchableOpacity key={index} style={styles.menuItem} onPress={() => handlePress(item)}>
          <Ionicons name="chevron-forward" size={20} color={Colors.primary} style={{ marginRight: 10 }} />
          <Text style={styles.menuText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
};

export default MenuNavigation;

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.7,
    backgroundColor: 'white',
    paddingTop: 70,
    paddingHorizontal: 20,
    elevation: 15,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 18,
    color: Colors.primary,
  },
});
