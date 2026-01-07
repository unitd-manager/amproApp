import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import LogoSlider from '../components/LogoSlider';
import funFactData from "../data/fun-fact/fun-fact-one.json";

const AboutUsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Heading */}
      <Text style={styles.pageTitle}>Who Are We</Text>
      <Text style={styles.subTitle}>Welcome To Ampro</Text>

      {/* Images */}
      <Image source={require('../assets/images/banner/vision.jpg')} style={styles.image} />
      <Image source={require('../assets/images/banner/mission.jpg')} style={styles.image} />
      <Image source={require('../assets/images/banner/goal.jpg')} style={styles.image} />
	 

      {/* Our Vision */}
      <Text style={styles.sectionTitle}>Our Vision</Text>
      <Text style={styles.text}>
        To be a trusted one-stop destination for quality furniture, groceries...
      </Text>

      {/* Our Mission */}
      <Text style={styles.sectionTitle}>Our Mission</Text>
      <Text style={styles.text}>
        To provide high-quality furniture, groceries, and toys...
      </Text>

      {/* Our Goal */}
      <Text style={styles.sectionTitle}>Our Goal</Text>
      <Text style={styles.text}>
        To become a leading retailer of furniture, groceries...
      </Text>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {funFactData?.map((item, idx) => (
          <View key={idx} style={styles.statItem}>
            <Text style={styles.statValue}>{item.countNum}</Text>
            <Text style={{fontFamily: 'Outfit-Regular'}}>{item.title}</Text>
          </View>
        ))}
      </View>
<LogoSlider/>
      {/* Footer Placeholder */}
      <Text style={styles.footer}>© 2025 Ampro — All Rights Reserved</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff',fontFamily: 'Outfit-Regular', },
  pageTitle: { textAlign: 'center',  fontSize: 16,fontFamily: 'Outfit-Regular', },
  subTitle: { textAlign: 'center', fontSize: 18, marginVertical: 10,fontFamily: 'Outfit-Regular', },
  image: { width: '100%', height: 200, resizeMode: 'cover', marginBottom: 10 },
  sectionTitle: {  fontSize: 16, marginTop: 20,fontFamily: 'Outfit-Regular', },
  text: { fontSize: 14, color: '#555', marginVertical: 5,fontFamily: 'Outfit-Regular', },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
    fontFamily: 'Outfit-Regular',
  },
  statItem: { width: '45%', marginVertical: 10, alignItems: 'center',fontFamily: 'Outfit-Regular', },
  statValue: { fontSize: 20,  color: '#00bcd4',fontFamily: 'Outfit-Regular', },
  footer: { textAlign: 'center', fontSize: 12, color: '#888', marginTop: 40,fontFamily: 'Outfit-Regular', },
});

export default AboutUsScreen;
