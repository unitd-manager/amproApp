import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import api from '../constants/api';

const EmailVerificationScreen = ({ route, navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpRefs = useRef([]);
  const { email } = route.params;

  // 🟦 Force all text to be black + correct font
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { color: '#000', fontFamily: 'Outfit-Regular' };

  const handleOtpChange = (value, index) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    if (numericValue && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    api
      .post("api/forgotpass", { email })
      .then(() => {
        Alert.alert("OTP sent to your email.");
      })
      .catch(() => console.log("error"));
  };

  const verifyEmail = () => {
    const enteredOtp = otp.join('');

    api.post(
      'api/checkMailOtp',
      { email, otp_no: enteredOtp },
      { headers: { 'Content-Type': 'application/json' } }
    )
      .then(() => {
        Alert.alert('OTP Verified Successfully');
        navigation.navigate('NewPassword', { email });
      })
      .catch(() => {
        Alert.alert(
          'OTP',
          'Incorrect OTP. Please enter the correct OTP or click Send again.'
        );
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../assets/images/banner/verify.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          <Text style={styles.titleBold}>Email </Text>
          <Text style={styles.titleBlue}>Verification</Text>
        </Text>

        <Text style={styles.subtitle}>
          We need to register your mail before getting started!
        </Text>

        {/* OTP BOXES */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (otpRefs.current[index] = ref)}
              style={styles.otpBox}
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              placeholder=""
              placeholderTextColor="#777"
              selectTextOnFocus={true}
              autoCorrect={false}
              autoCapitalize="none"
            />
          ))}
        </View>

        {/* VERIFY BUTTON */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            { opacity: otp.every((d) => d !== '') ? 1 : 0.5 }
          ]}
          onPress={verifyEmail}
          disabled={!otp.every((d) => d !== '')}
        >
          <Text style={styles.verifyText}>Verify Email</Text>
        </TouchableOpacity>

        {/* FOOTER LINKS */}
        <View style={styles.footer}>
          <Text style={styles.changeEmail} onPress={() => navigation.navigate('ForgotPassword')}>
            OTP not received?
          </Text>
          <TouchableOpacity onPress={handleContinue}>
            <Text style={styles.sendAgain}>Send again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EmailVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // always white
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  titleBold: {},
  titleBlue: {
    color: '#00B4D8',
  },
  subtitle: {
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  otpBox: {
    width: 50,
    height: 60,
    borderWidth: 1,
    borderColor: '#00B4D8',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 22,
    marginHorizontal: 8,
    backgroundColor: '#fafafa',
    color: '#000',
  },
  verifyButton: {
    backgroundColor: '#00B4D8',
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginBottom: 20,
  },
  verifyText: {
    color: '#fff',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  changeEmail: {
    color: '#555',
  },
  sendAgain: {
    color: '#00B4D8',
    fontWeight: '500',
  },
});
