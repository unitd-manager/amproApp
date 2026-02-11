import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import api from '../constants/api';
import Icon from 'react-native-vector-icons/Ionicons';

const SignUpScreen = ({ navigation }) => {
  const [signupData, setSignupData] = useState({
    first_name: '',
    mobile: '',
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [otp, setOTP] = useState('');
  const [mailId, setmailId] = useState('');
  const [userMessage, setMessage] = useState('');

  // Force TEXT globally to be black
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { color: '#000', fontFamily: 'Outfit-Regular' };

  const generateOTP = () => {
    const newOTP = (Math.floor(1000 + Math.random() * 9000)).toString();
    setOTP(newOTP);
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
    //const mobileRegex = /^[6-9]\d{9}$/;

    if (!signupData.first_name.trim())
      errors.first_name = 'First Name is required';

    // if (!signupData.mobile.trim())
    //   errors.mobile = 'Mobile Number is required';
    // else if (!mobileRegex.test(signupData.mobile.trim()))
    //   errors.mobile = 'Enter a valid 10-digit mobile number';

    if (!signupData.email.trim())
      errors.email = 'Email is required';
    else if (!emailRegex.test(signupData.email.trim()))
      errors.email = 'Enter a valid email address';

    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

    if (!signupData.password.trim())
      errors.password = 'Password is required';
    else if (!passwordPattern.test(signupData.password))
      errors.password =
        'Must include uppercase, lowercase, number & special character';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendMail = () => {
    const to = signupData.email;
    const subject = "Registration";

    api
      .post("/commonApi/sendUseremail", { to, subject })
      .then(() => {
        Alert.alert(
          "Registration Success",
          "A confirmation email has been sent. Click OK to proceed to login.",
          [{ text: "OK", onPress: () => navigation.navigate('LoginPage') }]
        );
      })
      .catch(() => {
        Alert.alert(
          "Alert",
          "Email already registered. Please login or use another email."
        );
      });

    // Admin email
    api.post("/commonApi/sendregisteremail", {
      to: mailId.email,
      subject,
      text: JSON.stringify(signupData),
      dynamic_template_data: signupData,
    });
  };

  const handleSignup = () => {
    if (!validateForm()) return;

    const signupPayload = {
      ...signupData,
      otp_no: otp,
      creation_date: new Date().toLocaleString(),
      date_of_creation: new Date().toLocaleString(),
    };

    api
      .post("/api/register", signupPayload)
      .then(() => {
        sendMail();
      })
      .catch(() => {
        Alert.alert(
          "Alert",
          "Email already registered. Please login or try another."
        );
      });

    setSignupData({ first_name: '', mobile: '', email: '', password: '' });
    setFormErrors({});
  };

  useEffect(() => {
    getEmail();
    getMessage();
    generateOTP();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={20}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Create <Text style={styles.titleHighlight}>New Account</Text>
        </Text>
        <Text style={styles.subtitle}>
          Looks like you don't have an account yet.
        </Text>

        {/* FIRST NAME */}
        <Text style={styles.label}>First Name</Text>
        <TextInput
          placeholder="John"
          placeholderTextColor="#777"
          style={styles.input}
          value={signupData.first_name}
          onChangeText={(text) => {
            setSignupData({ ...signupData, first_name: text });
            setFormErrors({ ...formErrors, first_name: '' });
          }}
        />
        {formErrors.first_name && (
          <Text style={styles.errorText}>{formErrors.first_name}</Text>
        )}

        {/* MOBILE NUMBER */}
        <Text style={styles.label}>Mobile No.</Text>
        <TextInput
          placeholder="+65- 8888 7777"
          placeholderTextColor="#777"
          style={styles.input}
          keyboardType="number-pad"
          maxLength={10}
          value={signupData.mobile}
          onChangeText={(text) => {
            setSignupData({ ...signupData, mobile: text });
            setFormErrors({ ...formErrors, mobile: '' });
          }}
        />
        {formErrors.mobile && (
          <Text style={styles.errorText}>{formErrors.mobile}</Text>
        )}

        {/* EMAIL */}
        <Text style={styles.label}>Email Id</Text>
        <TextInput
          placeholder="example@gmail.com"
          placeholderTextColor="#777"
          style={styles.input}
          keyboardType="email-address"
          value={signupData.email}
          onChangeText={(text) => {
            setSignupData({ ...signupData, email: text });
            setFormErrors({ ...formErrors, email: '' });
          }}
        />
        {formErrors.email && (
          <Text style={styles.errorText}>{formErrors.email}</Text>
        )}

        {/* PASSWORD */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#777"
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
              color="#999"
            />
          </TouchableOpacity>
        </View>
        {formErrors.password && (
          <Text style={styles.errorText}>{formErrors.password}</Text>
        )}

        {/* SIGNUP BUTTON */}
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footertext}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginPage')}>
            <Text style={styles.loginLink}> Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff', // Always white
  },
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    color:'#000',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleHighlight: {
    color: '#00B4D8',
  },
  footertext: {
    color: '#000',
  },
  subtitle: {
    textAlign: 'center',
    color: '#777',
    fontSize: 14,
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fafafa',
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
  },
  passwordInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: '#000',
  },
  eyeIcon: {
    tintColor: '#999',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#00B4D8',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
 footer: {
    marginTop: 20,
    color: '#000',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginLink: {
    color: '#00B4D8',
  },
});
