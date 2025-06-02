import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // For eye icon
import api from '../constants/api';
import PasswordUpdateModal from '../components/PasswordUpdateModal';

const NewPasswordScreen = ({ route,navigation }) => {
	const { email } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const handleSignUp = () => {
    if (password === confirmPassword && password.length >= 6) {
      console.log('Password set successfully');
      // API call to set new password  newpassword
	   api
      .post("api/newpassword", { email: email,newPassword:password })
      .then((res) => {
       // Alert.alert("Password is updated Successfully");
		setModalVisible(true);
      })
      .catch(() => {
        console.log("error");
      });
    } else {
      Alert.alert('Passwords do not match or are too short.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>

      <Image
        source={require('../assets/images/banner/newpass.png')} // Use your image here
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        Enter <Text style={styles.highlight}>New Password</Text>
      </Text>
      <Text style={styles.subtitle}>Please enter new password</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordBox}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordBox}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••"
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Icon
              name={showConfirmPassword ? 'eye' : 'eye-off'}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
        <Text style={styles.signUpText}>Submit</Text>
      </TouchableOpacity>

      <View style={styles.loginFooter}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
	   <PasswordUpdateModal visible={modalVisible} onClose={() => {setModalVisible(false); Navigation.navigate('LoginPage')}} />
    
    </View>
  );
};

export default NewPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  backBtn: {
    marginBottom: 10,
  },
  image: {
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Outfit-Regular',
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  highlight: {
    color: '#00bcd4',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontFamily: 'Outfit-Regular',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontFamily: 'Outfit-Regular',
    color: '#333',
  },
  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#000',
  },
  signUpBtn: {
    backgroundColor: '#00bcd4',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  signUpText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Regular',
  },
  loginFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#444',
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#00bcd4',
  },
});
