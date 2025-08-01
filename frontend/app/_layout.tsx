import React from 'react';
import { Stack } from 'expo-router';
import { RideProvider } from './(tabs)/Client/Ride/RideContext';

export default function RootLayout() {
  return (
    <RideProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* All your screens will be auto-loaded based on the folder structure */}
      </Stack>
    </RideProvider>
  );
}
