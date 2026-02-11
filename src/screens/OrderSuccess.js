import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, BackHandler } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
//import LottieView from 'lottie-react-native';

const OrderSuccess = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Prevent going back after successful order
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFocused) {
        navigation.navigate('Home');
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isFocused, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* <LottieView
          source={require('../assets/animations/Success.json')}
          autoPlay
          loop={false}
          style={styles.animation}
          speed={0.8}
        /> */}
        <Text style={styles.title}>Order Successful!</Text>
        <Text style={styles.subtitle}>
          Your order has been placed successfully. You will receive a confirmation
          email shortly.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Orders')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Make Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.homeButton]}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    safeArea: true,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2ECC71',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    fontFamily: 'System',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    backgroundColor: '#2ECC71',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  homeButton: {
    backgroundColor: '#34495E',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'System',
  },
});

export default OrderSuccess;
