import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  useColorScheme,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import api from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { fetchCartItems } from '../redux/slices/cartSlice';
import { useDispatch } from 'react-redux';

const SignInScreen = () => {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const dispatch = useDispatch();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Force ALL text to black always
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { color: '#000', fontFamily: 'Outfit-Regular' };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(text);
    setEmailValid(isValid);

    if (!text) setEmailError('Email is required');
    else if (!isValid) setEmailError('Enter a valid email');
    else setEmailError('');
  };

  const passwordPattern =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  const validatePassword = (text) => {
    setPassword(text);

    if (!text) setPasswordError('Password is required');
    else if (!passwordPattern.test(text))
      setPasswordError(
        'Must be 8+ chars, include uppercase, lowercase, number and special char'
      );
    else {
      setPasswordValid(true);
      setPasswordError('');
    }
  };

  const handleSignIn = () => {
    let isValid = true;

    if (!emailValid) {
      setEmailError('Enter valid email');
      isValid = false;
    }

    if (!passwordValid) {
      setPasswordError('Enter valid password');
      isValid = false;
    }

    if (!isValid) return;

    api
      .post('/api/login', { email, password })
      .then((res) => {
        AsyncStorage.setItem('user', JSON.stringify(res.data.data));
        AsyncStorage.setItem('token', JSON.stringify(res.data.token));

        login(res.data.data);
        dispatch(fetchCartItems(res.data.data));

        setTimeout(() => {
        navigation.reset({
  index: 0,
  routes: [
    {
      name: 'MainApp',
    },
  ],
});


        }, 300);
      })
      .catch(() => {
        Alert.alert(
          'Alert',
          'Invalid email or password. Please try again.'
        );
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../assets/signin/logscreen.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          Please <Text style={styles.highlight}>Sign In</Text>
        </Text>
        <Text style={styles.subtitle}>
          Enter your Dipstore account details for a personalised experience
        </Text>

        {/* EMAIL */}
        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={20} color="#444" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777"
            keyboardType="email-address"
            value={email}
            onChangeText={validateEmail}
          />
          {emailValid && (
            <Icon
              name="checkmark-circle"
              size={20}
              color="green"
              style={styles.iconRight}
            />
          )}
        </View>
        {emailError !== '' && (
          <Text style={styles.errorText}>{emailError}</Text>
        )}

        {/* PASSWORD */}
        <View style={styles.inputContainer}>
          <Icon
            name="lock-closed-outline"
            size={20}
            color="#444"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#777"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={validatePassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#444"
              style={styles.iconRight}
            />
          </TouchableOpacity>
        </View>
        {passwordError !== '' && (
          <Text style={styles.errorText}>{passwordError}</Text>
        )}

        {/* Forgot password */}
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* SIGN IN */}
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* SIGN UP */}
        <View style={styles.footer}>
          <Text style={styles.footertext}>First time here </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.highlight}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  logo: {
    width: 160,
    height: 160,
    alignSelf: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Outfit-Regular',
    color: '#000',
  },

  highlight: {
    color: '#00B4D8',
    fontFamily: 'Outfit-Regular',
  },

  subtitle: {
    textAlign: 'center',
    color: '#777',
    fontSize: 13,
    marginVertical: 10,
    fontFamily: 'Outfit-Regular',
  },

  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#000',
    fontFamily: 'Outfit-Regular',
  },

  icon: { marginRight: 5 },
  iconRight: { marginLeft: 5 },

  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontFamily: 'Outfit-Regular',
  },

  forgotPassword: {
    color: '#00B4D8',
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 20,
    fontFamily: 'Outfit-Regular',
  },

  button: {
    backgroundColor: '#00B4D8',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonText: {
    color: '#fff',
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    fontWeight: 'bold',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    color: '#000',
    marginTop: 10,
  },
   footertext: {
    color: '#000',
  }
});
