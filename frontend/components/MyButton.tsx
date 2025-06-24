import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Color from '@/constants/Color';  

const MyButton = (props) => {
  const { title, onPress } = props;

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Color.primary,   
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: Color.text,          
    shadowOffset: { width: 4, height: 7 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: Color.text,   
    fontSize: 22,
    fontWeight: '600',
  },
});

export default MyButton;
