import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, useColorScheme } from 'react-native';
import api from '../constants/api';
import Icon from 'react-native-vector-icons/Ionicons';

const SignUpScreen = ({navigation}) => {
  const [signupData, setSignupData] = useState({
    first_name: '',
    mobile: '',
    email: '',
    password: '',
  });

  const colorScheme = useColorScheme();
const isDarkMode = colorScheme === 'dark';

  const [formErrors, setFormErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [otp, setOTP] = useState('');
  const [mailId, setmailId] = useState('');
  const [userMessage, setMessage] = useState('');

  const generateOTP = () => {
    const min = 1000;
    const max = 9999;
    const newOTP = Math.floor(Math.random() * (max - min + 1)) + min;
    setOTP(newOTP.toString());
  };

  const getEmail = () => {
    api.get("/setting/getMailId").then((res) => {
      setmailId(res.data.data[0]);
    });
  };

  const getMessage = () => {
    api.get("/setting/getMessage").then((res) => {
      setMessage(res.data.data[0]);
    });
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!signupData.first_name.trim()) {
      errors.first_name = 'First Name is required';
    }

    if (!signupData.mobile.trim()) {
      errors.mobile = 'Mobile Number is required';
    } else if (!mobileRegex.test(signupData.mobile.trim())) {
      errors.mobile = 'Enter a valid 10-digit mobile number';
    }

    if (!signupData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(signupData.email.trim())) {
      errors.email = 'Enter a valid email address';
    }

    // Password Validation
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
  if (!signupData.password.trim()) {
    errors.password = 'Password is required';
  } else if (signupData.password.length < 8) {
    errors.password = 'Password should be at least 8 characters';
  } else if (!passwordPattern.test(signupData.password)) {
    errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character';
  }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendMail = () => {
    const to = signupData.email;
    const subject = "Registration";

    api
      .post("/commonApi/sendUseremail", { to, subject })
      .then((res) => {
        console.log(res.data.data);
        Alert.alert("Registration Email has been sent successfully");

        setTimeout(() => {
          navigation.navigate('LoginPage');
        }, 500);
        
      })
      .catch((err) => {
        Alert.alert("Registration Email already exists");
      });

    const adminTo = mailId.email;
    const text = JSON.stringify(signupData);
    const dynamic_template_data = {
      first_name: signupData.first_name,
      email: signupData.email,
      password: signupData.password,
    };
    api
      .post("/commonApi/sendregisteremail", {
        to: adminTo,
        text,
        subject,
        dynamic_template_data,
      })
      .then(() => {});
  };

  const handleSignup = () => {
    if (validateForm()) {
      console.log('Form Submitted:', signupData);
      const signupPayload = {
        ...signupData,
        otp_no: otp,
        creation_date: new Date().toLocaleString(),
        date_of_creation: new Date().toLocaleString(),
      };
      api
        .post("/api/register", signupPayload)
        .then((res) => {
          console.log(res.data.data);
          console.log('OTP:', otp);
          Alert.alert("Registered Successfully");
          sendMail();
        })
        .catch((err) => {
          Alert.alert("This Email is already Registered");
        });

      setSignupData({ first_name: '', mobile: '', email: '', password: '' });
      setFormErrors({});
    }
  };

  useEffect(() => {
    getEmail();
    getMessage();
    generateOTP();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Create <Text style={styles.titleHighlight}>New Account</Text>
      </Text>
      <Text style={styles.subtitle}>Looks like you don't have an account or connect with social networks</Text>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        placeholder="John"
        placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        style={styles.input}
        value={signupData.first_name}
        onChangeText={(text) => {
          setSignupData({ ...signupData, first_name: text });
          setFormErrors({ ...formErrors, first_name: '' });
        }}
      />
      {formErrors.first_name && <Text style={styles.errorText}>{formErrors.first_name}</Text>}

      <Text style={styles.label}>Mobile No.</Text>
      <TextInput
        placeholder="+91- XXX XXXXX XXX"
        placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        style={styles.input}
        keyboardType="numeric"
        value={signupData.mobile}
        onChangeText={(text) => {
          setSignupData({ ...signupData, mobile: text });
          setFormErrors({ ...formErrors, mobile: '' });
        }}
      />
      {formErrors.mobile && <Text style={styles.errorText}>{formErrors.mobile}</Text>}

      <Text style={styles.label}>Email Id</Text>
      <TextInput
        placeholder="eg: smartwave@gmail.com"
        placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        style={styles.input}
        keyboardType="email-address"
        value={signupData.email}
        onChangeText={(text) => {
          setSignupData({ ...signupData, email: text });
          setFormErrors({ ...formErrors, email: '' });
        }}
      />
      {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
          style={styles.passwordInput}
          secureTextEntry={!passwordVisible}
          value={signupData.password}
          onChangeText={(text) => {
            setSignupData({ ...signupData, password: text });
            setFormErrors({ ...formErrors, password: '' });
          }}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
        <Icon
                     name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                     size={20}
                     color="#9E9E9E"
                     style={styles.eyeIcon}
                   />
        </TouchableOpacity>
      </View>
      {formErrors.password && <Text style={styles.errorText}>{formErrors.password}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* <Text style={styles.loginText}>
        Already have an account? <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('LoginPage')}><Text style={styles.loginLink}>Login</Text></TouchableOpacity>      </Text> */}
    <View style={styles.footer}>
            <Text style={{ fontFamily: 'Outfit-Regular'}}> Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginPage')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    flexGrow: 1,
    fontFamily: 'Outfit-Regular',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Outfit-Regular',
  },
  titleHighlight: {
    color: '#00B4D8',
    fontFamily: 'Outfit-Regular',
  },
  subtitle: {
    textAlign: 'center',
    color: '#8e8e93',
    fontSize: 14,
    marginBottom: 32,
    fontFamily: 'Outfit-Regular',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
    fontFamily: 'Outfit-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 4,
    fontSize: 14,
    backgroundColor: '#fafafa',
    fontFamily: 'Outfit-Regular',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
    fontFamily: 'Outfit-Regular',
  },
  passwordInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#000',
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: '#999',
    fontFamily: 'Outfit-Regular',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Outfit-Regular',
  },
  button: {
    backgroundColor: '#00B4D8',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
    fontFamily: 'Outfit-Regular',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Outfit-Regular',
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
    fontFamily: 'Outfit-Regular',
  },
  loginLink: {
    color: '#00B4D8',
    //fontWeight: '500',
    fontFamily: 'Outfit-Regular',
  },
  footer: {
    marginTop:20,
    flexDirection: 'row',
    justifyContent: 'center',
    fontFamily: 'Outfit-Regular',
  },


});

export default SignUpScreen;
