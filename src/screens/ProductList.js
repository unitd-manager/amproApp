import React, { useState, useEffect,useCallback, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from '../constants/api';
import imageBase from '../constants/imageBase';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, fetchCartItems } from '../redux/slices/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { addToWishlist, deleteWishlistItem, fetchWishlistItems } from '../redux/slices/wishlistSlice';
//import BackButton from '../components/BackButton';

const ProductListScreen = ({ route, navigation }) => {
  const { categoryId,categoryName } = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  
  const [subCategoryTypes, setSubCategoryTypes] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  
  const [selectedSubcategoryTypes, setSelectedSubcategoryTypes] = useState([]);

const { user, logout } = useContext(AuthContext);

const { wishitems, status } = useSelector((state) => state.wishlist);

  const filteredProducts = products.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery?.toLowerCase())
  );
   const [userData, setUser] = useState({});
  
    const dispatch = useDispatch();
  // const addToCart = (id) => {
  //   // Implement cart logic
  // };

  const updateQuantity = (id, delta) => {
    // Implement quantity update logic
  };
  const fetchSubcategories = async () => {
    try {
      const response = await api.post('/category/getSubCategoryByCategory', {
        category_id: categoryId,
      });
      setSubcategories(response.data.data || []);
    } catch (error) {
      console.error('Failed to load subcategories', error);
    }
  };

  const fetchSubcategoryTypes = async (subcategoryId) => {
    try {
      const response = await api.post('/category/getSubCategoryTypeBySubCategory', {
        sub_category_id: subcategoryId,
      });
      setSubCategoryTypes(response.data.data || []);
    } catch (error) {
      console.error('Failed to load subcategories', error);
    }
  };
  
  
  const addCart = (data) => {
 console.log('data',data);
    if(user){
      
    data.contact_id=user.contact_id
  
     dispatch(addToCart(data)) 
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
    
      const fetchSubcategoryTypeProducts = () => {
        //setLoading(true);
        console.log('subcategoeytypes',selectedSubcategoryTypes);
        api.post('/category/getProductBySubCategoryType', { sub_category_type_ids: selectedSubcategoryTypes })
          .then((res) => {
            res.data.data.forEach((element) => {
              element.tag = String(element.tag).split(",");
              element.images = String(element.images).split(",");
            });
            setProducts(res.data.data);
            setLoading(false)
            console.log('subcategoeytypespros',res.data.data);
          })
          .catch(() => console.log("error"))
          .finally(() => setLoading(false));
      };
    

    const fetchSubcategoryProducts = () => {
      console.log('subcategories',selectedSubcategories);
      setLoading(true);
      api.post('/category/getProductBySubcategory', { sub_category_ids: selectedSubcategories })
        .then((res) => {
          res.data.data.forEach((element) => {
            element.tag = String(element.tag).split(",");
            element.images = String(element.images).split(",");
          });
          setProducts(res.data.data);
          console.log('subcategoriespros',res.data.data);
        })
        .catch(() => console.log("error"))
        .finally(() => setLoading(false));
    };

  const fetchProducts = () => {
    setLoading(true);
    api
      .post("/category/getProductByCategory", { category_id: categoryId })
      .then((res) => {
        res.data.data.forEach((element) => {
          element.tag = String(element.tag).split(",");
          element.images = String(element.images).split(",");
        });
        setProducts(res.data.data);
      })
      .catch(() => console.log("error"))
      .finally(() => setLoading(false));
  };
useEffect(()=>{
  if(selectedSubcategoryTypes.length >0){
    fetchSubcategoryTypeProducts();
} else if(selectedSubcategories.length >0){
  fetchSubcategoryProducts();
  
}
 else{
  fetchProducts();
}
},[selectedSubcategories,selectedSubcategoryTypes])
  useEffect(() => {
    fetchProducts();
    fetchSubcategories();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate("ProductDetails", { productId: item.product_id })}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `${imageBase}${item.images[0]}` }}
            style={styles.image}
          />
          {item.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}% OFF</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("ProductDetails", { productId: item.product_id })}
      >
      <Text numberOfLines={1} style={styles.name}>
        {item.title}
      </Text>
</TouchableOpacity>
      {item.inCart ? (
        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
            <Text style={styles.qtyBtn}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyNumber}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
            <Text style={styles.qtyBtn}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (<>
        <TouchableOpacity
        // onPress={() => addWishlist(item)}
        onPress={() => {
          const existingWishItem = wishitems.find(it => it.product_id === item.product_id);
          if (existingWishItem) {
            deleteWishlist(existingWishItem)
          
        }
      else{
        addWishlist(item)
      }}}
        style={styles.addToCart}
      >
        <Text style={styles.addToCartText}> {wishitems.some(it => it.product_id === item.product_id)
      ? "Remove from Wishlist"
      : "Add to Wishlist"} </Text>
      </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>{ 
               if(item.grades){
                Alert.alert('Please select grade before adding to cart');
                navigation.navigate("ProductDetails", { productId: item.product_id })
               } else{
                addCart(item)}}
                } 
          style={styles.addToCart}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Category name and search icon */}
      <View style={styles.headerRow}>
        {/* <BackButton /> */}
        <View></View>
        <Text style={styles.headerText}>{categoryName}</Text>
        <TouchableOpacity onPress={() => setShowSearch(prev => !prev)}>
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Conditionally rendered search bar */}
      {showSearch && (
        <TextInput
          placeholder="Search products..."
          style={styles.searchBar}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      )}
<View style={{ marginTop: 10 }}>
{subcategories.length>0 && <Text style={styles.sectionTitle}>SubCategories</Text>}
  <FlatList
    horizontal
    showsHorizontalScrollIndicator={false}
    data={subcategories}
    keyExtractor={(item) => item.sub_category_id.toString()}
    contentContainerStyle={{ paddingHorizontal: 10 }}
    renderItem={({ item }) => {
      const isSelected = selectedSubcategories?.includes(item.sub_category_id);
      return (
        <TouchableOpacity
        onPress={() => {
          if (isSelected) {
            setSelectedSubcategories((prev) =>
              prev.filter((id) => id !== item.sub_category_id)
            );
            setSubCategoryTypes([]); // Clear subcategory types if deselected
            setSelectedSubcategoryTypes([]); // Clear selected subcategory types
          } else {
            setSelectedSubcategories([item.sub_category_id]); // Only allow selecting one subcategory at a time
            setSelectedSubcategoryTypes([]); // Clear selected subcategory types when selecting new subcategory
            fetchSubcategoryTypes(item.sub_category_id);
          }
        }}
        
          style={{
            backgroundColor: isSelected ? '#00AA88' : '#eee',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            marginRight: 10,
          }}
        >
          <Text style={{ color: isSelected ? '#fff' : '#000',fontFamily: 'Outfit-Regular' }}>
            {item.sub_category_title}
          </Text>
        </TouchableOpacity>
      );
    }}
  />
</View>

<View style={{ marginTop: 10 }}>
{subCategoryTypes.length>0 && <Text style={styles.sectionTitle}>Types</Text>}
  <FlatList
    horizontal
    showsHorizontalScrollIndicator={false}
    data={subCategoryTypes}
    keyExtractor={(item) => item.sub_category_type_id.toString()}
    contentContainerStyle={{ paddingHorizontal: 10 }}
    renderItem={({ item }) => {
      const isSelected = selectedSubcategoryTypes?.includes(item.sub_category_type_id);
      return (
        <TouchableOpacity
          onPress={() => {
            if (isSelected) {
              // Unselect
              setSelectedSubcategoryTypes((prev) =>
                prev.filter((id) => id !== item.sub_category_type_id)
              );
            } else {
              // Select
              setSelectedSubcategoryTypes((prev) => [
                ...prev,
                item.sub_category_type_id,
              ]);
            }
          }}
          style={{
            backgroundColor: isSelected ? '#00AA88' : '#eee',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            marginRight: 10,
          }}
        >
          <Text style={{ color: isSelected ? '#fff' : '#000',fontFamily: 'Outfit-Regular' }}>
            {item.type_title}
          </Text>
        </TouchableOpacity>
      );
    }}
  />
</View>

      {loading ? (
        <ActivityIndicator size="large" color="#00AA88" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.product_id}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 ,fontFamily: 'Outfit-Regular'}}>No products found</Text>
          }
        />
      )}
    </View>
  );
};

export default ProductListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    fontFamily: 'Outfit-Regular',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
    fontFamily: 'Outfit-Regular',
  },
  headerText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Regular',
  },
  searchBar: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    color:'#000',
    backgroundColor: '#f0f0f0',
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
  },
  list: {
    paddingHorizontal: 10,
    paddingTop: 10,
    fontFamily: 'Outfit-Regular',
  },
  card: {
    width: '48%',
    margin: '1%',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden', // makes rounded corners work properly
  },
  
  imageContainer: {
    width: '100%',
    backgroundColor: '#EAF9FF',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10
  },
  
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  
  name: {
    marginTop: 10,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    paddingHorizontal: 8,
  },
  
  addToCart: {
    borderWidth: 1,
    borderColor: '#00AA88',
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 6,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    fontFamily: 'Outfit-Regular',
  },  
  addToWishlist: {
    borderWidth: 1,
    borderColor: '#00AA88',
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 6,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    fontFamily: 'Outfit-Regular',
  },  
  addToWishlistText: {
    color: '#00AA88',
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#003366',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Regular',
  },

  addToCartText: {
    color: '#00AA88',
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 10,
  },
  qtyBtn: {
    fontSize: 18,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    color: '#00AA88',
    fontFamily: 'Outfit-Regular',
  },
  qtyNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Regular',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    marginBottom: 4,
    color: '#333',
    fontFamily: 'Outfit-Regular',
  },
  
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  
  chipText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
  },
  
});
