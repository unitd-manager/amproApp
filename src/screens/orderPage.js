import React, { useLayoutEffect, useState,useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  I18nManager,
  TextInput,
  Alert
} from "react-native";
import { connect } from "react-redux";
import CustomBtn from "../components/customBtn";
import ScreenIndicator from "../components/screenIndicator";
import OrderProductCard from "../components/orderProductCard";
import MethodPicker from "../components/methodPicker";
import api from "../constants/api";
import { HEIGHT } from "../components/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import imageBase from "../constants/imageBase";
import RazorpayCheckout from 'react-native-razorpay';

const OrderPage = ({ navigation, theme, reduxLang, route }) => {
  /////////////////// Header Settings

  const { total,datas,firstName,address,email,phone,pincode,city,statesName,country,lastName } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: reduxLang.Order,
      headerStyle: {
        backgroundColor: theme.secondryBackgroundColor,
        shadowColor: "transparent",
      },
      headerTintColor: theme.textColor,
    });
  }, [navigation, theme.secondryBackgroundColor, theme.textColor]);
  ///////////////////

  const [heightValue, setHeight] = useState(40);
  const [phones, onChangePhone] = useState("");
  const [UserDetails, setUserDetails] = useState("");
  const [pay, setPay] = useState("");
  const [payStatus, setPayStatus] = useState(""); 
  
  
  
 console.log('payStatus',payStatus)
 

  const [paymentMethods, setpaymentMethods] = useState([
    // { value: reduxLang.Stripe, status: false, index: 0 },
    // { value: reduxLang.Paypal, status: true, index: 1 },
    { value: reduxLang.Razorpay,method:reduxLang.CashOnDelivery,status: true, index: 2 },
    // { value: reduxLang.Visa, status: true, index: 3 },
    { value: reduxLang.CashOnDelivery,method:reduxLang.Razorpay,status: true, index: 4 },
  ]);

  let [cardData] = useState([
    {
      url: require("../images/headPhone/CustomSize3.png"),
      productName: reduxLang.JBL,
      quantity: "120 Products",
    },
    {
      url: require("../images/headPhone/CustomSize3.png"),
      productName: reduxLang.Sony,
      quantity: "650 Products",
    },
  ]);
  const [cart, setCart] = useState([]);
  const [userContactId, setUserContactId] = useState(null);
  

  const getUserCart = async () => {
    try {
      const userData = await AsyncStorage.getItem('USER');
      const user = JSON.parse(userData);
      setUserDetails(user)
      setUserContactId(user?.contact_id || null);
      
      if (user && user.contact_id) {
        const response = await api.post('/orders/getBasket', { contact_id: user.contact_id });
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    getUserCart();
  }, []);


  const removeBacket = async () => {
    try {
      await api.post('/orders/deleteBasketContact', { contact_id: userContactId });
      await getUserCart();
      Alert.alert('Orders deleted.');
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };
   
  const SendEmail = () => {

    const to = email;
    const subject = "Order Confirmed";
    const phone = phone;
    const names = firstName;
    const address = address;
    const city = city;
    const state = statesName;
    const Country =country;
    const TotalAmount = total;
    const code = pincode;

    api
        .post('/commonApi/sendUseremailApp', {
            to,
            subject,
            phone,
            names,
            address,
            city,
            state,
            Country,
            TotalAmount,
            code


        })
        .then(response => {
            if (response.status === 200) {
                Alert.alert('Orders Sent successfully on your mail.');
                // navigation.navigate(StackNav.ProductList)
            } else {
                console.error('Error');
            }
        });
};
  const addDeliveryAddress = async () => {
    if (!userContactId) {
      Alert.alert('User information not found.');
      return;
    }
  
    try {
      const response = await api.post('/orders/insertorders', {
        shipping_first_name: firstName,
        shipping_last_name: lastName,
        shipping_email: email,
        shipping_phone: phone,
        shipping_address1: address,
        shipping_address_city: city,
        shipping_address_state: statesName, // assuming this is correct
        shipping_address_country_code: country, // assuming this is correct
        shipping_address_po_code: pincode,
        contact_id: userContactId,
         notes:phones,
         payment_method:payStatus,
      });
  
      if (response.status === 200) {
        const orderId = response.data.data.insertId;
  
        // Insert each order item one by one
        const orderItemsPromises = cart.map(item => {
          console.log('productID',item.product_id)
          return api.post('/orders/insertOrderItem', {
            qty: item.qty,
            unit_price: item.price,
            contact_id: userContactId,
            order_id: orderId,
            product_id: item.product_id
          });
        });
  
        const orderItemsResponses = await Promise.all(orderItemsPromises);
        
        // Check if all order items were inserted successfully
        const allInserted = orderItemsResponses.every(response => response.status === 200);
        
        if (allInserted) {
         
         
          Alert.alert('Order placed successfully');
          // navigation.navigate("ShippingMethod");
        } else {
          console.error('Error placing one or more order items');
        }
      } else {
        console.error('Error');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  function selectMethod(index) {
    let newArr = [...paymentMethods];
    newArr.forEach((item) => {
      if (index !== item.index) {
        setPay(item.index)
        setPayStatus(item.method)
        item.status = true;
      } else {
        item.status = false;
      }
    });
    setpaymentMethods(newArr);
  }

  const textRow = (keyText, valueText, bold) => (
    <View
      style={[
        styles.rowContainer,
        {
          backgroundColor: theme.primaryBackgroundColor,
        }
      ]}
      key={keyText}
    >
      <Text
        style={[
          styles.headerText,
          {
            color: theme.textColor,
            fontSize: bold
              ? theme.appFontSize.largeSize + 1
              : theme.appFontSize.mediumSize,
            fontFamily: theme.appFontSize.fontFamily,
            fontWeight: bold ? "bold" : "normal",
          },
        ]}
      >
        {keyText}
      </Text>

      <Text
        style={[
          styles.headerText,
          {
            color: theme.textColor,
            fontSize: bold
              ? theme.appFontSize.largeSize + 1
              : theme.appFontSize.mediumSize,
            fontFamily: theme.appFontSize.fontFamily,
            fontWeight: bold ? "bold" : "normal",
          },
        ]}
      >
        {valueText}
      </Text>
    </View>
  );

  const bodyRowText = (value) => (
    <View style={styles.bodyView}>
      <Text
        style={{
          fontSize: theme.appFontSize.mediumSize,
          color: theme.textColor,
          fontFamily: theme.appFontSize.fontFamily,
        }}
      >
        {value}
      </Text>
    </View>
  );
  

  const headingText = (heading) => (
    <View
      style={[
        styles.headingView,
        {
          backgroundColor: theme.secondryBackgroundColor,
        }
      ]}
    >
      <Text
        style={{
          fontSize: theme.appFontSize.largeSize,
          color: theme.textColor,
          fontFamily: theme.appFontSize.fontFamily,
          fontWeight: "bold",
          textAlign: "left",
        }}
      >
        {heading}
      </Text>
    </View>
  );
  const [addresss, setAddress] = useState([]);
  useEffect(() => {
    if (datas && datas.length > 0 && datas[0].contact_id) {
      api
        .post("/orders/getAddressContact", {
          contact_id: datas[0].contact_id,
        })
        .then((res) => {
          setAddress(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [datas]);

  const onPaymentPress = async () => {

    const amountInPaise = total * 100;
    console.log('amountInPaise',amountInPaise)
    const options = {
      description: 'Purchase Description',
      image: 'https://your-company.com/your_image.png',
      currency: 'INR',
      key: "rzp_test_Cmcb2IrTMsQEYc", // Replace with your Razorpay test/live key
      amount: amountInPaise, // Amount in currency subunits (e.g., 1000 for INR 10)
      name: 'United',
      prefill: {
        email:UserDetails.email,
        contact: UserDetails.mobile,
        name: UserDetails.first_name,
      },
      theme: { color: '#532C6D' },
    };

    try {
      const data = await RazorpayCheckout.open(options);
      console.log('Payment Successful:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.primaryBackgroundColor },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainerStyle}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.deviderStyleView}>
          <ScreenIndicator
            theme={theme}
            text={"1"}
            label={reduxLang.Shipping}
            selectedValue={true}
          />
          <ScreenIndicator
            theme={theme}
            text={"2"}
            label={reduxLang.ShippingMethod}
            selectedValue={true}
          />
          <ScreenIndicator
            theme={theme}
            text={"3"}
            label={reduxLang.PlaceOrder}
            selectedValue={true}
          />
        </View>

        {headingText(reduxLang.BillingAddress)}
        { bodyRowText(   
          <View style={styles.bodyView} >
            <Text>Name     : {UserDetails.first_name}</Text>
            <Text>Address: {UserDetails.address1}</Text>
            <Text>                {UserDetails.mobile}</Text>
            <Text>                {UserDetails.email}</Text>
            <Text>                {UserDetails.address_city}</Text>
            <Text>                {UserDetails.address_po_code}</Text>
            <Text>                {UserDetails.address_state}</Text>
            </View>
        )}

        {headingText(reduxLang.ShippingAddress)}

       { bodyRowText(   
          <View style={styles.bodyView} >
          <Text>Name     : {firstName}</Text>
          <Text>Address: {address}</Text>
          <Text>                {phone}</Text>
          <Text>                {city}</Text>
          <Text>                {pincode}</Text>
          <Text>                {statesName}</Text>
          </View>
        )}
        

        {headingText(reduxLang.SelectPaymentMethod)}

        {paymentMethods.map((item, index) => (
          <View key={index}>
            <MethodPicker
              index={index}
              item={item}
              selectMethod={selectMethod}
              theme={theme}
            />
          </View>
        ))}

        {headingText(reduxLang.MyProducts)}

        {datas.map((item, index) => (
          <OrderProductCard
            key={index}
            url={{ uri: `${imageBase}${item.images}` }}
            name={item.title}
            price={item.price}
            priceNet={item.discount_amount}
            qtyy={item.qty}
            theme={theme}
          ></OrderProductCard>
        ))}

        <View
          style={[
            styles.totalPriceContainer,
            {
              backgroundColor:  theme.primaryBackgroundColor,
              borderBottomColor: theme.secondryBackgroundColor,
              borderTopColor: theme.secondryBackgroundColor,
            }
          ]}
        >
          {textRow(reduxLang.SubTotal, "$6.00")}
          {textRow(reduxLang.Shipping, "$0.00")}
          {textRow(reduxLang.Tax, "$3.00")}
          {textRow(reduxLang.Discount, "$12.00")}
          {textRow(reduxLang.Total, total, true)}
        </View>

        {headingText(reduxLang.OrderNote)}

        <TextInput
          style={[
            styles.textInput,
            styles.marginBot,
            {
              backgroundColor: theme.secondryBackgroundColor,
              color: theme.textColor,
              height: HEIGHT * 0.1 + heightValue,
              fontSize: theme.appFontSize.mediumSize,
              fontFamily: theme.appFontSize.fontFamily,
            },
            styles.textAlignVertical,
          ]}
          onChangeText={(text) => onChangePhone(text)}
          placeholder={reduxLang.WriteNote}
          placeholderTextColor={"gray"}
          value={phones}
          editable={true}
          multiline={true}
          onContentSizeChange={(e) =>
            setHeight(e.nativeEvent.contentSize.height)
          }
        />

        {/* /////////////////////////////////////////////////// */}

        <CustomBtn
          onPressFun={() => {
            if(pay === 4){
              onPaymentPress()
              addDeliveryAddress()
              SendEmail()
              removeBacket()
              navigation.navigate("ThankYouScreen");
            }else{
              addDeliveryAddress()
              SendEmail()
              removeBacket()
            navigation.navigate("ThankYouScreen");
            }
            // addDeliveryAddress()
            // navigation.navigate("ThankYouScreen");
          }}
          theme={theme}
          title={reduxLang.ConfirmOrder}
        />
        <View style={styles.marginBot} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  marginBot: {
    marginBottom: 12,
  },
  headingView: {
    justifyContent: "flex-start",
    width: "100%",
    padding: 10,
    margin: 6,
    marginLeft: 0,
    marginRight: 0,
  },
  bodyView: {
    alignItems: "flex-start",
    width: "100%",
    padding: 10,
    paddingTop: 2,
    paddingBottom: 8,
  },
  textInput: {
    borderColor: "gray",
    width: "93%",
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    marginBottom: 6,
    textAlign: I18nManager.isRTL ? "right" : "left",
    alignSelf: "center",
  },
  headerText: {
    paddingHorizontal: 4,
    textAlign: "left",
  },
  deviderStyleView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "10%",
    marginBottom: "10%",
    width: "100%",
    alignSelf: "center",
  },
  totalPriceContainer: {
    borderTopWidth: 6,
    paddingVertical: 9,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 6,
    paddingHorizontal: 14,
  },
  textAlignVertical: {
    textAlignVertical: "top",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContainerStyle: {
    paddingBottom: 5,
  },
});

const mapStateToProps = (state) => ({
  theme: state.configReducer.theme,
  reduxLang: state.configReducer.lang,
});

export default connect(mapStateToProps, null)(OrderPage);
