// RateTheRide.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RateTheRideScreen = () => {
  const [rating, setRating] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Your Ride</Text>
      <Text style={styles.subtitle}>How was your experience?</Text>

      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={40}
              color="#f1c40f"
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.thankyou}>
        {rating > 0 ? `Thank you for rating us ${rating} star${rating > 1 ? 's' : ''}!` : ''}
      </Text>
    </View>
  );
};

export default RateTheRideScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  starIcon: {
    marginHorizontal: 5,
  },
  thankyou: {
    fontSize: 16,
    color: '#2e7d32',
    marginTop: 10,
  },
});
