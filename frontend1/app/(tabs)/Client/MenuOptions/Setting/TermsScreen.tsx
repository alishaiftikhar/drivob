// TermsAndConditions.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const TermsAndConditionsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Terms & Conditions</Text>

      <Text style={styles.paragraph}>
        Welcome to our Driver Hiring App. Please read the following terms and conditions carefully:
      </Text>

      <Text style={styles.bullet}>• Use this app responsibly and ethically.</Text>
      <Text style={styles.bullet}>• Respect all users and drivers.</Text>
      <Text style={styles.bullet}>• Payments must be made securely through the app.</Text>
      <Text style={styles.bullet}>• Misuse of services may result in account suspension.</Text>
      <Text style={styles.bullet}>• All your data is protected and follows privacy policies.</Text>

      <Text style={styles.paragraph}>
        By using this app, you agree to abide by all the above terms. Thank you for choosing us!
      </Text>
    </ScrollView>
  );
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c2c2c',
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    lineHeight: 24,
  },
  bullet: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
    paddingLeft: 10,
  },
});
