import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from '../constants/api';

const ContactUs = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contactNo: '',
    comments: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setUser(prev => ({ ...prev, [key]: value }));
    if (value.trim() !== '') {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  const [contact, setContact] = useState();
  const [contacts, setContacts] = useState();
  const [email, setEmail] = useState();
  const [website, setWebsite] = useState(); 
  const [address, setAddress] = useState();
  const [mailId, setmailId] = useState("");
  const [googlemapdata, setGoogleMapData] = useState('');

  const getEnquiryEmail = () => {
    api.get("/setting/getEnquiryMailId").then((res) => {
      setmailId(res.data.data[0]);
    });
  };
  const getContact = () => {
    api.get("/contact/getContacts").then((res) => {
      setContact(res.data.data[0]);
    });
  };

  const getEmail = () => {
    api.get("/contact/getEmail").then((res) => {
      setEmail(res.data.data[0]);
    });
  };

  const getWebsite = () => {
    api.get("/contact/getWebsite").then((res) => {
      setWebsite(res.data.data[0]);
    });
  };

  const getAddress = () => {
    api.get("/contact/getAddress").then((res) => {
      setAddress(res.data.data[0]);
    });
  };

  const getMobile = () => {
    api.get("/contact/getMobileContacts").then((res) => {
      setContacts(res.data.data[0]);
    });
  };

  const getGoogleMap = () =>{
    api.get('/setting/getSettingsForGoogleMap').then(res=>{
      setGoogleMapData(res.data.data[0])
     })
  }

  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/; // For 10-digit numbers
    let tempErrors = {};
    if (!user.first_name.trim()) tempErrors.first_name = 'First name is required';
    if (!user.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!emailRegex.test(user.email.trim())) {
      tempErrors.email = 'Invalid email format';
    }

    if (!user.contactNo.trim()) {
      tempErrors.contactNo = 'Contact number is required';
    } else if (!mobileRegex.test(user.contactNo.trim())) {
      tempErrors.contactNo = 'Invalid contact number format';
    }  
    if (!user.comments.trim()) tempErrors.comments = 'Message is required';
    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const ContactSubmit = (code) => {
    Alert.alert(
      'Confirm Submission',
      'Are you sure you want to submit this enquiry?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            api
              .post("/commonApi/addEnquiry", {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                comments: user.comments,
                enquiry_code: code,
              })
              .then((res) => {
                Alert.alert("Thank you!", "Your enquiry has been submitted.");
                setUser({
                  first_name: '',
                  last_name: '',
                  email: '',
                  contactNo: '',
                  comments: '',
                });
              })
              .catch((err) => {
                Alert.alert("Error", "Enquiry submission failed!");
              });
          },
        },
      ]
    );
  };

  const generateCode = () => {
    api.post('/commonApi/getCodeValues', { type: 'enquiry' })
      .then((res) => {
        ContactSubmit(res.data.data);
      })
      .catch(() => {
        ContactSubmit('');
      });
  };

  const handleSubmit = () => {
    if (validateFields()) {
      generateCode();
    }
  };

  useEffect(() => {
    getMobile();
    getContact();
    getAddress();
    getWebsite();
    getEmail();
    getEnquiryEmail();
    getGoogleMap();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Contact Us</Text>

      <View style={styles.form}>
        <CustomInput
          placeholder="First Name"
          value={user.first_name}
          onChangeText={(text) => handleChange('first_name', text)}
          error={errors.first_name}
        />
        <CustomInput
          placeholder="Last Name"
          value={user.last_name}
          onChangeText={(text) => handleChange('last_name', text)}
        />
        <CustomInput
          placeholder="Email"
          value={user.email}
          onChangeText={(text) => handleChange('email', text)}
          keyboardType="email-address"
          error={errors.email}
        />
        <CustomInput
          placeholder="Contact No"
          value={user.contactNo}
          onChangeText={(text) => handleChange('contactNo', text)}
          keyboardType="phone-pad"
          error={errors.contactNo}
        />
        <CustomInput
          placeholder="Message"
          value={user.comments}
          onChangeText={(text) => handleChange('comments', text)}
          multiline
          numberOfLines={4}
          error={errors.comments}
          style={{ height: 100 }}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
        >
          Submit
        </Button>
      </View>

      <View style={styles.infoBox}>
      <View style={styles.row}>
        <Icon name="phone" size={20} color="#000" />
        <Text style={styles.label}> Phone:</Text>
      </View>
      <Text style={styles.info}>{contact && contact.mobile}</Text>

      <View style={styles.row}>
        <Icon name="envelope" size={20} color="#000" />
        <Text style={styles.label}> Email:</Text>
      </View>
      <Text style={styles.info}>{email && email.mailId}</Text>

      <View style={styles.row}>
        <Icon name="globe" size={20} color="#000" />
        <Text style={styles.label}> Website:</Text>
      </View>
      <Text style={styles.info}>{website && website.web}</Text>

      <View style={styles.row}>
        <Icon name="map-marker" size={20} color="#000" />
        <Text style={styles.label}> Address:</Text>
      </View>
      <Text style={styles.info}>
        {address && address.addr}
      </Text>
    </View>
    </ScrollView>
  );
};

const CustomInput = ({ placeholder, value, onChangeText, error, style, ...rest }) => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  return (
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
};

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
    textAlignVertical: 'top', // important for multiline
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
  infoBox: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    fontFamily: 'Outfit-Regular',
  },
  label: {
    fontWeight: '600',
    color: '#555',
    marginTop: 8,
    fontFamily: 'Outfit-Regular',
  },
  info: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'Outfit-Regular',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10, // optional
  },
  
});

export default ContactUs;
