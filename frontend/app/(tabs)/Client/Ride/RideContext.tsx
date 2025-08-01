import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the structure of location data
type LocationData = {
  latitude: number;
  longitude: number;
  address: string;
};

// Define the shape of the context value
type RideContextType = {
  source: LocationData | null;
  setSource: (value: LocationData) => void;
  destination: LocationData | null;
  setDestination: (value: LocationData) => void;
  date: string;
  setDate: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  clearRide: () => void; // 🆕 Helper function to reset all values
};

// Create the context
const RideContext = createContext<RideContextType | undefined>(undefined);

// Create a provider component
export const RideProvider = ({ children }: { children: ReactNode }) => {
  const [source, setSource] = useState<LocationData | null>(null);
  const [destination, setDestination] = useState<LocationData | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Clear all ride values
  const clearRide = () => {
    setSource(null);
    setDestination(null);
    setDate('');
    setTime('');
  };

  return (
    <RideContext.Provider
      value={{
        source,
        setSource,
        destination,
        setDestination,
        date,
        setDate,
        time,
        setTime,
        clearRide,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

// Custom hook to use the ride context
export const useRide = (): RideContextType => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('❗ useRide must be used within a RideProvider');
  }
  return context;
};
