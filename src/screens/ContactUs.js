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
import axios from 'axios';
import CountryPickerModal from '../components/CountryPickerModal';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
const [countries, setCountries] = useState([]);
const [filteredCountries, setFilteredCountries] = useState([]);
const [search, setSearch] = useState('');
const [showPicker, setShowPicker] = useState(false);

useEffect(() => {
  axios
    .get('https://restcountries.com/v3.1/all?fields=name,idd,cca2')
    .then(res => {
      const list = res.data
        .map(c => ({
          name: c.name?.common,
          dial_code:
            c.idd?.root && c.idd?.suffixes?.length
              ? `${c.idd.root}${c.idd.suffixes[0]}`
              : '',
          cca2: c.cca2
        }))
        .filter(c => c.dial_code); // remove empty codes

      setCountries(list);
      setFilteredCountries(list);
    });
}, []);
const handleSearch = text => {
  setSearch(text);
  const lower = text.toLowerCase();

  setFilteredCountries(
    countries.filter(
      c =>
        c.name.toLowerCase().includes(lower) ||
        c.dial_code.includes(lower)
    )
  );
};

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
          onPress: () => {
            setIsSubmitting(false);
          },
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
                setIsSubmitting(false);
              })
              .catch((err) => {
                Alert.alert("Error", "Enquiry submission failed!");
                setIsSubmitting(false);
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
      setIsSubmitting(true);
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
      <Text style={[styles.heading, { color: '#000' }]}>Contact Us</Text>

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
        <View style={{ marginBottom: 24 }}>
  <View style={styles.row}>
    <TouchableOpacity
      style={styles.countryCodeBtn}
      onPress={() => setShowPicker(true)}
    >
      <Text style={[styles.codeText, { color: '#000' }]}>
        {user.mobile_country_code || '+91'}
      </Text>
    </TouchableOpacity>

    <TextInput
      style={[styles.input, { color: '#000' }]}
      placeholder="Contact No"
      keyboardType="phone-pad"
      value={user.contactNo}
      onChangeText={text => handleChange('contactNo', text)}
    />
  </View>

<CountryPickerModal
  visible={showPicker}
  search={search}
  onSearch={handleSearch}
  countries={filteredCountries}
  onClose={() => setShowPicker(false)}
  onSelect={item => {
    handleChange('mobile_country_code', item.dial_code);
    setShowPicker(false);
  }}
/>

</View>

        <CustomInput
          placeholder="Message"
          value={user.comments}
          onChangeText={(text) => handleChange('comments', text)}
          multiline
          numberOfLines={4}
          error={errors.comments}
          style={{ height: 100,color: '#000' }}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={styles.button}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </View>

      <View style={styles.infoBox}>
      <View style={styles.row}>
        <Icon name="phone" size={20} color="#000" />
        <Text style={[styles.label, { color: '#000' }]}> Phone:</Text>
      </View>
      <Text style={[styles.info, { color: '#000' }]}>{contact && contact.mobile}</Text>

      <View style={styles.row}>
        <Icon name="envelope" size={20} color="#000" />
        <Text style={[styles.label, { color: '#000' }]}> Email:</Text>
      </View>
      <Text style={[styles.info, { color: '#000' }]}>{email && email.mailId}</Text>

      <View style={styles.row}>
        <Icon name="globe" size={20} color="#000" />
        <Text style={[styles.label, { color: '#000' }]}> Website:</Text>
      </View>
      <Text style={[styles.info, { color: '#000' }]}>{website && website.web}</Text>

      <View style={styles.row}>
        <Icon name="map-marker" size={20} color="#000" />
        <Text style={[styles.label, { color: '#000' }]}> Address:</Text>
      </View>
      <Text style={[styles.info, { color: '#000' }]}>
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
          { color: '#000' },
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
    color: '#000'
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
    color: '#000'
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
  countryCodeBtn: {
    height: 48,
    minWidth: 90,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  codeText: {
    fontFamily: 'Outfit-Regular',
    color: '#000'
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    paddingHorizontal: 12
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  flag: {
    width: 24,
    height: 18,
    marginRight: 12
  },
  countryText: {
    fontSize: 14,
    color: '#000',
  }

});

export default ContactUs;
