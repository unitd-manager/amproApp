import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import Screens
import Home from "./screens/Home";
import Account from "./screens/Account";
import ProductList from "./screens/ProductList";
import ProductDetails from "./screens/ProductDetails";
import Categories from "./screens/Categories";
import Cart from "./screens/Cart";
import LoginPage from "./screens/LoginPage";
import Signup from "./screens/Signup";
import AboutUs from "./screens/AboutUs";
import ForgotPassword from "./screens/ForgotPassword";
import Intro from "./screens/Intro";
import Enquiry from "./screens/Enquiry";
import EnquiryHistory from "./screens/EnquiryHistory";
import EnquiryDetails from "./screens/EnquiryDetails";
import ShippingDetails from "./screens/ShippingDetails";
import NewPassword from "./screens/NewPassword";
import Verification from "./screens/Verification";
import ShippingAddress from "./screens/ShippingAddress";
import NewPasswordPopup from "./screens/NewPasswordPopup";
import Frame from "./screens/Frame";
import TabNavigator from './TabNavigation';
import { useDispatch } from "react-redux";
import { fetchCartItems } from "./redux/slices/cartSlice";
import Profile from "./screens/Profile";
import ContactUs from "./screens/ContactUs";
import WishlistScreen from "./screens/Wishlist";

const Stack = createStackNavigator();

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
   const [user, setUser] = useState();
const dispatch=useDispatch();
 
useEffect(() => {
	const initialize = async () => {
	  try {
		const jsonValue = await AsyncStorage.getItem('user');
		const user = jsonValue != null ? JSON.parse(jsonValue) : null;
		setUser(user);
		if (user) {
		  dispatch(fetchCartItems(user));
		}
		
	  } catch (e) {
		console.error('Error reading user from AsyncStorage:', e);
	  }
	};
  
	initialize();
  }, []);
  
  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setIsLoggedIn(!!token); // If token exists, user is logged in
    };

    checkLoginStatus();
  }, []);

   useEffect(() => {
      dispatch(fetchCartItems(user));
    }, []);

  if (isLoggedIn === null) {
    return null; // Show nothing while checking auth status
  }

  return (
    
      <Stack.Navigator  initialRouteName= " "  screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Outfit-Regular',
          fontSize: 20,
        },
        headerStyle: {
          backgroundColor: "#1EB1C5",
        },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
      }}>
      {/* <Stack.Navigator initialRouteName={isLoggedIn ? "Home" : "LoginPage"}>
        {isLoggedIn ? (
          <> */}
          <Stack.Screen name=" " component={TabNavigator}  options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home}  options={{ title: "Home" }} />
            <Stack.Screen name="Account" component={Account}  options={{ title: "Account" }} />
            <Stack.Screen name="ProductList" component={ProductList} options={({ route }) => ({
    title: route.params?.categoryName || "Products",
    headerStyle: {
      backgroundColor: "#1EB1C5",
      fontFamily: 'Outfit-Regular',
    },
    headerTintColor: "#fff",
    headerTitleAlign: "center",
  })} />
            <Stack.Screen name="ProductDetails" component={ProductDetails}  options={{ title: "ProductDetails" }}/>
            <Stack.Screen name="Intro" component={Intro} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Cart" component={Cart} />
            {/* <Stack.Screen name="WishlistScreen" component={WishlistScreen}  options={{ title: "Wishlist" }}/> */}
            <Stack.Screen name="Categories" component={Categories}  options={{ title: "Categories" }}/>
            <Stack.Screen name="AboutUs" component={AboutUs} />
            <Stack.Screen name="NewPasswordPopup" component={NewPasswordPopup} />
            <Stack.Screen name="Enquiry" component={Enquiry} />
            <Stack.Screen name="EnquiryDetails" component={EnquiryDetails} />
            <Stack.Screen name="EnquiryHistory" component={EnquiryHistory} />
            <Stack.Screen name="Verification" component={Verification} />
            <Stack.Screen name="ShippingDetails" component={ShippingDetails} />
            <Stack.Screen name="ShippingAddress" component={ShippingAddress} />
            <Stack.Screen name="NewPassword" component={NewPassword} />
            <Stack.Screen name="Frame" component={Frame} />
            <Stack.Screen name="LoginPage" component={LoginPage} options={{ title: "Login" }}/>
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ContactUs" component={ContactUs} />
          {/* </>
        ) : (
          <> */}
            {/* <Stack.Screen name="LoginPage" component={LoginPage} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> */}
          {/* </>
        )}
      </Stack.Navigator> */}
      </Stack.Navigator>
    
  );
};

export default Navigation;
