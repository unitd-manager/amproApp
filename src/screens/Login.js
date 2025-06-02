import React from "react";
import { SafeAreaView, View, ScrollView, Text, Image, TouchableOpacity, StyleSheet, } from "react-native";
export default (props) => {
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView  style={styles.scrollView}>
				<View style={styles.row}>
					<Text style={styles.text}>
						{"9:41"}
					</Text>
					<Image
						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/k9jjwrj7.png"}} 
						resizeMode = {"stretch"}
						style={styles.image}
					/>
				</View>
				<Image
					source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/grso2jue.png"}} 
					resizeMode = {"stretch"}
					style={styles.image2}
				/>
				<View style={styles.view}>
					<Image
						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/uxnnbz22.png"}} 
						resizeMode = {"stretch"}
						style={styles.image3}
					/>
				</View>
				<View style={styles.column}>
					<Text style={styles.text2}>
						{"Please Sign In"}
					</Text>
					<Text style={styles.text3}>
						{"Enter your Dipstore  account details for a personalised experience"}
					</Text>
				</View>
				<View style={styles.column2}>
					<Text style={styles.text4}>
						{"Email"}
					</Text>
					<TouchableOpacity style={styles.buttonRow} onPress={()=>alert('Pressed!')}>
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/vaf8uvi2.png"}} 
							resizeMode = {"stretch"}
							style={styles.image4}
						/>
						<Text style={styles.text5}>
							{"smartwave@gmail.com"}
						</Text>
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/66n4tj2x.png"}} 
							resizeMode = {"stretch"}
							style={styles.image5}
						/>
					</TouchableOpacity>
					<Text style={styles.text4}>
						{"Password"}
					</Text>
					<View style={styles.row2}>
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/y073juap.png"}} 
							resizeMode = {"stretch"}
							style={styles.image6}
						/>
						<Text style={styles.text6}>
							{"......|"}
						</Text>
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/czbwwaeh.png"}} 
							resizeMode = {"stretch"}
							style={styles.image7}
						/>
					</View>
					<View style={styles.view2}>
						<Text style={styles.text7}>
							{"Forgot Password?"}
						</Text>
					</View>
					<TouchableOpacity style={styles.button} onPress={()=>alert('Pressed!')}>
						<Text style={styles.text8}>
							{"Sign In"}
						</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.view3}>
					<Text style={styles.text9}>
						{"First time here Sign Up"}
					</Text>
				</View>
				<View style={styles.view4}>
					<Image
						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/5zqjo0rm.png"}} 
						resizeMode = {"stretch"}
						style={styles.image8}
					/>
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
	button: {
		alignItems: "center",
		backgroundColor: "#1EB1C5",
		borderRadius: 10,
		paddingVertical: 17,
		marginHorizontal: 1,
	},
	buttonRow: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderColor: "#EEEFEE",
		borderRadius: 8,
		borderWidth: 1,
		paddingVertical: 16,
		paddingHorizontal: 12,
		marginBottom: 20,
	},
	column: {
		marginBottom: 55,
		marginHorizontal: 34,
	},
	column2: {
		marginBottom: 20,
		marginHorizontal: 30,
	},
	image: {
		width: 143,
		height: 54,
	},
	image2: {
		width: 24,
		height: 24,
		marginBottom: 14,
		marginLeft: 30,
	},
	image3: {
		width: 232,
		height: 232,
	},
	image4: {
		width: 16,
		height: 16,
		marginRight: 10,
	},
	image5: {
		width: 16,
		height: 16,
	},
	image6: {
		width: 16,
		height: 16,
		marginTop: 14,
		marginRight: 10,
	},
	image7: {
		width: 16,
		height: 16,
		marginTop: 14,
	},
	image8: {
		width: 100,
		height: 1,
	},
	row: {
		flexDirection: "row",
		marginBottom: 14,
	},
	row2: {
		flexDirection: "row",
		backgroundColor: "#FFFFFF",
		borderColor: "#1EB1C5",
		borderRadius: 8,
		borderWidth: 1,
		paddingTop: 3,
		paddingBottom: 17,
		paddingHorizontal: 12,
		marginBottom: 9,
	},
	scrollView: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	text: {
		color: "#373737",
		fontSize: 17,
		fontWeight: "bold",
		marginVertical: 18,
		marginLeft: 47,
		marginRight: 59,
	},
	text2: {
		color: "#000000",
		fontSize: 30,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 15,
	},
	text3: {
		color: "#9CA7B7",
		fontSize: 16,
		textAlign: "center",
	},
	text4: {
		color: "#595D64",
		fontSize: 16,
		marginBottom: 5,
		marginLeft: 12,
	},
	text5: {
		color: "#595E64",
		fontSize: 14,
		textAlign: "center",
		flex: 1,
	},
	text6: {
		color: "#595E64",
		marginRight: 99,
	},
	text7: {
		color: "#1EB1C5",
		fontSize: 14,
	},
	text8: {
		color: "#FFFFFF",
		fontSize: 18,
	},
	text9: {
		color: "#595D64",
		fontSize: 14,
	},
	view: {
		alignItems: "center",
		marginBottom: 36,
	},
	view2: {
		alignItems: "flex-end",
		marginBottom: 40,
	},
	view3: {
		alignItems: "center",
		marginBottom: 22,
	},
	view4: {
		height: 1,
		alignItems: "center",
		marginBottom: 16,
	},
});