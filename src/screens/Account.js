import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import api from '../constants/api';
import { AuthContext } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { emptyCart } from '../redux/slices/cartSlice';

const AccountScreen = ({ navigation }) => {
  const styles = getStyles(); // ❗ DARK MODE REMOVED
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      logout();
      dispatch(emptyCart());
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  const getUserData = async () => {
    try {
      if (user?.contact_id) {
        const res = await api.post("/contact/getContactsById", {
          contact_id: user.contact_id,
        });

        setUserData(res.data.data[0]);
      }
    } catch (e) {
      console.error('Error fetching user:', e);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const menuItems = [
    { icon: 'user', label: 'Your Profile', screen: 'Profile' },
    { icon: 'info', label: 'About Us', screen: 'AboutUs' },
    { icon: 'phone', label: 'Contact Us', screen: 'ContactUs' },
    { icon: 'file-text', label: 'Orders', screen: 'Orders' },
    { icon: 'heart', label: 'Wishlist', screen: 'WishlistScreen' },
    { icon: 'truck', label: 'Shipping Address', screen: 'ShippingAddress' },
    { icon: 'log-out', label: 'Logout', screen: 'Logout' },
  ];

  const userlessmenuItems = [
    { icon: 'info', label: 'About Us', screen: 'AboutUs' },
    { icon: 'phone-call', label: 'Contact Us', screen: 'ContactUs' },
    { icon: 'log-in', label: 'Sign In', screen: 'LoginPage' },
    { icon: 'user-plus', label: 'Register', screen: 'Signup' },
  ];

  if (!user) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: userData?.image || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>Guest</Text>
        </View>

        <View style={styles.menu}>
          {userlessmenuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.menuIconText}>
                <Icon name={item.icon} size={20} color="#00BCD4" />
                <Text style={styles.menuText}>{item.label}</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#555" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: userData?.image || 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{userData?.first_name || ''}</Text>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.menuItem}
            onPress={() => {
              if (item.label === 'Logout') {
                Alert.alert(
                  'Confirm Logout',
                  'Are you sure you want to logout?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Logout', onPress: handleLogout, style: 'destructive' },
                  ]
                );
              } else {
                navigation.navigate(item.screen);
              }
            }}
          >
            <View style={styles.menuIconText}>
              <Icon name={item.icon} size={20} color="#00BCD4" />
              <Text style={styles.menuText}>{item.label}</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#555" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};



// ✅ ALWAYS LIGHT MODE STYLES (WHITE BACKGROUND + BLACK TEXT)
const getStyles = () =>
  StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: '#FFFFFF',   // ALWAYS WHITE
    },
    backBtn: { margin: 20 },
    profileSection: {
      alignItems: 'center',
      marginVertical: 20,
    },
    avatar: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: '#eee',
    },
    name: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 10,
      color: '#000000',            // ALWAYS BLACK TEXT
      fontFamily: 'Outfit-Regular',
    },
    menu: {
      paddingHorizontal: 20,
    },
    menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomColor: '#ddd',
      borderBottomWidth: 1,
    },
    menuIconText: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
    },
    menuText: {
      fontSize: 16,
      color: '#000000',            // ALWAYS BLACK
      fontFamily: 'Outfit-Regular',
    },
    loginText: {
      color: '#fff',
      fontWeight: 'bold',
      fontFamily: 'Outfit-Regular',
    },
    signupText: {
      color: '#00BCD4',
      fontWeight: 'bold',
      fontFamily: 'Outfit-Regular',
    },
  });

export default AccountScreen;
