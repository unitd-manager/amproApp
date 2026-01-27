import React, { useEffect, useState,useCallback, useContext } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  ImageBackground,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import api from "../constants/api";
import { addToCart, fetchCartItems } from '../redux/slices/cartSlice';
import { addToWishlist,fetchWishlistItems,deleteWishlistItem } from "../redux/slices/wishlistSlice";
import imageBase from "../constants/imageBase";
import noImage from "../assets/images/no-image.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from "../context/AuthContext";
//import BackButton from "../components/BackButton";
import GradeSelector from "../components/GradePicker";
import ProductDetailsSection from "../components/ProductDetailsSection";
import ProductImageGallery from "../components/ProductImageGallery";
import Divider from "../components/Divider";

export default ({ route }) => {
  const { productId } = route.params || {};
  const [product, setProduct] = useState({});
  const [userData, setUser] = useState({});
  const [productStock, setProductStock] = useState(
    product.variation ? product.variation[0].size[0].stock : product.qty_in_stock
  );
  const [quantityCount, setQuantityCount] = useState(1);

  const [selectedProductGrade, setSelectedProductGrade] = useState(
   
  );
console.log('product',product);
  const{user,logout}=useContext(AuthContext);

  const dispatch = useDispatch();
const { wishitems, status } = useSelector((state) => state.wishlist);
  
const isInWishlist = () => {
  return wishitems?.some(item => item.product_id === product.product_id);
};
  const addCart = (data) => {
 
    if(user){
      // if(selectedProductGrade){
     
    data.contact_id=user.contact_id
  //data.grade=selectedProductGrade;
     dispatch(addToCart(data)) 
             .then(() => { Alert.alert("Item added to cart")
               dispatch(fetchCartItems(user));
             })
             .catch((error) => {
               console.error('Failed to add to cart:', error);
             });
            } else{
              Alert.alert("Please Login")
            }
    
   
   
  };
  const deleteWishlist = (data) => {
 
  
     dispatch(deleteWishlistItem(data)) 
             .then(() => { Alert.alert("Item removed from wishlist")
               dispatch(fetchWishlistItems(user));
             })
             .catch((error) => {
               console.error('Failed to remove from wishlist:', error);
             });

   
  };

  
  const addWishlist = (data) => {
 
    if(user){
    
    data.contact_id=user.contact_id
  
     dispatch(addToWishlist(data)) 
             .then(() => { Alert.alert("Item added to wishlist")
               dispatch(fetchWishlistItems(user));
             })
             .catch((error) => {
               console.error('Failed to add to cart:', error);
             });
  
    }
    else{
      Alert.alert("Please Login")
     
    }
   
  };

   const getUserData = async () => {
      try {
        // const jsonValue = await AsyncStorage.getItem('user');
        // const user = jsonValue != null ? JSON.parse(jsonValue) : null;
  
        if (user?.contact_id) {
          
          // Get full user data from API
          const res = await api.post("/contact/getContactsById", {
            contact_id: user.contact_id,
          });
          console.log('user',user);
          setUser(res.data.data[0]);
        } else {
          
        }
      } catch (e) {
        console.error('Error fetching user:', e);
        
      }
    };
  
    useEffect(() => {
      getUserData();
    }, []);
  

    useFocusEffect(
      useCallback(() => {
        const fetchUser = async () => {
          const userData = await AsyncStorage.getItem('user');
          if (userData) {
            setUser(JSON.parse(userData)); // update context or redux here
          } else {
            setUser(null);
          }
        };
    
        fetchUser();
      }, [])
    );
  
  useEffect(() => {
    api
      .post("/product/getProductbyproductId", { product_id: productId })
      .then((res) => {
        let data = res.data.data[0];
        data.tag = String(data.tag).split(",");
        data.images = String(data.images).split(",");
        //data.grades = String(data.grades).split(",").filter((el)=>{return el = null });
        if (data.grades != null) {
  data.grades = String(data.grades)
    .split(",")
    .map(grade => grade.trim())
    .filter(el => el !== null && el !== '');
}
        console.log('productdata',data);
        setProduct(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ProductImageGallery images={product.images}/>
        
        <View style={styles.row3}>
          <Text style={styles.text3}>{product?.category_title}</Text>
          </View>
         
        <View style={styles.row5}>
  <Text style={styles.text5}>{product?.title}</Text>

  {/* <TouchableOpacity
    style={styles.cartbuttonRow}
    onPress={() => addCart(product)}
  >
    <Icon name="cart-outline" size={20} color="#1EB1C5" style={styles.cartIcon} />
    <Text style={styles.carttext9}>{"Add to Cart"}</Text>
  </TouchableOpacity>
   */}
  <TouchableOpacity
    style={styles.wishbuttonRow}
    onPress={() => {
      const existingWishItem = wishitems.find(item => item.product_id === product.product_id);
      if (isInWishlist()) {
        deleteWishlist(existingWishItem)
      
    }
  else{
    addWishlist(product)
  }}}
  >
    <Icon name={isInWishlist() ? "heart" : "heart-outline"}size={20} color="#1EB1C5" style={styles.cartIcon} />
    
  </TouchableOpacity>
</View>
      <Divider />
<View style={styles.gradeview}>
{/* <GradeSelector product={product} selectedProductGrade={selectedProductGrade} setSelectedProductGrade={setSelectedProductGrade} setProductStock={setProductStock} setQuantityCount={setQuantityCount} />   */}
    </View>
        <Image
          source={{
            uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/6hl7r52x.png",
          }}
          resizeMode={"stretch"}
          style={styles.image8}
        />

        {/* <View style={styles.row6}>
          <Text style={styles.text7}>{"Product Detail"}</Text>
          <Image
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/3h07bbwo.png",
            }}
            resizeMode={"stretch"}
            style={styles.image9}
          />
        </View>

        <Text style={styles.text8}>{product?.description}</Text>
        <Text style={styles.text8}>{product?.product_description}</Text> */}
        <Divider/>
<ProductDetailsSection product={product} />
        <View style={styles.view}>
          <TouchableOpacity
            style={styles.buttonRow}
            onPress={() => addCart(product)}
          >
            {/* <Image
              source={{
                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/pev9ywvi.png",
              }}
              resizeMode={"stretch"}
              style={styles.image10}
            /> */}
            <Icon name="cart-outline" size={20} color="#fff" style={styles.cartIcon} />
            <Text style={styles.text9}>{"Add to Cart"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    fontFamily: 'Outfit-Regular',
    color:'#000',
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EEEFEE",
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 13,
    marginRight: 15,
    fontFamily: 'Outfit-Regular',
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1EB1C5",
    borderRadius: 10,
    paddingVertical: 11,
    marginHorizontal: 32,
    fontFamily: 'Outfit-Regular',
  },
  column: {
    alignItems: "center",
    paddingBottom: 19,
    marginBottom: 32,
    fontFamily: 'Outfit-Regular',
    color:'#000',
  },
  image2: {
    width: 24,
    height: 24,
    marginTop: 7,
    marginRight: 68,
  },
  image3: {
    width: 40,
    height: 40,
    marginVertical: 8,
  },
  image4: {
    width: 43,
    height: 6,
  },
  image5: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  image6: {
    width: 12,
    height: 1,
    marginRight: 15,
  },
  image7: {
    width: 12,
    height: 12,
  },
  image8: {
    height: 1,
    marginBottom: 25,
    marginHorizontal: 31,
  },
  image9: {
    width: 24,
    height: 24,
  },
  image10: {
    width: 24,
    height: 24,
    marginRight: 9,
  },
  row2: {
    flexDirection: "row",
    marginBottom: 215,
    marginHorizontal: 30,
    fontFamily: 'Outfit-Regular',
    color:'#000',
  },
  row3: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginHorizontal: 32,
    fontFamily: 'Outfit-Regular',
    color:'#000',
  },
  row4: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4, // reduce this
    fontFamily: 'Outfit-Regular',
    color:'#000',
  },
  
  row5: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    fontFamily: 'Outfit-Regular',
    color:'#000',
  },
  
  
  row6: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    fontFamily: 'Outfit-Regular',
    marginHorizontal: 32,
    color:'#000',
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  text2: {
    color: "#000000",
    fontSize: 20,
    textAlign: "center",
    marginVertical: 10,
    marginLeft: 10,
    marginRight: 22,
    flex: 1,
    fontFamily: 'Outfit-Regular',
  },
  text3: {
    color: "#9CA7B7",
    fontSize: 14,
    flex: 1,
    fontFamily: 'Outfit-Regular',
  },
  text4: {
    color: "#9CA7B7",
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
  },
  text5: {
    flex: 1,
    fontSize: 18,
    //fontWeight: 'bold',
    marginRight: 10, // spacing from cart button
    fontFamily: 'Outfit-Regular',
    color:'#000',
  },  
  
  text6: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: 'Outfit-Regular',
  },
  text7: {
    color: "#000000",
    fontSize: 18,
    flex: 1,
    fontFamily: 'Outfit-Regular',
  },
  text8: {
    color: "#595E64",
    fontSize: 14,
    marginBottom: 163,
    marginLeft: 31,
    width: 310,
    fontFamily: 'Outfit-Regular',
  },
  text9: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
  },
  view: {
    backgroundColor: "#FFFFFF",
    fontFamily: 'Outfit-Regular',
    color:'#000',
    borderColor: "#DFF6FB",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 1,
    paddingVertical: 19,
    shadowColor: "#959DA533",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 8,
      height: 0,
    },
    shadowRadius: 24,
    elevation: 24,
  },
   gradeview: {
    marginTop:10,
  },
  cartbuttonRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginTop: 10,
  
    alignSelf: 'flex-start',     // This keeps it from expanding fully to the right
    marginRight: 0,              // Remove extra right margin
    marginLeft: 10,              // Add left margin to move left
    maxWidth: "85%",             // Reduce width a bit more
  },
  wishbuttonRow: {
  width: 40, // or whatever fits your design
  height: 40,
  borderRadius: 20,
  backgroundColor: '#fff',
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'flex-start', // prevents full-width stretch in flex containers
  padding: 0,
  margin: 4, // optional spacing
},
  
  cartIcon: {
    marginRight: 8,
    fontFamily: 'Outfit-Regular',
  },
  
  carttext9: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1EB1C5",
    flexShrink: 1, // Allow the text to shrink if necessary
  marginRight:10,
  fontFamily: 'Outfit-Regular',
  },
  
});
