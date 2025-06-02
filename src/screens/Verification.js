import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import api from '../constants/api';

const EmailVerificationScreen = ({route,navigation}) => {
  const [otp, setOtp] = useState(['', '', '', '']);
const { email } = route.params;
  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleContinue = () => {
   
  
    api
      .post("api/forgotpass", { email: email })
      .then((res) => {
        Alert.alert("otp to reset password is sent to the mail.");

      })
      .catch(() => {
        console.log("error");
      });
  };


  const verifyEmail = () => {
    const enteredOtp = otp.join('');
    
      api.post('api/checkMailOtp', { email, otp_no:enteredOtp },{
        headers: { 'Content-Type': 'application/json' }
      }).then((res)=>{
        Alert.alert('OTP verified Successfully');
navigation.navigate('NewPassword', { email });
      }).catch((err)=>{

      console.error(err);
      Alert.alert('Error verifying OTP');
    }) 
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/banner/verify.png')}  // Replace with your image path
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>
        <Text style={styles.titleBold}>Email </Text>
        <Text style={styles.titleBlue}>Verification</Text>
      </Text>
      <Text style={styles.subtitle}>We need to register your mail before getting started!</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpBox}
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.verifyButton} onPress={verifyEmail}>
        <Text style={styles.verifyText}>Verify Email</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        
        <Text style={styles.changeEmail} onPress={()=>navigation.navigate('ForgotPassword')}>Change email id ? </Text>
       
          <Text style={styles.sendAgain} onPress={()=>handleContinue}>Send again</Text>
     
      </View>
    </View>
  );
};

export default EmailVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Outfit-Regular',

  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
    fontFamily: 'Outfit-Regular',

  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    fontFamily: 'Outfit-Regular',

  },
  titleBold: {
    //fontWeight: 'bold',
    fontFamily: 'Outfit-Regular',

  },
  titleBlue: {
    color: '#00B4D8',
    //fontWeight: 'bold',
    fontFamily: 'Outfit-Regular',

  },
  subtitle: {
    color: '#777',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Outfit-Regular',

  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    fontFamily: 'Outfit-Regular',

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
    fontFamily: 'Outfit-Regular',

  },
  verifyButton: {
    backgroundColor: '#00B4D8',
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginBottom: 20,
    fontFamily: 'Outfit-Regular',

  },
  verifyText: {
    color: '#fff',
    fontSize: 16,
    //fontWeight: 'bold',
    fontFamily: 'Outfit-Regular',

  },
  footer: {
  flexDirection: 'row',
  justifyContent: 'space-between', // Left and right alignment
  width: '100%', // Take full width of screen
  paddingHorizontal: 24, // Add horizontal padding
  marginTop: 20,
    fontFamily: 'Outfit-Regular',
},

  changeEmail: {
    color: '#555',
    fontFamily: 'Outfit-Regular',

  },
  sendAgain: {
    color: '#00B4D8',
    fontWeight: '500',
    fontFamily: 'Outfit-Regular',

  },
});
