import React, { useLayoutEffect, useState, useEffect, useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../constants/api"; // ✅ axios instance
import imageBase from '../constants/imageBase';
import RazorpayCheckout from 'react-native-razorpay';
import { AuthContext } from '../context/AuthContext';

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
  const { user: authUser } = useContext(AuthContext);
  const [UserDetails, setUserDetails] = useState({});
  const [orderItem, setOrderItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const windowWidth = Dimensions.get('window').width;

  // 🟢 Handle Razorpay Payment
  const handleRazorpayPayment = async () => {
    try {
      setPaymentProcessing(true);
      const totalAmount = calculateTotal();
      const amountInPaise = Math.round(parseFloat(totalAmount) * 100); // Convert to paise

      // Validate amount
      if (!amountInPaise || amountInPaise <= 0) {
        console.error('Invalid amount for payment:', {
          totalAmount,
          amountInPaise,
          orderItem: orderItem.length
        });
        Alert.alert('Error', 'Invalid order total. Please refresh and try again.');
        setPaymentProcessing(false);
        return;
      }

      // Get user data from AuthContext first, then fall back to AsyncStorage
      let currentUserDetails = authUser || UserDetails;
      console.log('Current user from AuthContext:', authUser);
      console.log('Current UserDetails from state:', UserDetails);
      
      if (!currentUserDetails?.email) {
        console.log('User data not in context/state, fetching from AsyncStorage with key "user"...');
        try {
          const userData = await AsyncStorage.getItem("user"); // lowercase 'user'
          console.log('Raw user data from AsyncStorage:', userData);
          if (userData) {
            currentUserDetails = JSON.parse(userData);
            console.log('Parsed user details from AsyncStorage:', currentUserDetails);
            setUserDetails(currentUserDetails);
          }
        } catch (error) {
          console.error('Error fetching from AsyncStorage:', error);
        }
      }

      console.log('Final currentUserDetails to use:', currentUserDetails);

      // Validate required fields
      const email = currentUserDetails?.email?.trim() || 'test@example.com';
      let contact = String(currentUserDetails?.phone || currentUserDetails?.contact || '').replace(/\D/g, '').slice(-10);
      
      // If contact is empty or all zeros, use a valid test number
      if (!contact || contact === '' || contact.replace(/9/g, '') === '') {
        contact = '9876543210'; // Valid test number instead of all 9s
      }
      
      const name = currentUserDetails?.name?.trim() || 'Customer';

      console.log('Razorpay Payment Details:', {
        order_id: orderNo.order_id,
        amount: amountInPaise,
        email,
        contact,
        name
      });

      const options = {
        description: `Payment for Order #${orderNo.order_id}`,
        image: 'https://i.imgur.com/3g7bs6o.png',
        currency: 'INR',
        key: 'rzp_test_RhuQKq8G6AymUH',
        amount: Number(amountInPaise), // Ensure it's a number
        name: 'AMPRO',
        prefill: {
          email: email,
          contact: contact,
          name: name,
        },
        theme: { color: '#3498db' }
      };

      console.log('📋 Final Razorpay Options:', JSON.stringify(options, null, 2));
      console.log('⚠️ Opening Razorpay with test key. If this fails, verify the API key is active on Razorpay dashboard.');

      RazorpayCheckout.open(options)
        .then(async (data) => {
          // Handle successful payment
          console.log('🎉 Payment successful:', JSON.stringify(data, null, 2));
          
          if (!data?.razorpay_payment_id) {
            console.error('❌ No payment ID in response:', data);
            throw new Error('No payment ID received from Razorpay');
          }
          
          console.log('✅ Payment ID:', data.razorpay_payment_id);
          
          // Update order status to completed
          await updateOrderStatus('completed', data.razorpay_payment_id);
          
          // Send confirmation emails to user and admin with current user details
          await sendConfirmationEmails(data.razorpay_payment_id, currentUserDetails);
          
          Alert.alert(
            'Payment Successful',
            `Payment ID: ${data.razorpay_payment_id}\n\nYour order has been confirmed. A confirmation email has been sent to you.`,
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        })
        .catch((error) => {
          console.error('❌ Payment error details:', {
            message: error?.message,
            description: error?.description,
            code: error?.code,
            fullError: JSON.stringify(error)
          });
          
          // Try to parse nested error message
          let errorMsg = error?.description || error?.message || 'Unknown error occurred';
          let displayMsg = errorMsg;
          
          try {
            // Check if error description is a JSON string
            if (typeof errorMsg === 'string' && errorMsg.includes('error')) {
              const parsed = JSON.parse(errorMsg);
              if (parsed?.error?.description) {
                displayMsg = parsed.error.description;
              }
            }
          } catch (parseErr) {
            // If parsing fails, use original message
            displayMsg = errorMsg;
          }

          console.log('Display message:', displayMsg);
          
          // Check for specific error types
          if (displayMsg.includes('cancelled')) {
            Alert.alert(
              'Payment Cancelled',
              'You cancelled the payment. Click "Complete Order" again to retry.',
              [{ text: 'OK' }]
            );
          } else if (displayMsg.includes('delay')) {
            Alert.alert(
              'Payment Delayed',
              'There was a delay in response. Please try again.',
              [{ text: 'OK' }]
            );
          } else if (displayMsg.includes('parsing error') || displayMsg.includes('Post payment')) {
            Alert.alert(
              'Payment Gateway Error',
              'The payment gateway is having trouble processing your payment. This could be due to:\n\n• Invalid API Key\n• Network connectivity issue\n• Payment gateway maintenance\n\nPlease try again or contact support.',
              [{ text: 'OK' }]
            );
          } else {
            Alert.alert(
              'Payment Failed',
              `${displayMsg}\n\nPlease try again or contact support.`,
              [{ text: 'OK' }]
            );
          }
        })
        .finally(() => {
          setPaymentProcessing(false);
        });
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentProcessing(false);
      Alert.alert('Error', 'Failed to process payment');
    }
  };

  // 🟢 Send Confirmation Emails
  const sendConfirmationEmails = async (paymentId, userDetails = null) => {
    try {
      console.log('Sending confirmation emails for order:', orderNo.order_id);
      console.log('User details received:', userDetails);
      console.log('UserDetails from state:', UserDetails);
      
      // Use provided userDetails or fall back to state
      const emailUser = userDetails || UserDetails;
      
      // Validate required fields
      if (!emailUser?.email) {
        console.warn('❌ User email is missing!');
        console.warn('emailUser object:', emailUser);
        console.warn('emailUser.email:', emailUser?.email);
        console.warn('Email notification skipped.');
        return { success: false, message: 'User email not available' };
      }

      // Use name, or fall back to company_name, or use customer_code
      const userName = emailUser?.name?.trim() || emailUser?.company_name || emailUser?.customer_code || 'Valued Customer';
      
      if (!userName) {
        console.warn('❌ User name could not be determined. Email notification skipped.');
        return { success: false, message: 'User name not available' };
      }
      
      console.log('✅ User validation passed. Email:', emailUser.email, 'Name:', userName);

      // Transform items to match backend expectations
      const transformedItems = orderItem.map(item => ({
        name: item.product_name || item.name || item.item_title || 'Unknown Product',
        price: item.unit_price || item.price || 0,
        quantity: item.qty || item.quantity || 1
      }));

      const emailPayload = {
        order_id: orderNo.order_id,
        user_email: emailUser.email,
        user_name: userName,
        payment_id: paymentId,
        order_amount: calculateTotal(),
        items: transformedItems,
        shipping_address: {
          address1: orderNo.shipping_address1 || '',
          address2: orderNo.shipping_address2 || '',
          city: orderNo.shipping_address_city || '',
          state: orderNo.shipping_state || '',
          postal_code: orderNo.shipping_po_code || ''
        }
      };

      console.log('Email payload being sent:', JSON.stringify(emailPayload, null, 2));

      const response = await api.post('/commonApi/sendOrderConfirmation', emailPayload);
      console.log('Confirmation emails sent:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending confirmation emails:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Full error:', error.message);
      
      // Don't alert user - this is a non-critical error
      // Email sending failure shouldn't block order completion
      console.warn('Warning: Email notification may not have been sent');
      console.warn('Backend error:', error.response?.data?.message);
      return { success: false };
    }
  };

  // 🟢 Update Order Status
  const updateOrderStatus = async (newStatus, paymentId = null) => {
    try {
      const payload = {
        order_id: orderNo.order_id,
        order_status: newStatus,
      };

      if (paymentId) {
        payload.transaction_id = paymentId;
      }

      const response = await api.post('/orders/updateOrderStatus', payload);
      console.log('Order status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  // 🟢 Complete Order Handler
  const handleCompleteOrder = async () => {
    if (orderNo.order_status === 'completed') {
      Alert.alert('Info', 'This order is already completed.');
      return;
    }

    Alert.alert(
      'Complete Order',
      'How would you like to proceed?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancelled'),
          style: 'cancel',
        },
        {
          text: 'Pay with Razorpay',
          onPress: handleRazorpayPayment,
        },
        {
          text: 'Cash on Delivery',
          onPress: async () => {
            await updateOrderStatus('completed');
            Alert.alert('Success', 'Order status updated to Completed');
            navigation.goBack();
          },
        },
      ]
    );
  };

  // 🟢 Fetch user
  const getUserCart = async () => {
    try {
      // First try to use AuthContext user if available
      if (authUser) {
        console.log('Using user from AuthContext:', authUser);
        setUserDetails(authUser);
        return;
      }
      
      // Fall back to AsyncStorage with correct key 'user' (lowercase)
      const userData = await AsyncStorage.getItem("user");
      console.log("Raw user data from AsyncStorage:", userData);
      if (userData) {
        const user = JSON.parse(userData);
        console.log("Parsed user details:", user);
        setUserDetails(user || {});
      } else {
        console.warn("No user data found in AsyncStorage");
        setUserDetails({});
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserDetails({});
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
          {/* <OrderStatus number="1" label="On Hold" isSelected={orderNo.order_status === "pending"} /> */}
          <OrderStatus number="1" label="Processing" isSelected={orderNo.order_status === "pending"} />
          <OrderStatus number="2" label="Completed" isSelected={orderNo.order_status === "completed"} />
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

        {/* Complete Order Button */}
        {orderNo.order_status !== 'completed' && (
          <TouchableOpacity
            style={[
              styles.completeButton,
              paymentProcessing && styles.completeButtonDisabled
            ]}
            onPress={handleCompleteOrder}
            disabled={paymentProcessing}
          >
            {paymentProcessing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.completeButtonText}>Complete Order</Text>
            )}
          </TouchableOpacity>
        )}
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
  completeButton: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    elevation: 3,
  },
  completeButtonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.6,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    fontWeight: '600',
  },
});
