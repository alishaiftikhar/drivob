import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Color';

const SettingsScreen = () => {
  const router = useRouter();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(true);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = React.useState(false);

  const toggleNotifications = () => setIsNotificationsEnabled(prev => !prev);
  const toggleDarkMode = () => setIsDarkModeEnabled(prev => !prev);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          Alert.alert('Logged Out', 'You have been logged out.');
          router.replace('/');
        },
      },
    ]);
  };

  const handleLanguageChange = () => {
    Alert.alert('Language', 'Language selection feature coming soon!');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Display privacy policy screen or link here.');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Contact us at support@example.com');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      {/* Toggle Options */}
      <View style={styles.option}>
        <Ionicons name="notifications" size={24} color={Colors.primary} />
        <Text style={styles.optionText}>Notifications</Text>
        <Switch value={isNotificationsEnabled} onValueChange={toggleNotifications} />
      </View>

      <View style={styles.option}>
        <Ionicons name="moon" size={24} color={Colors.primary} />
        <Text style={styles.optionText}>Dark Mode</Text>
        <Switch value={isDarkModeEnabled} onValueChange={toggleDarkMode} />
      </View>

      {/* Tap Options */}
      <TouchableOpacity style={styles.option} onPress={handleLanguageChange}>
        <MaterialIcons name="language" size={24} color={Colors.primary} />
        <Text style={styles.optionText}>Language</Text>
        <Feather name="chevron-right" size={20} color={Colors.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={handlePrivacyPolicy}>
        <Ionicons name="document-text-outline" size={24} color={Colors.primary} />
        <Text style={styles.optionText}>Privacy Policy</Text>
        <Feather name="chevron-right" size={20} color={Colors.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={handleSupport}>
        <Ionicons name="help-circle-outline" size={24} color={Colors.primary} />
        <Text style={styles.optionText}>Contact Support</Text>
        <Feather name="chevron-right" size={20} color={Colors.icon} />
      </TouchableOpacity>

      {/* App Version Info */}
      <View style={[styles.option, { borderBottomWidth: 0 }]}>
        <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
        <Text style={styles.optionText}>App Version</Text>
        <Text style={{ color: Colors.icon }}>1.0.0</Text>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 30,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    justifyContent: 'space-between',
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
    paddingBottom: 10,
  },
  optionText: {
    fontSize: 18,
    flex: 1,
    marginLeft: 15,
    color: Colors.text,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
