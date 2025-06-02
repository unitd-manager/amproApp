import React, { useState } from "react";
import { View, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import ImageViewing from "react-native-image-viewing";
import imageBase from "../constants/imageBase";

const { width } = Dimensions.get("window");

const ProductImageGallery = ({ images = [] }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isViewerVisible, setIsViewerVisible] = useState(false);

  const onThumbnailPress = (index) => setSelectedImageIndex(index);

  return (
    <View>
      {/* Main Image */}
      <TouchableOpacity onPress={() => setIsViewerVisible(true)}>
        <Image
          source={{ 
            uri: images?.[selectedImageIndex]
              ? imageBase +images[selectedImageIndex]
              : "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/yp2hw732.png"
          
           }}
          style={styles.mainImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Thumbnails */}
      <FlatList
        horizontal
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => onThumbnailPress(index)}>
            <Image
              source={{
                 uri: item
              ? imageBase +item
              : "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/yp2hw732.png"
          
               }}
              style={[
                styles.thumbnail,
                selectedImageIndex === index && styles.selectedThumbnail,
              ]}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.thumbnailList}
        showsHorizontalScrollIndicator={false}
      />

      {/* Fullscreen Viewer */}
      <ImageViewing
        images={images.map((img) => ({ uri: img }))}
        imageIndex={selectedImageIndex}
        visible={isViewerVisible}
        onRequestClose={() => setIsViewerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainImage: {
    width: width,
    height: 300,
    borderRadius: 8,
  },
  thumbnailList: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedThumbnail: {
    borderColor: "#007bff",
  },
});

export default ProductImageGallery;
