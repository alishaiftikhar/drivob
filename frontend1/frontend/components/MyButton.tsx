import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import Color from '@/constants/Color';

interface MyButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle; // Allow custom style from outside
}

const MyButton = ({ title, onPress, style }: MyButtonProps) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Color.primary,
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: Color.text,
    shadowOffset: { width: 4, height: 7 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    alignSelf: 'center', // Centered by default
  },
  buttonText: {
    color: Color.text,
    fontSize: 22,
    fontWeight: '600',
  },
});

export default MyButton;
