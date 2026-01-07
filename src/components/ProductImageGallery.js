import React, { useState, useRef } from "react";
import { View, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Swiper from 'react-native-swiper';
import ImageViewing from "react-native-image-viewing";
import imageBase from "../constants/imageBase";

const { width } = Dimensions.get("window");

const ProductImageGallery = ({ images = [] }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const swiperRef = useRef(null);

  const onThumbnailPress = (index) => {
    setSelectedImageIndex(index);
    swiperRef.current?.scrollBy(index - selectedImageIndex);
  };

  const onIndexChanged = (index) => {
    setSelectedImageIndex(index);
  };

  const renderPaginationDots = () => {
    if (images.length <= 1) return null;
    
    return (
      <View style={styles.paginationContainer}>
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              selectedImageIndex === index && styles.activePaginationDot,
            ]}
            onPress={() => onThumbnailPress(index)}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Main Image Container with Swipe */}
      <View style={styles.mainImageContainer}>
        <Swiper
          ref={swiperRef}
          style={styles.swiperContainer}
          showsPagination={false}
          loop={false}
          index={selectedImageIndex}
          onIndexChanged={onIndexChanged}
        >
          {images.map((image, index) => (
            <View key={index} style={styles.slideContainer}>
              <TouchableOpacity onPress={() => setIsViewerVisible(true)}>
                <Image
                  source={{ 
                    uri: image
                      ? imageBase + image
                      : "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/yp2hw732.png"
                  }}
                  style={styles.mainImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          ))}
        </Swiper>
        
        {/* Pagination Dots */}
        {renderPaginationDots()}
      </View>

      {/* Thumbnails */}
      {images.length > 1 && (
        <FlatList
          horizontal
          data={images}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => onThumbnailPress(index)}>
              <Image
                source={{
                  uri: item
                    ? imageBase + item
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
      )}

      {/* Fullscreen Viewer */}
      <ImageViewing
        images={images.map((img) => ({ uri: imageBase + img }))}
        imageIndex={selectedImageIndex}
        visible={isViewerVisible}
        onRequestClose={() => setIsViewerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainImageContainer: {
    position: "relative",
    height: 300,
  },
  swiperContainer: {
    height: 300,
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: width,
    height: 300,
    borderRadius: 8,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activePaginationDot: {
    backgroundColor: "#1EB1C5",
  },
  thumbnailList: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    justifyContent: "center",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedThumbnail: {
    borderColor: "#1EB1C5",
    borderWidth: 2,
  },
});

export default ProductImageGallery;
