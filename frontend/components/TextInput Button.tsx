import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import Color from '@/constants/Color';

const App = () => {
  const [value, setValue] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter text"
        value={value}
        onChangeText={setValue}
      />
      <Text style={styles.output}>You entered: {value}</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingVertical: 20,
    backgroundColor: Color.background,
  },
  input: {
    borderWidth: 2,
    borderColor: Color.primary,
    padding: 10,
    borderRadius: 50,
    fontSize: 18,
    backgroundColor: 'white',
    shadowColor: Color.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  output: {
    marginTop: 20,
    fontSize: 18,
    color: Color.primary,
  },
});
