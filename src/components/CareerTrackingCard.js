import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CarrierTrackingCard = ({ tracking }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Carrier Tracking</Text>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Carrier Name :</Text>
          <Text style={styles.value}>{tracking?.carrier_name || 'N/A'}</Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>Container Number :</Text>
          <Text style={styles.value}>{tracking?.container_no || 'N/A'}</Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>Bill of Lading :</Text>
          <Text style={styles.value}>{tracking?.bill_of_loading || 'N/A'}</Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>Order Number :</Text>
          <Text style={styles.value}>{tracking?.order_no || 'N/A'}</Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>ETD :</Text>
          <Text style={styles.value}>{tracking?.actual_delivery_date || 'N/A'}</Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>ETA :</Text>
          <Text style={styles.value}>{tracking?.expected_delivery_date || 'N/A'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 40,
    fontFamily: 'Outfit-Regular',
  },
  title: {
    fontSize: 18,
    //fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Outfit-Regular',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontFamily: 'Outfit-Regular',
  },
  column: {
    width: '50%',
    marginBottom: 12,
    paddingRight: 10,
    fontFamily: 'Outfit-Regular',
  },
  label: {
    color: '#888',
    fontSize: 14,
    marginBottom: 2,
    fontFamily: 'Outfit-Regular',
  },
  value: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    fontFamily: 'Outfit-Regular',
  },
});

export default CarrierTrackingCard;
