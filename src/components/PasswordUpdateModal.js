import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet,BackHandler } from 'react-native';

const PasswordUpdateModal = ({ visible, onClose }) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (visible) {
          onClose(); 
          return true; // prevent app exit
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [visible]);
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* <Image source={require('./path-to-checkmark-icon.png')} style={styles.icon} /> */}
          <Text style={styles.title}>Password Update</Text>
          <Text style={styles.subTitle}>Successfully</Text>
          <Text style={styles.message}>Your password has been updated successfully</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color:'#000',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 18,
    color: '#00bcd4',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#00bcd4',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00bcd4',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PasswordUpdateModal;
