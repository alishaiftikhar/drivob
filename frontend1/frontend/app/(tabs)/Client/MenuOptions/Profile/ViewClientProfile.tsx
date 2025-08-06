import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import BackgroundOne from '@/components/BackgroundDesign';
import Colors from '@/constants/Color';

const ViewClientProfile = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const profile = {
    name: typeof params.name === 'string' ? params.name : 'Not Provided',
    phone: typeof params.phone === 'string' ? params.phone : 'Not Provided',
    role: typeof params.role === 'string' ? params.role : 'Client',
    status: typeof params.status === 'string' ? params.status : 'Active',
  };

  return (
    <BackgroundOne>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>
          <Text style={styles.heading}>Name: </Text>{profile.name}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.heading}>Phone: </Text>{profile.phone}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.heading}>Role: </Text>{profile.role}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.heading}>Status: </Text>{profile.status}
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </BackgroundOne>
  );
};

export default ViewClientProfile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 100,
    gap: 20,
  },
  label: {
    fontSize: 18,
    color: Colors.text,
  },
  heading: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  button: {
    marginTop: 40,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});
