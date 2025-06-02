import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import imageBase from '../constants/imageBase';

const { width } = Dimensions.get('window');
const AUTO_PLAY_INTERVAL = 3000;

const BannerCarousel = ({ sliderData }) => {
  const flatListRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safe scroll function
  const safeScrollToIndex = (index) => {
    if (index < sliderData.length) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    if (!sliderData || sliderData.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % sliderData.length;
      safeScrollToIndex(nextIndex);
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [currentIndex, sliderData]);

  const onScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const goToSlide = (index) => {
    safeScrollToIndex(index);
  };

  if (!sliderData || sliderData.length === 0) return null;

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={sliderData}
        keyExtractor={(item) => item.file_name.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        renderItem={({ item }) => (
          <Image
            source={{uri: `${imageBase}${item.file_name}`}}
            style={styles.image}
          />
        )}
      />

      <View style={styles.dotsContainer}>
        {sliderData.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : null,
            ]}
            onPress={() => goToSlide(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: width * 0.92,
    height: 180,
    resizeMode: 'cover',
    borderRadius: 12,
    marginHorizontal: width * 0.04, // centers the banner
  },
  
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#1EB1C5',
    width: 10,
    height: 10,
  },
});

export default BannerCarousel;
