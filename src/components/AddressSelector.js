import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AddressSelector = ({ addresses = [], onSelect }) => {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id);
    onSelect && onSelect(id);
  };

  const renderIcon = (label) => {
    switch (label.toLowerCase()) {
      case 'home':
        return <Icon name="home" size={24} color="#007AFF" />;
      case 'office':
        return <Icon name="briefcase" size={24} color="#007AFF" />;
      default:
        return <Icon name="map-marker" size={24} color="#007AFF" />;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelect(item.customer_address_id)}>
      {/* <View style={styles.iconContainer}>{renderIcon(item.label)}</View> */}
      <View style={styles.addressInfo}>
        <Text style={styles.label}>{item.customer_address_id === 'profile'
                ? 'Profile Address'
                : item.shipper_name || 'Address'}</Text>
        <Text style={styles.address}>{item.address_flat}, {item.address_street}{'\n'}
            {item.address_city}, {item.address_town} - {item.address_po_code}{'\n'}
            {item.address_state}, {item.address_country}</Text>
      </View>
      <View style={styles.radioCircle}>
        {selectedId === item.customer_address_id && <View style={styles.selectedDot} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shipping Address</Text>
      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={(item) => item.customer_address_id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:20,
    padding: 16,
    backgroundColor: '#fff',
    fontFamily: 'Outfit-Regular',
  },
  title: {
    fontSize: 18,
    //fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Outfit-Regular',
  },
  listContainer: {
    paddingBottom: 20,
    fontFamily: 'Outfit-Regular',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    fontFamily: 'Outfit-Regular',
  },
  iconContainer: {
    marginRight: 10,
    marginTop: 2,
    fontFamily: 'Outfit-Regular',
  },
  addressInfo: {
    flex: 1,
    fontFamily: 'Outfit-Regular',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Outfit-Regular',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    fontFamily: 'Outfit-Regular',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginTop: 4,
    fontFamily: 'Outfit-Regular',
  },
  selectedDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    fontFamily: 'Outfit-Regular',
  },
});

export default AddressSelector;
