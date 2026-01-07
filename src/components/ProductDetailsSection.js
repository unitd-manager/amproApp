import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';


const ProductDetailsSection = ({ product }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);
const textWithoutTags = (product?.product_description || '').replace(/<[^>]*>/g, '');
const desctextWithoutTags = (product?.description || '').replace(/<[^>]*>/g, '');

const decodeHtmlEntities = (text) => {
  const entities = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&lt;': '<',
    '&gt;': '>',
    '&apos;': "'",
    '&cent;': '¢',
    '&pound;': '£',
    '&yen;': '¥',
    '&euro;': '€',
    '&copy;': '©',
    '&reg;': '®',
  };

  return text.replace(/&[a-zA-Z#0-9]+;/g, (match) => entities[match] || match);
};


return (
    <View style={styles.container}>
      {/* Product Detail Section - Always Visible */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>Product Detail</Text>
      </View>
      <View style={styles.content}>
         <Text style={styles.text}>{decodeHtmlEntities(desctextWithoutTags)}</Text>

      </View>
 
      {/* Additional Difference Section */}
      <TouchableOpacity style={styles.row} onPress={() => setShowAdditional(!showAdditional)}>
        <Text style={styles.title}>Additional Information</Text>
        <Image
          source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/3h07bbwo.png" }}
          resizeMode="stretch"
          style={styles.icon}
        />
      </TouchableOpacity>
      {showAdditional && (
        <View style={styles.content}>
          {/* <Text style={styles.text}>{product?.product_description}</Text> */}
          <Text style={styles.text}>{decodeHtmlEntities(textWithoutTags)}</Text>

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0, // Remove top spacing
    fontFamily: 'Outfit-Regular',
  },
  titleRow: {
    paddingVertical: 0, // Remove top space from Product Detail Label
    marginBottom: 8,
    fontFamily: 'Outfit-Regular',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
     fontFamily: 'Outfit-Regular',
  },
  title: {
    fontSize: 18,
    // fontWeight: 'bold',
     fontFamily: 'Outfit-Regular',
  },
  icon: {
    width: 20,
    height: 20,
  },
  content: {
    paddingVertical: 8,
     fontFamily: 'Outfit-Regular',
  },
  text: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
     fontFamily: 'Outfit-Regular',
  },
});

export default ProductDetailsSection;
