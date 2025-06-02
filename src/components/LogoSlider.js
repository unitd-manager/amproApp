import React from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

const logos = [
  require('../assets/images/brand-logo/brand-logo-1.png'), 
  //require('../assets/imges/brand-logo/brand-logo-2.png'),
  //require('../assets/imges/brand-logo/brand-logo-3.png'),
  require('../assets/images/brand-logo/brand-logo-4.png'),
  //require('../assets/imges/brand-logo/brand-logo-5.png'),
  //require('../assets/imges/brand-logo/brand-logo-9.png'), // BaliResort

];

const LogoSlider = () => {
  return (
    <View style={styles.sliderContainer}>
      <Swiper
        showsPagination={true}
        autoplay={true}
        autoplayTimeout={3}
        showsButtons={false}
        dotColor="#ccc"
        activeDotColor="#000"
      >
        {logos?.map((logo, index) => (
          <View key={index} style={styles.slide}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    height: 100,
    width: '100%',
    marginVertical: 20,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5,
    height: 80,
  },
});

export default LogoSlider;
