import React, { useLayoutEffect, useState, useEffect, useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert, RefreshControl } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import api from "../constants/api";
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
const defaultTheme = {
  primary: '#3498db',
  primaryBackgroundColor: '#ffffff',
  secondryBackgroundColor: '#f2f2f2',
  textColor: '#333333',
  secondryTextColor: '#888888',
  appFontSize: { fontFamily: 'System' }
};

const OrderCard = ({ order, theme, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('OrderDetails', { orderNo: order })}
      style={[
        styles.orderCard,
        {
          backgroundColor: theme?.secondryBackgroundColor || defaultTheme.secondryBackgroundColor,
          shadowColor: theme?.secondryTextColor || defaultTheme.secondryTextColor,
        },
      ]}>
      <OrderRow label="ID" value={order.order_id} theme={theme} />
      <OrderRow label="Order Date" value={new Date(order.order_date).toLocaleDateString()} theme={theme} />
      <OrderRow label="Status" value={order.order_status} theme={theme} />
      <OrderRow label="Payment Method" value={order.payment_method} theme={theme} />
      <OrderRow label="Total" value={order.total_amount} theme={theme} />
    </TouchableOpacity>
  );
};

const OrderRow = ({ label, value, theme }) => (
  <View style={styles.row}>
    <Text
      style={[
        styles.label,
        {
          color: theme?.textColor || defaultTheme.textColor,
          fontFamily: theme?.appFontSize?.fontFamily || defaultTheme.appFontSize.fontFamily,
        },
      ]}>
      {label}
    </Text>
    <Text
      style={[
        styles.value,
        {
          color: theme?.textColor || defaultTheme.textColor,
          fontFamily: theme?.appFontSize?.fontFamily || defaultTheme.appFontSize.fontFamily,
        },
      ]}>
      {value}
    </Text>
  </View>
);

const Orders = ({ navigation, theme }) => {
  const safeTheme = { ...defaultTheme, ...theme }; // ✅ merge defaults with passed theme
  const [activeTab, setActiveTab] = useState(0);
  const [userContactId, setUserContactId] = useState(null);
  const [orders, setOrders] = useState([]); // State for orders
  const [refreshing, setRefreshing] = useState(false);
  
  const { user, logout } = useContext(AuthContext);

  const dispatch = useDispatch();

  const onPressSignIn = () => {
    navigation.navigate("Login");
  };
  
  // 🟢 Fetch orders from API
  const fetchOrders = async () => {
    try {
      console.log('Making API request with contact_id:', user.contact_id)
      const response = await api.post("/orders/getOrdersByContactId", {
        contact_id: user.contact_id
      })
      
      console.log('API Response:', response)
      console.log('API Response Data:', response.data)
      
      if (response.data && response.data.data) {
        console.log('Orders from API:', response.data.data)
        // Transform API data to match the expected format
        const transformedOrders = {
          processing: response.data.data.filter(order => order.order_status === 'pending'),
          completed: response.data.data.filter(order => order.order_status === 'completed')
        }
        console.log('Transformed Orders:', transformedOrders)
        setOrders(transformedOrders)
      } else {
        setOrders(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      console.error("Error response:", error.response)
      console.error("Error status:", error.response?.status)
      console.error("Error data:", error.response?.data)
      console.error("Error message:", error.message)
      
      // Fallback to mock data if API fails
      const mockOrders = {
        onHold: [],
        processing: [],
        completed: []
      }
      setOrders([])
    }
  };

  // 🟢 Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchOrders();
      console.log('✅ Orders refreshed successfully');
    } catch (error) {
      console.error('Error refreshing orders:', error);
    } finally {
      setRefreshing(false);
    }
  };
  // 🟢 Initial load of orders
  useEffect(() => {
    fetchOrders();
  }, [user?.contact_id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'My Orders',
      headerStyle: {
        backgroundColor: safeTheme.secondryBackgroundColor,
        shadowColor: 'transparent',
      },
      headerTintColor: safeTheme.textColor,
    });
  }, [navigation, safeTheme]);

  const tabs = [
    { id: 0, title: 'Processing', data: orders.processing },
    { id: 1, title: 'Completed', data: orders.completed },
  ];

  const renderTab = ({ item }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(item.id)}
      style={[
        styles.tab,
        { borderBottomColor: safeTheme.primary, borderBottomWidth: activeTab === item.id ? 1 : 0 },
      ]}>
      <Text
        style={[
          styles.tabText,
          {
            color: activeTab === item.id ? safeTheme.primary : 'gray',
            fontFamily: safeTheme.appFontSize.fontFamily,
          },
        ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
     <SafeAreaView style={[styles.container, { backgroundColor: safeTheme.primaryBackgroundColor }]}>
      <FlatList
        horizontal
        data={tabs}
        renderItem={renderTab}
        keyExtractor={(item) => item.id.toString()}
        style={styles.tabList}
        showsHorizontalScrollIndicator={false}
      />

      <FlatList
        data={tabs[activeTab]?.data || []}
        renderItem={({ item }) => (
          <OrderCard order={item} theme={safeTheme} navigation={navigation} />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.orderList}
        scrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3498db']}
            progressBackgroundColor="#fff"
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabList: { maxHeight: 60 ,fontFamily: 'Outfit-Regular'},
  tab: { padding: 15, marginHorizontal: 10 },
  tabText: { fontSize: 16,fontFamily: 'Outfit-Regular' },
  orderList: { paddingHorizontal: 10, paddingBottom: 10 },
  orderCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    elevation: 3,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  label: { fontSize: 14, flex: 1,fontFamily: 'Outfit-Regular', },
  value: { fontSize: 14, fontFamily: 'Outfit-Regular', flex: 1, textAlign: 'right' },
});

export default Orders;
