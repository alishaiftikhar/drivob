// File: app/(tabs)/Client/MenuOptions/DatePickerScreen.tsx

import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

const DatePickerScreen = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(true);
  const router = useRouter();

  const onChange = (event: any, selectedDate?: Date) => {
    if (event?.type === 'set' && selectedDate) {
      const pickedDate = selectedDate.toISOString();
      router.replace({
        pathname: '/(tabs)/Client/Ride/RideDetails',
        params: { selectedDate: pickedDate },
      });
    } else {
      // If user cancels
      router.back();
    }
    setShowPicker(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {showPicker && (
        <DateTimePicker
          testID="datePicker"
          value={date}
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
