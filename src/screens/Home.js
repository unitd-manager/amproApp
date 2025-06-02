import React,{useEffect,useState,useCallback, useContext} from 'react';
import { View, Text, ScrollView, Image, FlatList, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import BannerCarousel from '../components/BannerCarousel';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import api from '../constants/api';
import imageBase from '../constants/imageBase';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, fetchCartItems } from '../redux/slices/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { addToWishlist, deleteWishlistItem, fetchWishlistItems } from '../redux/slices/wishlistSlice';


const { width } = Dimensions.get('window');


const Home = () => {
  const navigation = useNavigation();

  const { user, logout } = useContext(AuthContext);

  const [sliderData, setSliderData] = useState([]);
const[categories,setCategories]=useState([]);
  const [offerProducts, setOfferProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [mostPopularProducts, setMostPopularProducts] = useState([]);
  const [userData, setUserData] = useState({});

const { wishitems, status } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();



  const getNewProducts = () => {
    api
      .get("/product/getNewProducts")
      .then((res) => {
        res.data.data.forEach((element) => {
          element.images = String(element.images).split(",");
        });
        setNewProducts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getOfferProducts = () => {
    api
      .get("/product/getTopOfferProducts")
      .then((res) => {
        res.data.data.forEach((element) => {
          element.images = String(element.images).split(",");
        });
        setOfferProducts(res.data.data);
      })
      .catch(() => {
        console.log("error");
      });
  };



  const getBestSellingProducts = () => {
    api
      .get("/product/getBestSellingProducts")
      .then((res) => {
        res.data.data.forEach((element) => {
          element.images = String(element.images).split(",");
        });
        setBestSellingProducts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const getMostPopularProducts = () => {
    api
      .get("/product/getMostPopularProducts")
      .then((res) => {
        res.data.data.forEach((element) => {
          element.images = String(element.images).split(",");
        });
        setMostPopularProducts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBanner = () => {
    api
      .get('/content/getBanners')
      .then(res => {
        // Assuming res.data.data is an array
        const banners = res.data.data;
  
        // Use forEach to iterate through the array of banners
        banners.forEach((banner, index) => {
          console.log(`Banner ${index + 1}:`, banner);  // Logs each banner's data
        });
  
        // Now set the state with the fetched data
        setSliderData(banners);
  
        // Logging the entire response data for debugging
        console.log("sliderData", res.data);
      })
      .catch(error => {
        console.log("error", error);
      });
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
  const addCart = (data) => {
 console.log('user in home',user);
    if(user && user?.contact_id){
      const updatedItem = { ...data, contact_id: user?.contact_id}; 

    // data.contact_id=user?.contact_id
  
     dispatch(addToCart(updatedItem)) 
             .then(() => { Alert.alert("Item added to cart")
               dispatch(fetchCartItems(user));
             })
             .catch((error) => {
               console.error('Failed to add to cart:', error);
             });
  
    }
    else{
      Alert.alert("Please Login")
     
    }
   
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
        setUserData(res.data.data[0]);
      } else {
        
      }
    } catch (e) {
      console.error('Error fetching user:', e);
      
    }
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchUser = async () => {
  //       const userData = await AsyncStorage.getItem('user');
  //       if (userData) {
  //         setUserData(JSON.parse(userData)); // update context or redux here
  //       } else {
  //         setUserData(null);
  //       }
  //     };
  
  //     fetchUser();
  //   }, [])
  // );

  useEffect(() => {
    getUserData();
  }, []);


  useEffect(() => {

    getBanner();
	getOfferProducts();
  getBestSellingProducts();
  getMostPopularProducts();
  getNewProducts();
	api
	.get("/category/getAllCategory")
	.then((res) => {
    res.data.data.forEach((element) => {
      element.images = String(element.images).split(",");
    });
    console.log("categories", res.data.data);
	  setCategories(res.data.data);
	})
	.catch(() => {
	  console.log("error");
	});
    // getDataFromApi()
  }, []);

  const renderBanner = ({ item }) => (
    <Image source={{ uri: item.image }} style={styles.banner} resizeMode="cover" />
  );

  return (
    <ScrollView style={styles.container}>
	
      {/* Banner Carousel */}
	<BannerCarousel sliderData={sliderData}/>

      {/* Category */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Category</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          horizontal
          keyExtractor={(item) => item.category_title}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            
            <View style={styles.categoryItem}>
               <TouchableOpacity onPress={() => navigation.navigate('ProductList',{categoryId: item.category_id,categoryName:item.category_title})}>
              <Image source={{ uri:  `${imageBase}${item.images[0]}`}} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>{item.category_title}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* Flash Sale */}
      {offerProducts.length >0 &&<View style={styles.section}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Flash Sale</Text>
    <TouchableOpacity>
      <Text style={styles.seeAll}></Text>
    </TouchableOpacity>
  </View>

  <FlatList
    data={offerProducts}
    keyExtractor={(item) => item.title}
    numColumns={2}
    contentContainerStyle={styles.verticalList}
    columnWrapperStyle={styles.row}
    showsVerticalScrollIndicator={false}
    renderItem={({ item }) => (
      <View style={styles.flashItem}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProductDetails", { productId: item.product_id })}
        >
  <View style={styles.imageContainer}>
    {/* <View style={styles.discountTag}>
      <Text style={styles.discountText}>{item.discount} OFF</Text>
    </View> */}
    <Image
      source={{ uri: `${imageBase}${item.images[0]}` }}
      style={styles.flashImage}
    />
  </View>
  </TouchableOpacity>

  <View style={styles.detailsContainer}>
    <TouchableOpacity
          onPress={() => navigation.navigate("ProductDetails", { productId: item.product_id })}
        >
    <Text style={styles.flashName} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.addToCartButton}  onPress={() => {
          const existingWishItem = wishitems.find(it => it.product_id === item.product_id);
          if (existingWishItem) {
            deleteWishlist(existingWishItem)
          
        }
      else{
        addWishlist(item)
      }}}>
      <Text style={styles.addToCartText} >{wishitems.some(it => it.product_id === item.product_id)
      ? "Remove from Wishlist"
      : "Add to Wishlist"}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.addToCartButton}  onPress={() =>{ 
     if(item.grades){
      Alert.alert('Please select grade before adding to cart');
      navigation.navigate("ProductDetails", { productId: item.product_id })
     }else{
      addCart(item)}}
      }>
      <Text style={styles.addToCartText}>Add to Cart</Text>
    </TouchableOpacity>
  </View>
</View>

    )}
    
  />
</View>}

{/* New Products */}
{newProducts.length > 0 && <View style={styles.section}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>New Products</Text>
    <TouchableOpacity >
      <Text style={styles.seeAll}></Text>
    </TouchableOpacity>
  </View>

  <FlatList
    data={newProducts}
    keyExtractor={(item) => item.title}
    numColumns={2}
    contentContainerStyle={styles.verticalList}
    columnWrapperStyle={styles.row}
    showsVerticalScrollIndicator={false}
    renderItem={({ item }) => (
      <View style={styles.flashItem}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProductDetails", { productId: item.product_id })}
        >
  <View style={styles.imageContainer}>
    {/* <View style={styles.discountTag}>
      <Text style={styles.discountText}>{item.discount} OFF</Text>
    </View> */}
    <Image
      source={{ uri: `${imageBase}${item.images[0]}` }}
      style={styles.flashImage}
    />
  </View>
  </TouchableOpacity>

  <View style={styles.detailsContainer}>
    <TouchableOpacity
          onPress={() => navigation.navigate("ProductDetails", { productId: item.product_id })}
        >
    <Text style={styles.flashName} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.addToCartButton}   onPress={() => {
          const existingWishItem = wishitems.find(it => it.product_id === item.product_id);
          if (existingWishItem) {
            deleteWishlist(existingWishItem)
          
        }
      else{
        addWishlist(item)
      }}}>
      <Text style={styles.addToCartText}>{wishitems.some(it => it.product_id === item.product_id)
      ? "Remove from Wishlist"
      : "Add to Wishlist"}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.addToCartButton}  onPress={() =>{ 
     if(item.grades){
      Alert.alert('Please select grade before adding to cart');
      navigation.navigate("ProductDetails", { productId: item.product_id })
     }else{
      addCart(item)}}
      }>
      <Text style={styles.addToCartText}>Add to Cart</Text>
    </TouchableOpacity>
  </View>
</View>

    )}
    
  />
</View>}

  {/* Most Popular Products */}
  {mostPopularProducts.length > 0 && <View style={styles.section}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Most Popular Products</Text>
    <TouchableOpacity>
      <Text style={styles.seeAll}></Text>
    </TouchableOpacity>
  </View>

  <FlatList
    data={mostPopularProducts}
    keyExtractor={(item) => item.title}
    numColumns={2}
    contentContainerStyle={styles.verticalList}
    columnWrapperStyle={styles.row}
    showsVerticalScrollIndicator={false}
    renderItem={({ item }) => (
      <View style={styles.flashItem}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProductDetails", { productId: item.product_id })}
        >
  <View style={styles.imageContainer}>
    {/* <View style={styles.discountTag}>
      <Text style={styles.discountText}>{item.discount} OFF</Text>
    </View> */}
    <Image
      source={{ uri: `${imageBase}${item.images[0]}` }}
      style={styles.flashImage}
    />
  </View>
  </TouchableOpacity>

  <View style={styles.detailsContainer}>
    <TouchableOpacity
          onPress={() => navigation.navigate("ProductDetails", { productId: item.product_id })}
        >
    <Text style={styles.flashName} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.addToCartButton}   onPress={() => {
          const existingWishItem = wishitems.find(it => it.product_id === item.product_id);
          if (existingWishItem) {
            deleteWishlist(existingWishItem)
          
        }
      else{
        addWishlist(item)
      }}}>
      <Text style={styles.addToCartText}>{wishitems.some(it => it.product_id === item.product_id)
      ? "Remove from Wishlist"
      : "Add to Wishlist"}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.addToCartButton}  onPress={() =>{ 
     if(item.grades){
      Alert.alert('Please select grade before adding to cart');
      navigation.navigate("ProductDetails", { productId: item.product_id })
     } else{
      addCart(item)}}
      }>
      <Text style={styles.addToCartText}>Add to Cart</Text>
    </TouchableOpacity>
  </View>
</View>

    )}
    
  />
</View>}

  {/* Best Selling Products */}
  {bestSellingProducts.length >0 && <View style={styles.section}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Best Selling Products</Text>
    <TouchableOpacity>
      <Text style={styles.seeAll}></Text>
    </TouchableOpacity>
  </View>

  <FlatList
    data={bestSellingProducts}
    keyExtractor={(item) => item.title}
    numColumns={2}
    contentContainerStyle={styles.verticalList}
    columnWrapperStyle={styles.row}
    showsVerticalScrollIndicator={false}
    renderItem={({ item }) => (
      <View style={styles.flashItem}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProductDetails", { productId: item.product_id })}
        >
  <View style={styles.imageContainer}>
    {/* <View style={styles.discountTag}>
      <Text style={styles.discountText}>{item.discount} OFF</Text>
    </View> */}
    <Image
      source={{ uri: `${imageBase}${item.images[0]}` }}
      style={styles.flashImage}
    />
  </View>
  </TouchableOpacity>

  <View style={styles.detailsContainer}>
    <TouchableOpacity
          onPress={() => navigation.navigate("ProductDetails", { productId: item.product_id })}
        >
    <Text style={styles.flashName} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.addToCartButton}   onPress={() => {
          const existingWishItem = wishitems.find(it => it.product_id === item.product_id);
          if (existingWishItem) {
            deleteWishlist(existingWishItem)
          
        }
      else{
        addWishlist(item)
      }}}>
      <Text style={styles.addToCartText}>{wishitems.some(it => it.product_id === item.product_id)
      ? "Remove from Wishlist"
      : "Add to Wishlist"}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.addToCartButton} onPress={() =>{ 
     if(item.grades){
      Alert.alert('Please select grade before adding to cart');
      navigation.navigate("ProductDetails", { productId: item.product_id })
     } else{
      addCart(item)}}
      }>
      <Text style={styles.addToCartText}>Add to Cart</Text>
    </TouchableOpacity>
  </View>
</View>

    )}
    
  />
</View>}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,paddingTop: 20,  backgroundColor: '#fff' },
  banner: { width: '100%', height: 150, borderRadius: 10 },
  section: {
    paddingHorizontal: 15,
    marginBottom: 20,
    fontFamily: 'Outfit-Regular',
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    fontFamily: 'Outfit-Regular',
  },
  
  sectionTitle: {
    fontSize: 18,
    //fontWeight: 'bold',
    fontFamily: 'Outfit-Regular',
  },
  
  seeAll: {
    color: '#1E90FF',
    fontWeight: '600',
    fontFamily: 'Outfit-Regular',
  },
  
  verticalList: {
    fontFamily: 'Outfit-Regular',
    paddingBottom: 50,
  },
  
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  
  seeAll: { color: '#1EB1C5',fontFamily: 'Outfit-Regular' },
  horizontalList: { paddingLeft: 10 ,fontFamily: 'Outfit-Regular',},
  categoryItem: { alignItems: 'center', marginRight: 20 },
  categoryIcon: {
    width: 60,
    height: 60,
    marginBottom: 5,
    backgroundColor: '#E6F8FA',
    borderRadius: 15,
  },
  categoryText: { fontSize: 12, fontFamily: 'Outfit-Regular', },

rowBottom: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontFamily: 'Outfit-Regular',
},

flashItem: {
  width: '48%',
  backgroundColor: '#fff',
  borderRadius: 10,
  overflow: 'hidden',
  marginBottom: 15,
},


imageContainer: {
  backgroundColor: '#E9F8FF', // light blue
  padding: 10,
  position: 'relative',
  alignItems: 'center',
  borderBottomLeftRadius:10,
  borderBottomRightRadius:10
},

flashImage: {
  width: '100%',
  height: 100,
  resizeMode: 'contain',
},

discountTag: {
  position: 'absolute',
  top: 8,
  left: 8,
  backgroundColor: '#0047AB',
  borderRadius: 4,
  paddingHorizontal: 6,
  paddingVertical: 3,
  zIndex: 1,
},

discountText: {
  color: '#fff',
  fontSize: 10,
  fontWeight: 'bold',
  fontFamily: 'Outfit-Regular',
},

detailsContainer: {
  backgroundColor: '#fff',
  padding: 10,
},

flashName: {
  fontSize: 14,
  fontWeight: '500',
  color: '#333',
  marginBottom: 10,
  fontFamily: 'Outfit-Regular',
},

addToCartButton: {
  backgroundColor: '#fff',
  borderColor: '#00BFFF',
  borderWidth: 1,
  borderRadius: 6,
  paddingVertical: 6,
  marginTop:8,
  alignItems: 'center',
},

addToCartText: {
  color: '#00BFFF',
  fontSize: 13,
  fontWeight: '600',
  fontFamily: 'Outfit-Regular',
},

  
});

export default Home;
