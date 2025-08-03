import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, MapPressEvent, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useRide } from './RideContext';
import MyButton from '@/components/MyButton'; // ✅ Import your custom button

const SourceMapScreen = () => {
  const router = useRouter();
  const { setSource } = useRide();

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [formattedAddress, setFormattedAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState<string>('');
  const [region, setRegion] = useState<Region>({
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const handleMapPress = async (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    setLoading(true);

    try {
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = addressResponse[0];
      const formatted = `${address.name || ''}, ${address.city || ''}, ${address.region || ''}, ${address.country || ''}`;
      setFormattedAddress(formatted);
    } catch (error) {
      setFormattedAddress('Unknown address');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchText) return;
    setLoading(true);
    try {
      const results = await Location.geocodeAsync(searchText);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        setSelectedLocation({ latitude, longitude });

        const addressResponse = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        const address = addressResponse[0];
        const formatted = `${address.name || ''}, ${address.city || ''}, ${address.region || ''}, ${address.country || ''}`;
        setFormattedAddress(formatted);
      } else {
        alert('Location not found');
      }
    } catch (error) {
      alert('Error while searching location');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation && formattedAddress) {
      setSource({
        ...selectedLocation,
        address: formattedAddress,
      });
      router.push('/(tabs)/Client/Ride/RideDetails');
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔍 Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search for a location..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
        <MyButton
          title="Search"
          onPress={handleSearch}
          style={styles.searchBtnOverride}
        />
      </View>

      {/* 🗺️ Map View */}
      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} title="Source Location" />
        )}
      </MapView>

      {/* ✅ Confirm Button */}
      {selectedLocation && !loading && (
        <MyButton
          title={formattedAddress || 'Confirm Source'}
          onPress={handleConfirm}
          style={styles.confirmBtnOverride}
        />
      )}

      {/* ⏳ Loader */}
      {loading && (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color="#FF5722"
        />
      )}
    </View>
  );
};

export default SourceMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dbd1d1ff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  searchBar: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f0f0ff',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
    zIndex: 50,
    elevation: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    paddingLeft: 8,
  },
  searchBtnOverride: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginLeft: 10,
  },
  confirmBtnOverride: {
    position: 'absolute',
    bottom: 40,
    left: 30,
    right: 30,
  },
  loader: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
});
