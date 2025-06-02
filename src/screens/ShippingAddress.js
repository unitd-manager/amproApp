import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet, Modal, ScrollView } from 'react-native';
import api from '../constants/api';
import { AuthContext } from '../context/AuthContext';

const CurvedButton = ({ title, onPress, color = '#00B4D8' }) => (
  <TouchableOpacity onPress={onPress} style={[styles.curvedButton, { backgroundColor: color }]}>
    <Text style={styles.curvedButtonText}>{title}</Text>
  </TouchableOpacity>
);


const ShippingAddress = () => {
  
  const [enquiries, setEnquiries] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

const { user, logout } = useContext(AuthContext);

  const [newAddress, setNewAddress] = useState({
    shipper_name: '',
    address_type: 'Shipping',
    address_flat: '',
    address_street: '',
    address_town: '',
    address_state: '',
    address_country: '',
    address_po_code: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.post(`/address/getQuoteTrackItemsById`, {
        contact_id: user?.contact_id,
      });
      setEnquiries(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (field, value) => {
    setNewAddress({ ...newAddress, [field]: value });
  };

  const validateFields = () => {
    let validationErrors = {};

    if (!newAddress.shipper_name.trim()) validationErrors.shipper_name = 'Shipper Name is required';
    if (!newAddress.address_flat.trim()) validationErrors.address_flat = 'Flat/House No. is required';
    if (!newAddress.address_town.trim()) validationErrors.address_town = 'Town/City is required';
    if (!newAddress.address_country.trim()) validationErrors.address_country = 'Country is required';
    if (!newAddress.address_po_code.trim()) {
      validationErrors.address_po_code = 'Postal Code is required';
    } else if (!/^\d+$/.test(newAddress.address_po_code)) {
      validationErrors.address_po_code = 'Postal Code must be numeric';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateFields()) return;

    const apiEndpoint = editMode
      ? `/address/editEquipmentRequestItem`
      : `/address/insertQuoteItems`;

    const payload = { ...newAddress, contact_id: user.contact_id };
    if (editMode) payload.company_address_id = selectedAddressId;

    try {
      await api.post(apiEndpoint, payload);
      Alert.alert(editMode ? 'Address Updated' : 'Address Added');
      fetchAddresses();
      setModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (address) => {
    setNewAddress(address);
    setSelectedAddressId(address.customer_address_id);
    setEditMode(true);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirm', 'Are you sure you want to delete?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await api.post(`/address/deleteTrackEditItem`, {
              customer_address_id: id,
            });
            Alert.alert('Address Deleted');
            fetchAddresses();
          } catch (err) {
            console.error(err);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shipping Address</Text>
      <CurvedButton title="Add Shipment Address" style={styles.customButton} onPress={() => {
        setNewAddress({
          shipper_name: '',
          address_type: 'Shipping',
          address_flat: '',
          address_street: '',
          address_town: '',
          address_state: '',
          address_country: '',
          address_po_code: '',
        });
        setEditMode(false);
        setModalVisible(true);
      }} />

      <FlatList
        data={enquiries}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.shipper_name}</Text>
            <Text>{item.address_flat}, {item.address_street}, {item.address_town}</Text>
            <Text>{item.address_state}, {item.address_country} {item.address_po_code}</Text>
            <View style={styles.actionRow}>
              <CurvedButton title="Edit" onPress={() => handleEdit(item)} />
              <CurvedButton title="Delete" color="red" onPress={() => handleDelete(item.customer_address_id)} />
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>{editMode ? 'Edit Address' : 'Add Address'}</Text>
          {[
  { name: 'shipper_name', label: 'Shipper Name', placeholder: 'Enter shipper name' },
  { name: 'address_flat', label: 'Flat/House No.', placeholder: 'Enter flat or house number' },
  { name: 'address_street', label: 'Street', placeholder: 'Enter street' },
  { name: 'address_town', label: 'Town/City', placeholder: 'Enter town or city' },
  { name: 'address_state', label: 'State', placeholder: 'Enter state' },
  { name: 'address_country', label: 'Country', placeholder: 'Enter country' },
  { name: 'address_po_code', label: 'Postal Code', placeholder: 'Enter postal code' },
].map(({ name, label, placeholder }) => (
  <View key={name} style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={newAddress[name]}
      onChangeText={(text) => handleInputChange(name, text)}
    />
    {errors[name] && <Text style={styles.errorText}>{errors[name]}</Text>}
  </View>
))}

          <TextInput
            style={styles.input}
            value={newAddress.address_type}
            editable={false}
          />

<View style={styles.editButtonWrapper}>
  <CurvedButton title={editMode ? 'Update Address' : 'Save Address'} onPress={handleSaveAddress} />
</View>
<View style={styles.editButtonWrapper}>
  <CurvedButton title="Cancel" onPress={() => setModalVisible(false)} />
</View>

        </ScrollView>
      </Modal>
    </View>
  );
};

export default ShippingAddress;

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 ,fontFamily: 'Outfit-Regular',},
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20,fontFamily: 'Outfit-Regular', },
  card: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8, marginBottom: 15,fontFamily: 'Outfit-Regular', },
  cardTitle: { fontWeight: 'bold', fontSize: 16, fontFamily: 'Outfit-Regular', },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10,fontFamily: 'Outfit-Regular', },
  modalContent: { padding: 20 ,fontFamily: 'Outfit-Regular', },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, fontFamily: 'Outfit-Regular', },
  inputGroup: { marginBottom: 10, fontFamily: 'Outfit-Regular', },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10 ,fontFamily: 'Outfit-Regular',},
  errorText: { color: 'red', fontSize: 12 ,fontFamily: 'Outfit-Regular',},
  customButton: {
    backgroundColor: '#00B4D8', // Change to your desired color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8, // Change for border radius
    alignItems: 'center',
    marginVertical: 5,
    fontFamily: 'Outfit-Regular',
  },
  customButtonText: {
    color: '#fff',
    //fontWeight: 'bold',
    fontFamily: 'Outfit-Regular',
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'Outfit-Regular',
  },
  buttonRow: {
    marginVertical: 8,
  },  
  editButtonWrapper: {
    marginTop: 30,
    fontFamily: 'Outfit-Regular',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    marginTop: 10,
    backgroundColor: '#00B4D8',
    fontFamily: 'Outfit-Regular',
  },
  curvedButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  curvedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
  },
  
});
