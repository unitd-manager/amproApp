import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Text, Avatar, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../constants/api';
import imageBase from '../constants/imageBase';
import AddressSection from '../components/AddressSection';

const Profile = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});
  const [originalProfile, setOriginalProfile] = useState({});

  const getUser = () => {
    api.post("/contact/getContactsById", { contact_id: user.contact_id })
      .then((res) => {
        setProfile(res.data.data[0]);
        setOriginalProfile(res.data.data[0]);
      })
      .catch((err) => console.log(err));
  };

  const updateContact = () => {
    const Address = {
      contact_id: profile.contact_id,
      address1: profile.address1,
      address2: profile.address2,
      address_area: profile.address_area,
      address_city: profile.address_city,
      address_state: profile.address_state,
      address_po_code: profile.address_po_code,
address_country_code: profile.address_country_code,
    };

    api.post("/contact/editContactData", profile)
      .then(() => api.post("/contact/editContactAddress", Address))
      .then(() => {
        Alert.alert("Account Info Updated successfully");
        setEditing(false);
        getUser();
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Unable to Edit the Account Info");
      });
  };

  const handleChange = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const cancelEdit = () => {
    setProfile(originalProfile);
    setEditing(false);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('user');
        const user = jsonValue != null ? JSON.parse(jsonValue) : null;
        setUser(user);
        if (user) {
          setLoading(true);
          api.post("/contact/getContactsById", { contact_id: user.contact_id })
            .then((res) => {
              setProfile(res.data.data[0]);
              setOriginalProfile(res.data.data[0]);
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
        }
      } catch (e) {
        console.error('Error reading user from AsyncStorage:', e);
      }
    };
    initialize();
  }, []);

  return loading ? (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#1E90FF" />
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar.Icon 
          size={100} 
          icon={profile?.avatar ? "account" : "account-outline"}
          source={profile?.avatar ? { uri: profile.avatar } : undefined}
          backgroundColor={profile?.avatar ? "#fff" : "#e1e1e1"}
        />
      </View>

      {editing ? (
        <>
          {renderInput('first_name', 'Name')}
          {/* {renderInput('bio', 'Bio')} */}
          {renderInput('email', 'Email', 'email-address')}
          {renderInput('mobile', 'Mobile', 'phone-pad')}
          {renderInput('gst', 'GST/Tax Registration Number')}
          {renderInput('fssai', 'FSSAI Number')}
          {renderInput('iec', 'Import Export License')}
          {renderInput('pan', 'PAN/BRC')}

          <Text style={styles.sectionHeader}>Address Details</Text>
          {renderInput('address1', 'Address Line 1')}
          {renderInput('address2', 'Address Line 2')}
          {renderInput('address_area', 'Area')}
          {renderInput('address_city', 'City')}
          {renderInput('address_state', 'State')}
          {renderInput('address_po_code', 'Zip Code', 'number-pad')}
          {renderInput('address_country_code', 'Country Code')}

          <View style={styles.buttonGroup}>
            <Button mode="contained" onPress={updateContact} style={styles.button}>Save</Button>
            <Button mode="contained" onPress={cancelEdit} style={styles.button}>Cancel</Button>
          </View>
        </>
      ) : (
        <>
          <View style={{ alignItems: 'center' }}>
  <Text style={styles.name}>{profile?.first_name}</Text>
  {/* <Text style={styles.bio}>{profile?.bio}</Text> */}
  <Text style={styles.text}>{profile?.email}</Text>
  <Text style={styles.text}>{profile?.mobile}</Text>

  <AddressSection profile={profile} />
</View>

          <View style={styles.editButtonWrapper}>
            <Button mode="contained" onPress={() => setEditing(true)} style={styles.button}>Edit Profile</Button>
          </View>
        </>
      )}
    </ScrollView>
  );

  function renderInput(key, placeholder, keyboardType = 'default') {
    return (
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#666"
        value={profile?.[key] || ''}
        onChangeText={text => handleChange(key, text)}
        keyboardType={keyboardType}
      />
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingBottom: 80,
    fontFamily: 'Outfit-Regular',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Outfit-Regular',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
    fontFamily: 'Outfit-Regular',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    marginBottom: 15,
    fontSize: 16,
    paddingVertical: 8,
    color: '#000',
    fontFamily: 'Outfit-Regular',
  },
  sectionHeader: {
    fontSize: 18,
    //fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
    fontFamily: 'Outfit-Regular',
  },
  name: {
    fontSize: 22,
    //fontWeight: 'bold',
    marginTop: 10,
    color: '#000',
    fontFamily: 'Outfit-Regular',
  },
  bio: {
    fontSize: 16,
    marginTop: 4,
    color: '#000',
    fontFamily: 'Outfit-Regular',
  },
  text: {
    fontSize: 16,
    marginTop: 2,
    color: '#000',
    fontFamily: 'Outfit-Regular',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    fontFamily: 'Outfit-Regular',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    marginTop: 10,
    backgroundColor: '#00B4D8',
    fontFamily: 'Outfit-Regular',
  },
  editButtonWrapper: {
    marginTop: 30,
    fontFamily: 'Outfit-Regular',
  },
});

export default Profile;
