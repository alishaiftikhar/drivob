// File: app/(tabs)/Client/MenuOptions/DatePickerScreen.tsx

import React, { useState } from 'react';
import { View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useRide } from './RideContext';  // ✅ Adjust this path if needed

const DatePickerScreen = () => {
  const [pickerDate, setPickerDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(true);
  const router = useRouter();
  const { setDate } = useRide(); // ✅ Get setDate from context

  const onChange = (event: any, selectedDate?: Date) => {
    if (event?.type === 'set' && selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // e.g., 2025-08-01
      setDate(formattedDate); // ✅ Save to context
      router.replace('/(tabs)/Client/Ride/RideDetails'); // ✅ Navigate without params
    } else {
      router.back(); // User cancelled
    }
    setShowPicker(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {showPicker && (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DatePickerScreen;
