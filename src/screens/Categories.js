import React,{useState,useEffect, useLayoutEffect} from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../constants/api';
import imagebaseurl from '../constants/imageBase';

const Categories = ({navigation}) => {
	const[categoryData,setCategoryData]=useState([]);
	const[categories,setCategories]=useState([]);
	const[subCategories,setSubCategories]=useState([]);
	const[subCategoryTypes,setSubCategoryTypes]=useState([]);

  //const imagebaseurl='https://amproadmin.unitdtechnologies.com/storage/uploads/';

	const formatCategoryData = (categories, subcategories) => {
    return categories.map(category => ({
      title: category.category_title,
      category_id: category.category_id, // ← include this!
      subcategories: subcategories
        .filter(sub => sub.category_id === category.category_id)
        .map(sub => ({
          name: sub.sub_category_title,
          images: sub.images && sub.images.length > 0 ? sub.images : ['placeholder.png'], // fallback
        })),
    }));
  };
  
  console.log('categoryData',categoryData);
	
	  useEffect(() => {
		const fetchData = async () => {
		  try {
			const [categoryRes, subCategoryRes] = await Promise.all([
			  api.get('/category/getAllCategory'),
			  api.get('/category/getAllSubCategory')
			]);
	  
			const categories = categoryRes.data.data;
      subCategoryRes.data.data.forEach((element) => {
        element.images = element.images
          ? String(element.images).split(',')
          : [];
      });
			const subCategories = subCategoryRes.data.data;
	  console.log('subCategories',subCategories);
			setCategories(categories);
			setSubCategories(subCategories);
	  
			const formatted = formatCategoryData(categories, subCategories);
			setCategoryData(formatted);
		  } catch (err) {
			console.error(err);
		  }
		};
	  
		fetchData();
	  }, []);
	   

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Categoes</Text>

      {categoryData?.map((category, index) => (
        <View key={index}>
         <View style={styles.categoryRow}>
  <TouchableOpacity
    onPress={() =>
      navigation.navigate('ProductList', {
        categoryId: category.category_id,
        categoryName: category.title,
      })
    }>
    <Text style={styles.categoryTitle}>{category.title}</Text>
  </TouchableOpacity>
  <View style={styles.flexDivider} />
</View>


          <View style={styles.subCategoryWrapper}>
            {category?.subcategories?.map((item, subIndex) => (
              <View key={subIndex} style={styles.subCategoryItem}>
            <Image
  source={{
    uri: item.images[0]
      ? `${imagebaseurl}${item.images[0]}`
      : `${imagebaseurl}placeholder.png`,
  }}
  style={styles.image}
  onError={() => {
    // Fallback to another base URL if first fails
    item.images[0] = 'http://amproadmin.unitdtechnologies.com/storage/uploads/' + item.images[0];
  }}
/>


                <Text style={styles.subCategoryText}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, textAlign: 'center', marginVertical: 20,fontFamily: 'Outfit-Regular' },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    textDecorationLine: 'underline',
    fontFamily: 'Outfit-Regular',
    color: '#007bff', // Makes it look more like a link
  },  
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
    width: '60%',
    alignSelf: 'flex-start',
  },
  subCategoryWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 20,
  },
  subCategoryItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 20,
    fontFamily: 'Outfit-Regular',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 6,
  },
  subCategoryText: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Outfit-Regular',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontFamily: 'Outfit-Regular',
  },
  
  flexDivider: {
    height: 1,
    backgroundColor: '#ccc',
    flex: 1,
    marginLeft: 10,
    marginTop: 4, // align with text baseline
  },
  
});

export default Categories;
