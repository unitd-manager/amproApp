import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
  Alert,
} from 'react-native';
import { Button } from 'react-native-paper';

const Checkout = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    contactNo: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (value.trim() !== '') {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  const validateFields = () => {
    let tempErrors = {};
    if (!form.full_name.trim()) tempErrors.full_name = 'Full name is required';
    if (!form.email.trim()) tempErrors.email = 'Email is required';
    if (!form.contactNo.trim()) tempErrors.contactNo = 'Contact number is required';
    if (!form.address.trim()) tempErrors.address = 'Address is required';
    if (!form.city.trim()) tempErrors.city = 'City is required';
    if (!form.postalCode.trim()) tempErrors.postalCode = 'Postal code is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCheckout = () => {
    if (validateFields()) {
      Alert.alert("Success", "Your order has been placed!");
      setForm({
        full_name: '',
        email: '',
        contactNo: '',
        address: '',
        city: '',
        postalCode: '',
        notes: '',
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Checkout</Text>

      <View style={styles.form}>
        <CustomInput
          placeholder="Full Name"
          value={form.full_name}
          onChangeText={(text) => handleChange('full_name', text)}
          error={errors.full_name}
        />
        <CustomInput
          placeholder="Email"
          value={form.email}
          onChangeText={(text) => handleChange('email', text)}
          keyboardType="email-address"
          error={errors.email}
        />
        <CustomInput
          placeholder="Contact No"
          value={form.contactNo}
          onChangeText={(text) => handleChange('contactNo', text)}
          keyboardType="phone-pad"
          error={errors.contactNo}
        />
        <CustomInput
          placeholder="Address"
          value={form.address}
          onChangeText={(text) => handleChange('address', text)}
          multiline
          numberOfLines={3}
          error={errors.address}
        />
        <CustomInput
          placeholder="City"
          value={form.city}
          onChangeText={(text) => handleChange('city', text)}
          error={errors.city}
        />
        <CustomInput
          placeholder="Postal Code"
          value={form.postalCode}
          onChangeText={(text) => handleChange('postalCode', text)}
          keyboardType="numeric"
          error={errors.postalCode}
        />
        <CustomInput
          placeholder="Order Notes (optional)"
          value={form.notes}
          onChangeText={(text) => handleChange('notes', text)}
          multiline
          numberOfLines={3}
        />

        <Button
          mode="contained"
          onPress={handleCheckout}
          style={styles.button}
        >
          Place Order
        </Button>
      </View>
    </ScrollView>
  );
};

const CustomInput = ({ placeholder, value, onChangeText, error, style, ...rest }) => (
  <View style={{ marginBottom: 16 }}>
    <TextInput
      style={[
        styles.input,
        style,
        error && { borderColor: 'red' }
      ]}
      placeholder={placeholder}
      placeholderTextColor="#888"
      value={value}
      onChangeText={onChangeText}
      {...rest}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  heading: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Outfit-Regular',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  input: {
    backgroundColor: '#f9f9f9',
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    textAlignVertical: 'top',
  },
  errorText: {
    marginTop: 4,
    color: 'red',
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#1EB1C5',
    paddingVertical: 6,
    borderRadius: 8,
  },
});

export default Checkout;
