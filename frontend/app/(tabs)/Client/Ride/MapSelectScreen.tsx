// MapSelectScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MapView, { Marker, MapPressEvent, LatLng } from 'react-native-maps';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MyButton from '@/components/MyButton';
import axios from 'axios';

const MapSelectScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mapRef = useRef<MapView | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSelectLocation = async (event: MapPressEvent) => {
    const coordinate = event.nativeEvent.coordinate;
    setSelectedLocation(coordinate);

    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: coordinate.latitude,
          lon: coordinate.longitude,
          format: 'json',
          zoom: 18,
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'DrivoApp/1.0 (contact@example.com)',
          'Accept-Language': 'en',
        },
      });
      if (res.data && res.data.display_name) {
        setSelectedAddress(res.data.display_name);
      } else {
        setSelectedAddress(null);
      }
    } catch (error) {
      setSelectedAddress(null);
      console.error('Reverse geocode error:', error);
    }
  };

  const handleConfirmLocation = () => {
    if (!selectedLocation) {
      Alert.alert('No location selected', 'Please select a location by tapping on the map.');
      return;
    }

    const currentSource = params.source || '';
    const currentDestination = params.destination || '';

    router.replace({
      pathname: '/(tabs)/Client/Ride/RideDetails',
      params: {
        [params.type as string || 'source']: selectedAddress || '',
        source: params.type === 'source' ? (selectedAddress || '') : currentSource,
        destination: params.type === 'destination' ? (selectedAddress || '') : currentDestination,
      },
    });
  };

  const searchLocation = async () => {
    if (!searchText.trim()) {
      Alert.alert('Error', 'Please enter a location to search.');
      return;
    }
    setSearching(true);
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: searchText,
          format: 'json',
          addressdetails: 1,
          limit: 1,
          zoom: 18,
        },
        headers: {
          'User-Agent': 'DrivoApp/1.0 (contact@example.com)',
          'Accept-Language': 'en',
        },
      });
      if (res.data && res.data.length > 0) {
        const loc = res.data[0];
        const newRegion = {
          latitude: parseFloat(loc.lat),
          longitude: parseFloat(loc.lon),
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
        setSelectedLocation({ latitude: newRegion.latitude, longitude: newRegion.longitude });
        setSelectedAddress(loc.display_name || null);
      } else {
        Alert.alert('Not found', 'Could not find location matching your search');
        setSelectedAddress(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search location');
      setSelectedAddress(null);
      console.error('Search location error:', error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search location"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={searchLocation}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {/* Removed disabled prop to fix typescript error */}
          <MyButton
            title={searching ? 'Searching...' : 'Search'}
            onPress={searchLocation}
            style={styles.searchButton}
          />
        </View>

        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 24.8607,
            longitude: 67.0011,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={handleSelectLocation}
          zoomControlEnabled
          zoomEnabled
          scrollEnabled
          rotateEnabled
          pitchEnabled
          showsBuildings
          showsPointsOfInterest
        >
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              title="Selected Location"
              description={selectedAddress || ''}
              pinColor="blue"
            />
          )}
        </MapView>

        <View style={styles.confirmButtonContainer}>
          <MyButton
            title={
              selectedAddress
                ? `Confirm Location: ${selectedAddress}`
                : selectedLocation
                ? `Confirm Location (${selectedLocation.latitude.toFixed(5)}, ${selectedLocation.longitude.toFixed(5)})`
                : 'Select a Location'
            }
            onPress={handleConfirmLocation}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default MapSelectScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 25,
    marginHorizontal: 20,
    borderRadius: 30,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignItems: 'center',
    zIndex: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#022a53ff',
  },
  map: { flex: 1 },
  confirmButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 15,
    right: 15,
  },
});
