import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../redux/store';
import { fetchNotifications, fetchUnreadCount } from '../redux/slices/notificationSlice';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
        const jsonValue = await AsyncStorage.getItem('user');
		const user = jsonValue != null ? JSON.parse(jsonValue) : null;
        if (user) setUser(user);
		
      
    };
    loadUser();
  }, []);

  const login = async (userData) => {
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    // Fetch notifications after successful login
    try {
      await store.dispatch(fetchNotifications()).unwrap();
      await store.dispatch(fetchUnreadCount()).unwrap();
    } catch (error) {
      console.log('Failed to fetch notifications after login:', error);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
