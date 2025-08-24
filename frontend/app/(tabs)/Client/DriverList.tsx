import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/constants/apiConfig';
import Colors from '@/constants/Color';

interface Driver {
  id: number;
  full_name: string;
  status: string;
  phone_number: string;
  city: string;
  user: {
    id: number;
    email: string;
    is_driver: boolean;
    is_active: boolean;
  };
}

const DriverList: React.FC = () => {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDrivers = async () => {
    try {
      const response = await api.get('/available-drivers/');
      console.log('Driver list response:', response.data);
      
      if (response.data && response.data.drivers) {
        setDrivers(response.data.drivers);
      } else {
        setDrivers([]);
      }
    } catch (error: any) {
      console.error('Error fetching drivers:', error);
      Alert.alert('Error', 'Failed to fetch drivers. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDrivers();
  };

  const handleDriverSelect = (driver: Driver) => {
    // Navigate to ride details with selected driver
    router.push({
      pathname: '/(tabs)/Client/Ride/RideDetails',
      params: { driverId: driver.id.toString() }
    });
  };

  const renderDriverItem = ({ item }: { item: Driver }) => (
    <TouchableOpacity 
      style={styles.driverCard} 
      onPress={() => handleDriverSelect(item)}
    >
      <View style={styles.driverInfo}>
        <Text style={styles.driverName}>{item.full_name || 'Unnamed Driver'}</Text>
        <Text style={styles.driverContact}>{item.phone_number || 'No phone number'}</Text>
        <Text style={styles.driverCity}>{item.city || 'Location not specified'}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={[
          styles.statusBadge, 
          { backgroundColor: item.status === 'available' ? '#4CAF50' : '#FFC107' }
        ]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading drivers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Drivers</Text>
      
      {drivers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No drivers available at the moment</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={drivers}
          renderItem={renderDriverItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default DriverList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  driverCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  driverContact: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  driverCity: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    marginLeft: 10,
  },
  statusBadge: {
    fontSize: 12,
    color: 'white',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
    fontWeight: '600',
  },
});