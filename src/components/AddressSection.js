import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AddressSection = ({ profile }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Address Details</Text>
      <Text style={styles.address}>
        {profile?.address1 || ''}{profile?.address1 && profile?.address2 ? ', ' : ''}
        {profile?.address2 || ''}
      </Text>
      <Text style={styles.address}>
        {[profile?.address_area, profile?.address_city].filter(Boolean).join(', ')}
      </Text>
      <Text style={styles.address}>
        {[profile?.address_state, profile?.address_po_code].filter(Boolean).join(' - ')}
      </Text>
      <Text style={styles.address}>
        {profile?.address_country_code || ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
    fontFamily: 'Outfit-Regular',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'Outfit-Regular',
    color: '#000000',
  },
  address: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'Outfit-Regular',
    color: '#000000',
  },
});

export default AddressSection;
