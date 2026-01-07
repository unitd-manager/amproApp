
import React, { useEffect, useState,useCallback, useContext } from "react";
import { SafeAreaView, View, ScrollView, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, ImageBackground, Alert } from "react-native";
import api from '../constants/api';
import imageBase from "../constants/imageBase";
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartItems, deleteCartItem, addToCart,clearCart,updateCart } from '../redux/slices/cartSlice';
import { fetchWishlistItems,clearWishlist,deleteWishlistItem } from "../redux/slices/wishlistSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from "../context/AuthContext";
//import BackButton from "../components/BackButton";


 const WishlistScreen = ({navigation}) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  //const [user, setUser] = useState();


  const { user, logout } = useContext(AuthContext);
  console.log('user wishlist',user);
  const dispatch = useDispatch();
  const { wishitems, status } = useSelector((state) => state.wishlist);
  console.log('wishitems wishlist',wishitems);
  const [mailId, setmailId] = useState("");
  const getEmail = () => {
    api.get("/setting/getMailId").then((res) => {
      setmailId(res.data.data[0]);
    });
  };
  useEffect(() => {
    dispatch(fetchWishlistItems(user));
  }, []);

const clearCartItems=()=>{
    dispatch(clearWishlist(user)).then(()=>{
      
     dispatch(fetchWishlistItems(user));
                 })
                 .catch((error) => {
                   console.error('Failed to clear wishlist:', error);
                 });
}

  const handleDelete = (item) => {
    dispatch(deleteWishlistItem(item)).then(()=>{
      
     dispatch(fetchWishlistItems(user));
                 })
                 .catch((error) => {
                   console.error('Failed to remove from wishlist:', error);
                 });
  };

//const cartItems = useSelector(state => state.cart.cartItems);
console.log('cartpage',wishitems)

const handleIncreaseQuantity = useCallback(
    (item) => {
      const updatedItem = { ...item, qty: item.qty + 1 };
      dispatch(updateCart(updatedItem));
    },
    [dispatch]
  );

  const handleDecreaseQuantity = useCallback(
    (item) => {
      if (item.qty > 1) {
        const updatedItem = { ...item, qty: item.qty - 1 };
        dispatch(updateCart(updatedItem));
      }
    },
    [dispatch]
  );

 
  
  useEffect(() => {
    const initialize = async () => {
      try {
        
        if (user) {
          dispatch(fetchCartItems(user));
        }
        getEmail();
      } catch (e) {
        console.error('Error reading user from AsyncStorage:', e);
      }
    };
  
    initialize();
  }, []);
  


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView  style={styles.scrollView}>
                <View style={styles.row2}>
                    {/* <BackButton/>
                    <Text style={styles.text2}>
                        {"My Cart"}
                    </Text> */}
                </View>

            
          {loading ? (
                    <ActivityIndicator size="large" color="#1EB1C5" />
     ): wishitems.length === 0 ? (
        <View style={styles.emptyContainer}>
        <Icon name="heart-outline" size={100} color="#1EB1C5" style={{ marginBottom: 20 }} />
        <Text style={styles.emptyText}>Your wishlist is empty</Text>
        <TouchableOpacity
  style={styles.homeButton}
  onPress={() => navigation.navigate("MainApp", { screen: "Home", params: { screen: "HomeMain" } })}
>
  <View style={styles.homeButtonContent}>
    <Icon name="home-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
    <Text style={styles.homeButtonText}>Go Home</Text>
  </View>
</TouchableOpacity>

      </View>
      )  : (wishitems.map((item, index) => (
                <View style={styles.row3}>
                    <Image
                        source = {{uri: `${imageBase}${item.images[0]}`}} 
                        resizeMode = {"stretch"}
                        style={styles.image3}
                    />
                    <View style={styles.view}>
                        <View style={styles.column}>
                        <TouchableOpacity
      onPress={() => navigation.navigate("ProductDetails", { productId: item.product_id })}
    >
                            <View style={styles.column2}  >
                                <Text style={styles.text3}>
                                    {item.title}
                                </Text>
                                <Text style={styles.text4}>
                                    {item.product_type}
                                </Text>
                            </View>
                            </TouchableOpacity>
                            
{/* <View style={styles.row4}>
  <TouchableOpacity onPress={() => handleDecreaseQuantity(item)}>
    <Icon name="remove-circle-outline" size={15} color="#1EB1C5" />
  </TouchableOpacity>

  <TouchableOpacity style={styles.button}>
    <Text style={styles.text5}>
      {item?.qty}
    </Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => handleIncreaseQuantity(item)}>
    <Icon name="add-circle-outline" size={15} color="#1EB1C5" />
  </TouchableOpacity>
</View> */}
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => handleDelete(item)}>
  <Icon name="trash" size={24} color="red" style={{ marginLeft: 10 }} />
</TouchableOpacity>

                </View>
                
                )))}

{wishitems.length>0 &&<View style={styles.view4}>
                    <TouchableOpacity style={styles.button4} onPress={()=>clearCartItems()}>
                        <Text style={styles.text9}>
                            {"Clear Wishlist"}
                        </Text>
                    </TouchableOpacity>
                </View>}
                
                {/* {wishitems.length>0 &&<View style={styles.view4}>
                    <TouchableOpacity style={styles.button4} onPress={()=>generateCode()}>
                        <Text style={styles.text9}>
                            {"Enquire Now"}
                        </Text>
                    </TouchableOpacity>
                </View>} */}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F9F9F9',
    },
    scrollView: {
      padding: 16,
    },
    row3: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      //shadowColor: '#000',
      //shadowOpacity: 0.1,
      //shadowRadius: 8,
      //elevation: 4,
    },
    image3: {
      width: 80,
      height: 80,
      borderRadius: 10,
      marginRight: 12,
    },
    view: {
      flex: 1,
    },
    column2: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
    },
    text3: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
      alignSelf: 'center',
    },
    text4: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
    },
    row4: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
    },
    button: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: '#1EB1C5',
      marginHorizontal: 6,
    },
    text5: {
      color: '#fff',
      fontWeight: 'bold',
    },
    view4: {
      marginVertical: 20,
      alignItems: 'center',
    },
    button4: {
      backgroundColor: '#1EB1C5',
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      shadowColor: '#1EB1C5',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
    text9: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 18,
      color: '#555',
      marginBottom: 16,
      textAlign: 'center',
    },
    homeButton: {
      backgroundColor: '#1EB1C5',
      borderRadius: 8,
      padding: 12,
      marginTop: 10,
    },
    homeButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    homeButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '500',
    },
  });
  

export default WishlistScreen;

