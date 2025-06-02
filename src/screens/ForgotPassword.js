import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import api from '../constants/api';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Or Feather, FontAwesome, etc.

const ForgotPasswordScreen = ({navigation}) => {
 const [email, setEmail] = useState("");
  const [contactMails, setContactMails] = useState([]);

 const handleContinue = () => {
      if (!email) {
      Alert.alert("Please enter your email.");
      return;
    }
  
    // Extract email values from contactMails
    const emailList = contactMails.map((contact) => contact.email);
  
    if (!emailList.includes(email)) {
      Alert.alert("This email is not registered.");
      return;
    }
    api
      .post("api/forgotpass", { email: email })
      .then((res) => {
        Alert.alert("otp to reset password is sent to the mail.");
		navigation.navigate('Verification', { email });
      })
      .catch(() => {
        console.log("error");
      });
  };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     if (!email) {
//       Alert.alert("Please enter your email.");
//       return;
//     }
  
//     // Extract email values from contactMails
//     const emailList = contactMails.map((contact) => contact.email);
  
//     if (!emailList.includes(email)) {
//       Alert.alert("This email is not registered.");
//       return;
//     }
//     api
//       .post("api/forgot", { email: email })
//       .then((res) => {
//         Alert.alert("otp to reset password is sent to the mail.");
//       })
//       .catch(() => {
//         console.log("error");
//       });
//   };
useEffect(()=>{

  api
  .get("api/getAllContactMails")
  .then((res) => {
    setContactMails(res.data.data)
  })
  .catch(() => {
    console.log("error");
  });
},[])
 
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Forgot <Text style={styles.highlight}>Password</Text>
      </Text>
      <Text style={styles.subText}>
        Select which contact details should we use to reset your password.
      </Text>

      <Image
        source={require('../assets/images/banner/forgot.png')} // Add your image to assets
        style={styles.image}
        resizeMode="contain"
      />

      {/* <View style={styles.inputBox}>
        <Text style={styles.label}>Send OTP via Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View> */}
	  <View style={styles.inputBox}>
  <Text style={styles.label}>Send OTP via Email</Text>
  <View style={styles.inputContainer}>
    <Icon name="email" size={20} color="#888" style={styles.inputIcon} />
    <TextInput
      style={styles.input}
      placeholder="Enter your email"
      placeholderTextColor="#aaa"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
    />
  </View>
</View>


      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'flex-start',
	  fontFamily: 'Outfit-Regular',
  },
   headerText: {
	marginTop: 20,
    fontSize: 28,
    color: '#000',
    marginBottom: 8,
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',         // <-- Center align text
  },
  subText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 20,
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',         // <-- Center align text
  },

  highlight: {
    color: '#00bcd4',
	  fontFamily: 'Outfit-Regular',
  },
 
   image: {
    height: 220,                  // <-- Increase height
    width: 220,                   // <-- Fixed width for better control
    alignSelf: 'center',          // <-- Center the image
    marginBottom: 24,
  },

//   inputBox: {
//     borderWidth: 1,
//     borderColor: '#00bcd4',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 24,
// 	  fontFamily: 'Outfit-Regular',
//   },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
	  fontFamily: 'Outfit-Regular',
  },
//   input: {
//     fontSize: 16,
//     color: '#000',
// 	  fontFamily: 'Outfit-Regular',
//   },
  button: {
    backgroundColor: '#00bcd4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
	  fontFamily: 'Outfit-Regular',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    //fontWeight: 'bold',
	  fontFamily: 'Outfit-Regular',
  },
  inputBox: {
  marginBottom: 24,
},

inputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#00bcd4',
  borderRadius: 10,
  paddingHorizontal: 10,
  backgroundColor: '#fff',
  height: 44, // reduced height
},

inputIcon: {
  marginRight: 8,
},

input: {
  flex: 1,
  fontSize: 14,
  paddingVertical: 0,
  color: '#000',
  fontFamily: 'Outfit-Regular',
},

});
