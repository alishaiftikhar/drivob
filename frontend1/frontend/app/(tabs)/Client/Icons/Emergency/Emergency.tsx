import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Color';

const emergencyContacts = [
  {
    label: 'Police Helpline',
    number: '15', // You can replace this with your country's emergency number
  },
  {
    label: 'Family Contact',
    number: '03001234567', // Replace with your actual emergency contact
  },
  {
    label: 'Admin Support',
    number: '03111234567', // Admin number
  },
];

const EmergencyScreen = () => {
  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleSendAlert = (label: string) => {
    Alert.alert(
      'Alert Sent',
      `Emergency alert sent to ${label}`,
      [{ text: 'OK' }],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Assistance</Text>

      {emergencyContacts.map((contact, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.contactLabel}>{contact.label}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => handleCall(contact.number)} style={styles.iconButton}>
              <Ionicons name="call" size={24} color="#fff" />
              <Text style={styles.iconLabel}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSendAlert(contact.label)} style={[styles.iconButton, { backgroundColor: 'crimson' }]}>
              <Ionicons name="alert-circle" size={24} color="#fff" />
              <Text style={styles.iconLabel}>Send Alert</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

export default EmergencyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
  },
  contactLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: Colors.primary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  iconLabel: {
    color: '#fff',
    marginTop: 5,
  },
});
