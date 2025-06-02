import React from "react";
import { SafeAreaView, View, ScrollView, Text, Image, StyleSheet, } from "react-native";
export default (props) => {
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView  style={styles.scrollView}>
				<View style={styles.column}>
					<Text style={styles.text}>
						{"Our Story"}
					</Text>
					<Text style={styles.text2}>
						{"Founded in 2020, Smart Wave has revolutionized the way people shop online. We believe in making quality products accessible to everyone while providing an exceptional shopping experience."}
					</Text>
				</View>
				<View style={styles.row}>
					<View style={styles.column2}>
						<Text style={styles.text3}>
							{"5M+"}
						</Text>
						<Text style={styles.text2}>
							{"Customers"}
						</Text>
					</View>
					<View style={styles.column3}>
						<Text style={styles.text3}>
							{"50K+"}
						</Text>
						<Text style={styles.text2}>
							{"Products"}
						</Text>
					</View>
					<View style={styles.column4}>
						<Text style={styles.text3}>
							{"100+"}
						</Text>
						<Text style={styles.text2}>
							{"Countries"}
						</Text>
					</View>
				</View>
				<View style={styles.column5}>
					<View style={styles.row2}>
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/sa973gko.png"}} 
							resizeMode = {"stretch"}
							style={styles.image}
						/>
						<Text style={styles.text4}>
							{"Our Mission"}
						</Text>
					</View>
					<Text style={styles.text2}>
						{"To provide innovative shopping solutions that make life easier for our customers while maintaining the highest standards of quality and service."}
					</Text>
				</View>
				<Text style={styles.text5}>
					{"Our Values"}
				</Text>
				<View style={styles.row3}>
					<Image
						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/2iki5nfv.png"}} 
						resizeMode = {"stretch"}
						style={styles.image2}
					/>
					<View >
						<Text style={styles.text6}>
							{"Quality First"}
						</Text>
						<Text style={styles.text7}>
							{"We never compromise on the quality of our products and services."}
						</Text>
					</View>
				</View>
				<View style={styles.row3}>
					<Image
						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/xzj46wzs.png"}} 
						resizeMode = {"stretch"}
						style={styles.image3}
					/>
					<View >
						<Text style={styles.text6}>
							{"Customer Centric"}
						</Text>
						<Text style={styles.text8}>
							{"Our customers are at the heart of everything we do."}
						</Text>
					</View>
				</View>
				<View style={styles.row4}>
					<Image
						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/x6ib7uki.png"}} 
						resizeMode = {"stretch"}
						style={styles.image4}
					/>
					<View >
						<Text style={styles.text6}>
							{"Sustainability"}
						</Text>
						<Text style={styles.text8}>
							{"Committed to environmental responsibility in our operations."}
						</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	column: {
		marginBottom: 42,
	},
	column2: {
		alignItems: "center",
		paddingVertical: 1,
		paddingHorizontal: 18,
		marginRight: 16,
	},
	column3: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 1,
		paddingHorizontal: 23,
		marginRight: 12,
	},
	column4: {
		alignItems: "center",
	},
	column5: {
		alignItems: "flex-start",
		marginBottom: 42,
	},
	image: {
		width: 48,
		height: 48,
		marginRight: 16,
	},
	image2: {
		width: 28,
		height: 40,
		marginRight: 16,
	},
	image3: {
		width: 35,
		height: 40,
		marginRight: 16,
	},
	image4: {
		width: 31,
		height: 40,
		marginRight: 16,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 42,
	},
	row2: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 15,
	},
	row3: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 26,
	},
	row4: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 25,
	},
	scrollView: {
		flex: 1,
	},
	text: {
		color: "#000000",
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 15,
	},
	text2: {
		color: "#4B5563",
		fontSize: 14,
	},
	text3: {
		color: "#1EB1C5",
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 3,
	},
	text4: {
		color: "#000000",
		fontSize: 18,
		fontWeight: "bold",
	},
	text5: {
		color: "#000000",
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 17,
	},
	text6: {
		color: "#000000",
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 2,
	},
	text7: {
		color: "#4B5563",
		fontSize: 14,
		width: 284,
	},
	text8: {
		color: "#4B5563",
		fontSize: 14,
		width: 264,
	},
});