import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { AuthContext } from "../context/AuthContext";
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartItems, clearCart, deleteCartItem, updateCart } from '../redux/slices/cartSlice';
import imageBase from "../constants/imageBase";
import api from "../constants/api";
import amproLogo from "../assets/images/amprologo.png";

const Checkout = ({navigation}) => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { user } = useContext(AuthContext);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchCartItems(user));
    }
  }, [dispatch, user]);

 const calculateTotal = () => {
  const total =
    items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.qty),
      0
    );
  return Number(total.toFixed(2));
};


  const validateFields = () => {
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !address1?.trim() || !city?.trim() || !pincode?.trim()) {
      Alert.alert("Error", "Please fill in all delivery details");
      return false;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      Alert.alert("Error", "Please enter a valid email");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number");
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      Alert.alert("Error", "Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const createRazorpayOrder = async (amount, orderId) => {
    // Backend endpoint not available, proceeding without Razorpay order ID
    console.log('Creating order without Razorpay order ID');
    return null;
  };

  const handlePayment = async (orderId) => {
    //const razorpayOrderId = await createRazorpayOrder(calculateTotal(), orderId);
    const razorpayOrderId = orderId;
    
    const options = {
      description: "Payment for your order",
      image: amproLogo,
      currency: "INR",
      key: process.env.RAZORPAY_KEY || "rzp_test_yE3jJN90A3ObCp",
      amount: Math.round(calculateTotal() * 100),
      name: "Ampro",
      ...(razorpayOrderId && { order_id: razorpayOrderId }),
      prefill: {
        name,
        email,
        contact: phone
      },
      theme: { color: "#1EB1C5" }
    };

    try {
      const data = await RazorpayCheckout.open(options);
      if (!data?.razorpay_payment_id) {
        throw new Error("Payment failed - No payment ID received");
      }
      return data.razorpay_payment_id;
    } catch (error) {
      throw new Error(error?.description || "Payment failed");
    }
  };

// const placeOrder = async () => {
//   if (!validateFields()) return;
//   if (!items?.length) {
//     Alert.alert("Error", "Your cart is empty");
//     return;
//   }

//   setLoading(true);

//   console.log('ordersfirst');
//   try {
//     // Step 1: Create the order first
//     const payload = {
//       shipping_first_name: name.trim(),
//       shipping_email: email.trim(),
//       shipping_phone: phone.trim(),
//       shipping_address1: address1.trim(),
//       shipping_address2: address2.trim(),
//       shipping_address_city: city.trim(),
//       shipping_address_country: country.trim(),
//       shipping_address_state: state.trim(),
//       shipping_address_po_code: pincode.trim(),
//       contact_id: user?.contact_id,
//       total_amount: calculateTotal(),
//       payment_method: 'razorpay',
//       order_status: 'pending'
//     };

//     console.log('Creating order with payload:', JSON.stringify(payload, null, 2));

//     const orderResponse = await api.post('/orders/insertorders', payload);

//     console.log('Order creation response:', orderResponse?.data);

//     if (!orderResponse?.data?.data?.insertId) {
//       throw new Error('Failed to create order');
//     }

//     const orderId = orderResponse.data.data.insertId;

//     // Step 2: Insert order items
//     try {
//       await Promise.all(
//   items.map(item =>
//     api.post('/orders/insertOrderItem', {
//       order_id: Number(orderId),
//       contact_id: Number(user.contact_id),

//       // REQUIRED + TYPE SAFE
//       product_id: Number(item.id),       // maps to record_id
//       qty: Number(item.qty),
//       unit_price: Number(item.price),
//       item_title: item.title,             // 🔥 MISSING BEFORE

//       // Prevent backend surprises
//       qty_for_invoice: Number(item.qty),
//       cost_price: Number(item.price),
//       month: new Date().getMonth() + 1,
//       year: new Date().getFullYear()
//     })
    
//   )
// );

//     } catch (error) {
//       console.error('Error inserting order items:', error.response?.data || error.message);
//       throw new Error('Failed to insert order items');
//     }

//     // Step 3: Process payment
//     let paymentId;
//     try {
//       paymentId = await handlePayment(orderId);
//     } catch (error) {
//       // If payment fails, we should mark the order as failed
//       await api.post('/orders/updateOrderPayment', {
//         order_id: orderId,
//         status: 'failed',
//         payment_id: null
//       });
//       throw new Error('Payment failed: ' + (error.message || ''));
//     }

//     // Step 4: Update order status and send email separately to handle potential failures
//     let orderStatusUpdated = false;

//     // Validate required data before making the API call
//     if (!orderId || !paymentId) {
//       console.error('Missing required data for order status update:', { orderId, paymentId });
//       Alert.alert(
//         "Error",
//         "Missing order or payment information. Please contact support."
//       );
//       return;
//     }

//     try {
//       console.log('Updating order status with data:', {
//         order_id: orderId,
//         payment_id: paymentId,
//         status: 'completed'
//       });

//       const updateResponse = await api.post('/orders/updateOrderPayment', {
//         order_id: orderId,
//         payment_id: paymentId,
//         status: 'completed'
//       });

//       console.log('Order status update response:', updateResponse?.data);

//       if (updateResponse?.data?.success || updateResponse?.status === 200) {
//         orderStatusUpdated = true;
//         console.log('Order status updated successfully');
//       } else {
//         throw new Error('Invalid response from server: ' + JSON.stringify(updateResponse?.data));
//       }
//     } catch (error) {
//       console.error('Failed to update order status:', error);
//       console.error('Error details:', {
//         message: error?.message,
//         response: error?.response?.data,
//         status: error?.response?.status,
//         orderId: orderId,
//         paymentId: paymentId
//       });

//       // Try one more time with a simplified payload
//       try {
//         console.log('Retrying order status update for order:', orderId);
//         const retryResponse = await api.post('/orders/updateOrderPayment', {
//           order_id: orderId,
//           payment_id: paymentId,
//           status: 'completed'
//         });

//         console.log('Retry response:', retryResponse?.data);
//         if (retryResponse?.data?.success || retryResponse?.status === 200) {
//           orderStatusUpdated = true;
//           console.log('Order status updated successfully on retry');
//         }
//       } catch (retryError) {
//         console.error('Retry failed for order status update:', retryError);
//         console.error('Retry error details:', {
//           message: retryError?.message,
//           response: retryError?.response?.data,
//           status: retryError?.response?.status
//         });

//         // Show warning to user but don't block the flow
//         Alert.alert(
//           "Warning",
//           "Payment successful but order status update failed. Please contact support with Order ID: " + orderId,
//           [{ text: "OK" }]
//         );
//       }
//     }

//     try {
//       await api.post('/commonApi/sendUseremailApp', {
//         to: email.trim(),
//         subject: "Order Confirmed",
//         phone: phone.trim(),
//         names: name.trim(),
//         address: address1.trim(),
//         city: city.trim(),
//         TotalAmount: calculateTotal(),
//         code: pincode.trim()
//       });
//     } catch (error) {
//       console.error('Failed to send confirmation email:', error);
//       // Continue execution as this is non-critical
//     }

//     // Clear cart and navigate only if everything went well or order status was updated
//     dispatch(clearCart(user));

//     if (orderStatusUpdated) {
//       navigation.navigate('OrderSuccess');
//     } else {
//       // Navigate to success but with a note about status update failure
//       navigation.navigate('OrderSuccess', {
//         orderStatusWarning: true,
//         orderId: orderId
//       });
//     }

//   } catch (error) {
//     console.error('Order placement error:', error);
//     Alert.alert(
//       "Error",
//       error?.message || "Failed to place order. Please contact support if payment was deducted."
//     );
//   } finally {
//     setLoading(false);
//   }
// };

const placeOrder = async () => {
  if (!validateFields()) return;

  if (!items?.length) {
    Alert.alert("Error", "Cart is empty");
    return;
  }

  setLoading(true);

  let orderId;

  /* ============================
     1️⃣ INSERT ORDER
     ============================ */
  try {
    const orderPayload = {
      shipping_first_name: name.trim(),
      shipping_email: email.trim(),
      shipping_phone: phone.trim(),
      shipping_address1: address1.trim(),
      shipping_address2: address2.trim(),
      shipping_address_area: area?.trim() || "",
      shipping_address_city: city.trim(),
      shipping_address_state: state.trim(),
      shipping_address_country: country.trim(),
      shipping_address_po_code: pincode.trim(),
      contact_id: Number(user?.contact_id),
      total_amount: Number(calculateTotal()),
      payment_method: "offline",
      order_status: "pending",
    };

    console.log("📦 insertorders payload:", orderPayload);

    const orderRes = await api.post("/orders/insertorders", orderPayload);

    console.log("✅ insertorders response:", orderRes.data);

    orderId = orderRes?.data?.data?.insertId;

    if (!orderId) {
      throw new Error("Order ID not returned");
    }
  } catch (err) {
    console.log("❌ insertorders FAILED");
    console.log("STATUS:", err?.response?.status);
    console.log("DATA:", err?.response?.data);
    setLoading(false);
    return;
  }

  /* ============================
     2️⃣ INSERT ORDER ITEMS
     ============================ */
  try {
    await Promise.all(
      items.map(item => {
        const itemPayload = {
          order_id: Number(orderId),
          contact_id: Number(user.contact_id),

          // ⚠️ VERY IMPORTANT
          product_id: Number(item.product_id || item.id),

          qty: Number(item.qty),
          unit_price: Number(item.price),
          total_price: Number(item.qty) * Number(item.price), // 🔥 REQUIRED
          item_title: item.title,

          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        };

        console.log("📦 insertOrderItem payload:", itemPayload);

        return api.post("/orders/insertOrderItem", itemPayload);
      })
    );

    console.log("✅ insertOrderItem success");
  } catch (err) {
    console.log("❌ insertOrderItem FAILED");
    console.log("STATUS:", err?.response?.status);
    console.log("DATA:", err?.response?.data);
    setLoading(false);
    return;
  }

  /* ============================
     SUCCESS
     ============================ */
  Alert.alert("Success", "Order placed successfully");
  dispatch(clearCart(user));
  navigation.navigate("OrderSuccess");

  setLoading(false);
};


  const updateQuantity = (itemId, newQuantity) => {
    if (!user?.id) return;
    if (newQuantity <= 0) {
      dispatch(deleteCartItem({ itemId, userId: user.id }));
    } else {
      dispatch(updateCart({ itemId, quantity: newQuantity, userId: user.id }));
    }
  };

  // const removeItem = (itemId) => {
  //   if (user?.id) {
  //     dispatch(deleteCartItem({ itemId, userId: user.id }));
  //   }
  // };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1EB1C5" />
        <Text style={styles.loadingText}>Processing your order...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Checkout</Text>
      
      {/* Cart Items Section */}
      <View style={styles.section}>
        <Text style={styles.heading}>Cart Items</Text>
        {!items?.length ? (
          <Text style={styles.emptyCart}>Your cart is empty</Text>
        ) : (
          items.map((item) => (
            <View key={item.basket_id} style={styles.cartItem}>
              <Image
                source={{ uri: `${imageBase}${item.images[0]}` }}
                style={styles.cartItemImage}
                resizeMode="cover"
                //defaultSource={require('../assets/placeholder.png')}
              />
              <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemName}>{item.title}</Text>
                <Text style={styles.cartItemPrice}>₹{item.price}</Text>
                <View style={styles.quantityContainer}>
                  {/* <TouchableOpacity
                    style={styles.quantityBtn}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Text style={styles.quantityBtnText}>-</Text>
                  </TouchableOpacity> */}
                   <Text style={styles.quantity}>Qty :</Text>
                  <Text style={styles.quantity}>{item.qty}</Text>
                  {/* <TouchableOpacity
                    style={styles.quantityBtn}
                    onPress={() => updateQuantity(item.id, item.qty + 1)}
                  >
                    <Text style={styles.quantityBtnText}>+</Text>
                  </TouchableOpacity> */}
                </View>
              </View>
              {/* <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeItem(item.basket_id)}
              >
                <Text style={styles.removeBtnText}>×</Text>
              </TouchableOpacity> */}
            </View>
          ))
        )}
        {items?.length > 0 && (
          <Text style={styles.total}>Total: ₹{calculateTotal()}</Text>
        )}
      </View>

      {/* Delivery Details Section */}
      <View style={styles.section}>
        <Text style={styles.heading}>Delivery Address Details</Text>
        
        <TextInput
          style={[styles.input, { color: '#000' }]}
          placeholder="Full Name"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
          maxLength={50}
        />
        
        <TextInput
          style={[styles.input, { color: '#000' }]}
          placeholder="Email Address" 
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          maxLength={100}
        />
        
        <TextInput
          style={[styles.input, { color: '#000' }]}
          placeholder="Phone Number"
          placeholderTextColor="#666"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={10}
        />
        
        <TextInput
          style={[styles.input, { color: '#000' }]}
          placeholder="Address Line 1"
          placeholderTextColor="#666"
          value={address1}
          onChangeText={setAddress1}
          maxLength={100}
        />

        <TextInput
          style={[styles.input, { color: '#000' }]}
          placeholder="Address Line 2"
          placeholderTextColor="#666"
          value={address2}
          onChangeText={setAddress2}
          maxLength={100}
        />

        <TextInput
          style={[styles.input, { color: '#000' }]}
          placeholder="Area"
          placeholderTextColor="#666"
          value={area}
          onChangeText={setArea}
          maxLength={50}
        />
        
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.cityInput, { color: '#000' }]}
            placeholder="City"
            placeholderTextColor="#666"
            value={city}
            onChangeText={setCity}
            maxLength={50}
          />
          
          <TextInput
            style={[styles.input, styles.pincodeInput, { color: '#000' }]}
            placeholder="Pincode"
            placeholderTextColor="#666"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
            maxLength={6}
          />
        </View>

        <TextInput
          style={[styles.input, { color: '#000' }]}
          placeholder="State"
          placeholderTextColor="#666"
          value={state}
          onChangeText={setState}
          maxLength={50}
        />

        <TextInput
          style={[styles.input, { color: '#000' }]}
          placeholder="Country"
          placeholderTextColor="#666"
          value={country}
          onChangeText={setCountry}
          maxLength={2}
        />
      </View>

      {/* Place Order Button */}
      <TouchableOpacity
        style={[
          styles.orderBtn,
          (!items?.length || loading) && styles.orderBtnDisabled
        ]}
        onPress={()=>placeOrder()}
        disabled={!items?.length || loading}
      >
        <Text style={styles.orderBtnText}>
          {loading ? "Processing..." : `Place Order - ₹${calculateTotal()}`}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Outfit-Regular',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Regular',
    color: '#333',
    marginBottom: 12,
  },
  emptyCart: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    padding: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
    fontFamily: 'Outfit-Regular',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'Outfit-Regular',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1EB1C5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Regular',
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Outfit-Regular',
  },
  removeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 18,
    
    fontFamily: 'Outfit-Regular',
  },
  total: {
    fontSize: 18,
    fontFamily: 'Outfit-Regular',
    // fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  addressInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cityInput: {
    flex: 0.65,
    marginRight: 8,
  },
  pincodeInput: {
    flex: 0.3,
  },
  orderBtn: {
    backgroundColor: '#1EB1C5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  orderBtnDisabled: {
    backgroundColor: '#ccc',
  },
  orderBtnText: {
    color: '#fff',
    fontSize: 18,
   fontFamily: 'Outfit-Regular',
  },
});

export default Checkout;