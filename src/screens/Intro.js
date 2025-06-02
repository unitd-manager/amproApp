import React from "react";
import { SafeAreaView, View, ImageBackground, ScrollView, StyleSheet, } from "react-native";
export default (props) => {
	return (
		<SafeAreaView style={styles.container}>
			<ImageBackground 
				source={{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/na3f24ms.png"}} 
				resizeMode = {'stretch'}
				style={styles.view}
				>
				<ScrollView  style={styles.scrollView}>
				</ScrollView>
			</ImageBackground>
		</SafeAreaView>
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	scrollView: {
		flex: 1,
	},
	view: {
		flex: 1,
	},
});