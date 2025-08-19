// FeaturesScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FeaturesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>App Features</Text>
      <Text style={styles.content}>• Real-time ride tracking
• Multiple ride options
• Emergency safety tools
• Secure payments
• Ratings & reviews system
• Live chat with driver/client</Text>
    </View>
  );
};

export default FeaturesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});
