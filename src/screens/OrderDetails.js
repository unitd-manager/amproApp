import React, { useLayoutEffect, useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, Dimensions } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../constants/api"; // ✅ axios instance
import imageBase from '../constants/imageBase';

// 🎨 Theme
const theme = {
  primaryBackgroundColor: '#f5f5f5',
  secondryBackgroundColor: '#ffffff', 
  textColor: '#333333',
  appFontSize: {
    largeSize: 18,
    mediumSize: 16,
    fontFamily: 'System'
  }
};

// 🔹 Reusable Components
const HeadingText = ({ heading }) => (
  <View style={[styles.headingView, { backgroundColor: theme.secondryBackgroundColor }]}>
    <Text style={styles.headingText}>{heading}</Text>
  </View>
);

const SingleRowText = ({ label, value, isBold }) => (
  <View style={styles.singleRowView}>
    <Text style={[styles.rowText, isBold && styles.boldText]}>{label}</Text>
    <Text style={[styles.rowText, isBold && styles.boldText]}>{value}</Text>
  </View>
);

const BodyRowText = ({ text }) => (
  <View style={styles.bodyView}>
    <Text style={styles.bodyText}>{text}</Text>
  </View>
);

const OrderStatus = ({ number, label, isSelected }) => (
  <View style={styles.statusContainer}>
    <View style={[styles.statusCircle, isSelected && styles.selectedStatus]}>
      <Text style={styles.statusNumber}>{number}</Text>
    </View>
    <Text style={styles.statusLabel}>{label}</Text>
  </View>
);

const OrderDetails = ({ navigation, route }) => {
  const { orderNo } = route.params;
  const [UserDetails, setUserDetails] = useState({});
  const [orderItem, setOrderItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const windowWidth = Dimensions.get('window').width;

  // 🟢 Fetch user
  const getUserCart = async () => {
    try {
      const userData = await AsyncStorage.getItem("USER");
      console.log("Raw user data from AsyncStorage:", userData);
      const user = JSON.parse(userData);
      console.log("Parsed user details:", user);
      setUserDetails(user || {});
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // 🟢 Fetch order details
  useEffect(() => {
    getUserCart();
    const fetchOrders = async () => {
      try {
        setLoading(true);
        console.log("Fetching order details for order_id:", orderNo.order_id);
        const response = await api.post("/orders/getOrderHistoryById", {
          order_id: orderNo.order_id,
        });
        console.log("Order details API response:", response.data);
        console.log("Order items received:", response.data.data);
        console.log("Order info passed from route:", orderNo);
        response.data.data?.forEach((item) => {
  item.images = item.images.split(",");
});

        setOrderItem(response.data.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        console.error("Error response:", error.response);
        console.error("Error status:", error.response?.status);
        console.error("Error data:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // 🟢 Header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Order #${orderNo.order_id}`,
      headerStyle: {
        backgroundColor: theme.secondryBackgroundColor,
        shadowColor: 'transparent',
      },
      headerTintColor: theme.textColor,
    });
  }, [navigation, orderNo]);

  // 🟢 Calculations
  const calculateSubTotal = () => {
    return orderItem.reduce((total, p) => total + (p.unit_price * (p.qty || p.quantity|| 1)), 0).toFixed(2);
  };
  const calculateDiscount = () => {
    return orderItem.reduce((total, p) => {
      const discount = (p.unit_price * (p.discount_percentage || 0) / 100);
      return total + (discount * (p.qty || p.quantity|| 1));
    }, 0).toFixed(2);
  };
  const calculateGST = () => {
    return orderItem.reduce((total, p) => {
      const discount = (p.unit_price * (p.discount_percentage || 0) / 100);
      const finalPrice = p.unit_price - discount;
      return total + ((finalPrice * 18 / 100) * (p.qty || p.quantity|| 1));
    }, 0).toFixed(2);
  };
  const calculateTotal = () => {
    return orderItem.reduce((total, p) => {
      const discount = (p.unit_price * (p.discount_percentage || 0) / 100);
      const finalPrice = p.unit_price - discount;
      const gst = (finalPrice * 18 / 100);
      return total + ((finalPrice + gst) * (p.qty || p.quantity|| 1));
    }, 0).toFixed(2);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.primaryBackgroundColor }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainerStyle}
        showsVerticalScrollIndicator={false}>
        
        {/* Status */}
        <View style={styles.statusWrapper}>
          <OrderStatus number="1" label="On Hold" isSelected={orderNo.order_status === "pending"} />
          <OrderStatus number="2" label="Processing" isSelected={orderNo.order_status === "processing"} />
          <OrderStatus number="3" label="Completed" isSelected={orderNo.order_status === "completed"} />
        </View>

        {/* Shipping Address */}
        <HeadingText heading="Shipping Address" />
        <BodyRowText 
          text={[
            orderNo.shipping_address1,
            orderNo.shipping_address2,
            orderNo.shipping_address_city,
            orderNo.shipping_state,
            orderNo.shipping_po_code
          ]
            .filter(item => item && item !== "N/A")
            .join(", ") || "N/A"
          } 
        />

        {/* Products */}
        <HeadingText heading="Products" />
        <Text style={styles.debugText}>Order Items Count: {orderItem.length}</Text>
        {orderItem.length === 0 ? (
          <BodyRowText text="No items found in this order" />
        ) : (
          orderItem.map((item, index) => {
            console.log(`Order item ${index}:`, item);
            const discount = (item.unit_price * (item.discount_percentage || 0) / 100);
            const finalPrice = item.unit_price - discount;
            return (
              <View style={styles.productContainer} key={index}>
                <View style={styles.productImageContainer}>
                  <Image
                    source={{ uri: `${imageBase}${item.images[0]}` }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{item.product_name || item.title || item.name || 'Unknown Product'}</Text>
                  <SingleRowText label="Price" value={`₹${item.unit_price || 0}`} />
                  <SingleRowText label="Quantity" value={(item.qty || item.quantity || 1).toString()} />
                  {discount > 0 && (
                    <SingleRowText label="Discount" value={`-₹${(discount * (item.qty || item.quantity || 1)).toFixed(2)}`} />
                  )}
                  <SingleRowText label="Total" value={`₹${(finalPrice * (item.qty || item.quantity || 1)).toFixed(2)}`} isBold />
                </View>
              </View>
            );
          })
        )}

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <SingleRowText label="Subtotal" value={`₹${calculateSubTotal()}`} />
          <SingleRowText label="Discount" value={`₹${calculateDiscount()}`} />
          <SingleRowText label="GST (18%)" value={`₹${calculateGST()}`} />
          <SingleRowText label="Total" value={`₹${calculateTotal()}`} isBold />
        </View>

        {/* Payment Method */}
        <HeadingText heading="Payment Method" />
        <BodyRowText text={orderNo.payment_method || "N/A"} />

        {/* Notes */}
        <HeadingText heading="Order Notes" />
        <BodyRowText text={orderNo.notes || "No special instructions"} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollViewContainerStyle: { padding: 16 },
  headingView: { padding: 12, marginVertical: 8, borderRadius: 8, elevation: 2 },
  headingText: { fontSize: 18, fontFamily: 'Outfit-Regular', color: '#333' },
  bodyView: { padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 16 },
  bodyText: { fontSize: 16,fontFamily: 'Outfit-Regular', color: '#666' },
  singleRowView: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  rowText: { fontSize: 16,fontFamily: 'Outfit-Regular', color: '#333' },
  boldText: { fontWeight: 'bold' },
  statusWrapper: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 24 },
  statusContainer: { alignItems: 'center' },
  statusCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  selectedStatus: { backgroundColor: '#4CAF50' },
  statusNumber: { color: '#fff', fontWeight: 'bold' },
  statusLabel: { fontSize: 14,fontFamily: 'Outfit-Regular', color: '#666' },
  productContainer: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 8, 
    marginBottom: 16, 
    elevation: 1,
    flexDirection: 'row'
  },
  productImageContainer: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden'
  },
  productImage: {
    width: '100%',
    height: '100%'
  },
  productDetails: {
    flex: 1
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    
    marginBottom: 8,
    color: '#333'
  },
  summaryContainer: { backgroundColor: '#f8f8f8', padding: 16, borderRadius: 8, marginVertical: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  debugText: { fontSize: 14,fontFamily: 'Outfit-Regular', color: '#999', marginBottom: 8, fontStyle: 'italic' },
});
