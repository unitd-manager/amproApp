import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../constants/api';

export default function EnquiryHistory({ navigation }) {
  const [enquiries, setEnquiries] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const initialize = async () => {
      try {
        if (user) {
          api
            .post(`/enquiry/getEnquiryByContactId`, {
              contact_id: user?.contact_id,
            })
            .then((res) => {
              const sorted = res.data.data?.sort(
                (a, b) => b.enquiry_id - a.enquiry_id
              );
              setEnquiries(sorted);
            })
            .catch((err) => {
              console.log('API Error:', err);
            });
        }
      } catch (e) {
        console.error('Error:', e);
      }
    };

    initialize();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('EnquiryDetails', { enquiry: item })}
      >
        <Text style={styles.orderId}>{item.type} #{item.enquiry_id}</Text>
        <Text style={styles.orderId}>{item.type} {item.enquiry_code}</Text>
        <Text style={styles.date}>{item.enquiry_date}</Text>
        <Text style={styles.label}>{item.order_code}</Text>

        <View
          style={[
            styles.statusBadge,
            item.status === 'Completed'
              ? styles.approved
              : item.status === 'Cancelled'
              ? styles.rejected
              : item.status === 'Pending'
              ? styles.pending
              : item.status === 'In Progress'
              ? styles.inProgress
              : styles.new,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'Completed'
                ? styles.approvedText
                : item.status === 'Cancelled'
                ? styles.rejectedText
                : item.status === 'Pending'
                ? styles.pendingText
                : item.status === 'In Progress'
                ? styles.inProgressText
                : styles.newText,
            ]}
          >
            {item.status}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enquiry History</Text>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Enquiries</Text>
          <Text style={styles.summaryCount}>{enquiries.length}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Pending</Text>
          <Text style={styles.summaryCount}>
            {enquiries.filter((e) => e.order_code && e.order_code !== '').length}
          </Text>
        </View>
      </View>

      <FlatList
        data={enquiries}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.enquiry_id}-${index}`}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const font = 'Outfit-Regular';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    padding: 16,
  },
  header: {
    fontFamily: font,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#000000',
  },

  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    shadowColor: '#00000020',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryTitle: {
    fontFamily: font,
    color: '#444444',
    fontSize: 14,
  },
  summaryCount: {
    fontFamily: font,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#000000',
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#00000020',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },

  orderId: {
    fontFamily: font,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  date: {
    fontFamily: font,
    color: '#666666',
    fontSize: 13,
    marginVertical: 4,
  },
  label: {
    fontFamily: font,
    color: '#000000',
    fontSize: 14,
  },

  statusBadge: {
    position: 'absolute',
    right: 16,
    top: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  statusText: {
    fontFamily: font,
    fontSize: 12,
    fontWeight: '500',
  },

  approved: { backgroundColor: '#d7f5dd' },
  rejected: { backgroundColor: '#ffdede' },
  pending: { backgroundColor: '#fef2c0' },
  inProgress: { backgroundColor: '#e0f7fa' },
  new: { backgroundColor: '#f0f0f0' },

  approvedText: { color: '#008000' },
  rejectedText: { color: '#FF0000' },
  pendingText: { color: '#FFA500' },
  inProgressText: { color: '#0000FF' },
  newText: { color: '#808080' },
});
