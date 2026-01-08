

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";

// Screens
import Home from "./screens/Home";
import Account from "./screens/Account";
import Categories from "./screens/Categories";
import Cart from "./screens/Cart";
import ProductList from "./screens/ProductList";
import ProductDetails from "./screens/ProductDetails";
import AboutUs from "./screens/AboutUs";
import Profile from "./screens/Profile";
import ContactUs from "./screens/ContactUs";
import WishlistScreen from "./screens/Wishlist";
//import EnquiryHistory from "./screens/EnquiryHistory";
//import EnquiryDetails from "./screens/EnquiryDetails";
import Orders from "./screens/Orders";
import OrderDetails from "./screens/OrderDetails";
import Checkout from "./screens/Checkout";
import OrderSuccess from "./screens/OrderSuccess";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 🔹 Common header styles
const commonHeaderOptions = {
  headerStyle: {
    backgroundColor: "#1EB1C5",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTintColor: "#fff",
  headerTitleAlign: "center",
  headerTitleStyle: {
    fontFamily: "Outfit-Regular",
    fontSize: 18,
  },
};

// 💡 Home Stack
const HomeStack = () => (
  <Stack.Navigator screenOptions={commonHeaderOptions}>
    <Stack.Screen
      name="HomeMain"
      component={Home}
      options={{ title: "Ampro" }}
    />
    <Stack.Screen
      name="ProductList"
      component={ProductList}
      options={{ title: "Products" }}
    />
    <Stack.Screen
      name="ProductDetails"
      component={ProductDetails}
      options={{ title: "Product Details" }}
    />
  </Stack.Navigator>
);

// 💡 Categories Stack
const CategoriesStack = () => (
  <Stack.Navigator screenOptions={commonHeaderOptions}>
    <Stack.Screen
      name="CategoriesMain"
      component={Categories}
      options={{ title: "Categories" }}
    />
    <Stack.Screen
      name="ProductList"
      component={ProductList}
      options={{ title: "Products" }}
    />
    <Stack.Screen
      name="ProductDetails"
      component={ProductDetails}
      options={{ title: "Product Details" }}
    />
  </Stack.Navigator>
);

// 💡 Cart Stack
const CartStack = () => (
  <Stack.Navigator screenOptions={commonHeaderOptions}>
    <Stack.Screen
      name="CartMain"
      component={Cart}
      options={{ title: "Your Cart" }}
    />
    <Stack.Screen
      name="ProductDetails"
      component={ProductDetails}
      options={{ title: "Product Details" }}
    />
    <Stack.Screen
      name="Checkout"
      component={Checkout}
      options={{ title: "Checkout" }}
    />
    <Stack.Screen
      name="OrderSuccess"
      component={OrderSuccess}
      options={{ title: "Order Successful" }}
    />
    <Stack.Screen
      name="Orders"
      component={Orders}
      options={{ title: "My Orders" }}
    />
    <Stack.Screen
      name="OrderDetails"
      component={OrderDetails}
      options={{ title: "Order Details" }}
    />
  </Stack.Navigator>
);

// 💡 Account Stack
const AccountStack = () => (
  <Stack.Navigator screenOptions={commonHeaderOptions}>
    <Stack.Screen
      name="AccountMain"
      component={Account}
      options={{ title: "My Account" }}
    />
             <Stack.Screen name="AboutUs" component={AboutUs}  options={{ title: "About Us" }} />
             <Stack.Screen name="Profile" component={Profile}  options={{ title: "Profile" }} />
             <Stack.Screen name="ContactUs" component={ContactUs}  options={{ title: "Contact Us" }} />
             <Stack.Screen name="WishlistScreen" component={WishlistScreen}  options={{ title: "Wishlist" }} />
             {/* <Stack.Screen name="EnquiryHistory" component={EnquiryHistory}  options={{ title: "Enquiries" }} />
             <Stack.Screen name="EnquiryDetails" component={EnquiryDetails}  options={{ title: "Enquiry Details" }} /> */}
                          <Stack.Screen name="Orders" component={Orders}  options={{ title: "Orders" }} />
             <Stack.Screen name="OrderDetails" component={OrderDetails}  options={{ title: "Order Details" }} /> 
  </Stack.Navigator>
);

// ✅ Tab Navigator
export default function TabNavigator() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Categories") iconName = "grid-outline";
          else if (route.name === "Cart") iconName = "cart-outline";
          else if (route.name === "Account") iconName = "person-outline";
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1EB1C5",
        tabBarInactiveTintColor: "gray",
        headerShown: false, // stack handles the headers
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Categories" component={CategoriesStack} />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{
          tabBarBadge: items.length > 0 ? items.length : null,
          tabBarBadgeStyle: {
            backgroundColor: "#1EB1C5",
            color: "#fff",
            fontSize: 12,
          },
        }}
      />
      <Tab.Screen name="Account" component={AccountStack} />
    </Tab.Navigator>
  );
}
