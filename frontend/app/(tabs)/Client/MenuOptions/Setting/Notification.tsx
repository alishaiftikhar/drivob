// NotificationScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const NotificationScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.content}>
        You can manage your notification preferences here:
      </Text>

      <View style={styles.list}>
        <Text style={styles.item}>• Ride updates</Text>
        <Text style={styles.item}>• Promotions</Text>
        <Text style={styles.item}>• App alerts</Text>
        <Text style={styles.item}>• New features</Text>
      </View>
    </ScrollView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e2e2e',
  },
  content: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  list: {
    marginLeft: 10,
  },
  item: {
    fontSize: 16,
    paddingVertical: 6,
    color: '#333',
  },
});
