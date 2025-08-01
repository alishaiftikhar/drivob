// File: app/(tabs)/Client/MenuOptions/TimePickerScreen.tsx

import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useRide } from './RideContext'; // ✅ make sure correct path

const TimePickerScreen = () => {
  const [time, setTimeLocal] = useState(new Date());
  const [showPicker, setShowPicker] = useState(true);
  const router = useRouter();
  const { setTime } = useRide(); // ✅ use global context

  const onChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || time;
    setShowPicker(Platform.OS === 'ios');
    setTimeLocal(currentTime);

    const formattedTime = currentTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    setTime(formattedTime); // ✅ Save globally

    router.back(); // ✅ Go back instead of replace
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {showPicker && (
        <DateTimePicker
          testID="timePicker"
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default TimePickerScreen;
