import React, {useState} from "react";
import { SafeAreaView, View, ScrollView, Text, Image, TouchableOpacity, TextInput, StyleSheet, } from "react-native";
export default (props) => {
	const [textInput1, onChangeTextInput1] = useState('');
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView  style={styles.scrollView}>
				<View style={styles.row}>
					<Text style={styles.text}>
						{"9:41"}
					</Text>
					<Image
						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/r257n5yz.png"}} 
						resizeMode = {"stretch"}
						style={styles.image}
					/>
				</View>
				<View style={styles.row2}>
					<Image
						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/761yh2ad.png"}} 
						resizeMode = {"stretch"}
						style={styles.image2}
					/>
					<Text style={styles.text2}>
						{"Shipping Details"}
					</Text>
					<Text style={styles.text3}>
						{"Share"}
					</Text>
				</View>
				<View style={styles.view}>
					<View style={styles.column}>
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/1gmzwtwh.png"}} 
							resizeMode = {"stretch"}
							style={styles.image3}
						/>
						<Text style={styles.text4}>
							{"Welcome to"}
						</Text>
						<Text style={styles.text5}>
							{"Esther Howard"}
						</Text>
					</View>
				</View>
				<View style={styles.column2}>
					<View style={styles.row3}>
						<Text style={styles.text6}>
							{"Tracking Ref"}
						</Text>
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/7fh1vzg1.png"}} 
							resizeMode = {"stretch"}
							style={styles.image4}
						/>
						<Text style={styles.text5}>
							{"#TRK89201"}
						</Text>
					</View>
					<View style={styles.row3}>
						<Text style={styles.text7}>
							{"In Progress"}
						</Text>
						<TouchableOpacity style={styles.button} onPress={()=>alert('Pressed!')}>
							<Text style={styles.text8}>
								{"Active"}
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.view2}>
						<View style={styles.box}>
						</View>
					</View>
				</View>
				<View style={styles.column3}>
					<View style={styles.view3}>
						<Text style={styles.text9}>
							{"Shipping Information"}
						</Text>
					</View>
					<View >
						<View style={styles.row4}>
							<Text style={styles.text10}>
								{"Shipment ID"}
							</Text>
							<Text style={styles.text11}>
								{"SHP92830"}
							</Text>
						</View>
						<View style={styles.row4}>
							<Text style={styles.text10}>
								{"Carrier Name"}
							</Text>
							<Text style={styles.text11}>
								{"FedEx Express"}
							</Text>
						</View>
						<View style={styles.row4}>
							<Text style={styles.text10}>
								{"Shipment Date"}
							</Text>
							<Text style={styles.text11}>
								{"Jan 15, 2025"}
							</Text>
						</View>
						<View style={styles.row5}>
							<Text style={styles.text10}>
								{"Delivery Date"}
							</Text>
							<Text style={styles.text11}>
								{"Jan 18, 2025"}
							</Text>
						</View>
					</View>
				</View>
				<View style={styles.column4}>
					<View style={styles.view3}>
						<Text style={styles.text12}>
							{"Package Details"}
						</Text>
					</View>
					<View >
						<View style={styles.row4}>
							<Text style={styles.text10}>
								{"Package Type"}
							</Text>
							<Text style={styles.text11}>
								{"Standard Box"}
							</Text>
						</View>
						<View style={styles.row4}>
							<Text style={styles.text10}>
								{"Weight"}
							</Text>
							<Text style={styles.text11}>
								{"2.5 kg"}
							</Text>
						</View>
						<View style={styles.row5}>
							<Text style={styles.text10}>
								{"Dimensions"}
							</Text>
							<Text style={styles.text11}>
								{"30 × 25 × 15 cm"}
							</Text>
						</View>
					</View>
				</View>
				<View style={styles.column5}>
					<View style={styles.view4}>
						<Text style={styles.text13}>
							{"Documents"}
						</Text>
					</View>
					<TouchableOpacity style={styles.buttonRow} onPress={()=>alert('Pressed!')}>
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/utnnvdyb.png"}} 
							resizeMode = {"stretch"}
							style={styles.image5}
						/>
						<Text style={styles.text14}>
							{"Shipping Label"}
						</Text>
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/hnfsgdj8.png"}} 
							resizeMode = {"stretch"}
							style={styles.image6}
						/>
					</TouchableOpacity>
				</View>
				<View style={styles.view5}>
					<Text style={styles.text15}>
						{"Need Help?"}
					</Text>
				</View>
				<View style={styles.row6}>
					<Image
						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/2bsjj33y.png"}} 
						resizeMode = {"stretch"}
						style={styles.image7}
					/>
					<TextInput
						placeholder={"Contact Support"}
						value={textInput1}
						onChangeText={onChangeTextInput1}
						style={styles.input}
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
	box: {
		width: 244,
		height: 8,
		backgroundColor: "#1EB1C5",
		borderRadius: 9999,
		marginRight: 78,
	},
	button: {
		backgroundColor: "#DCFCE7",
		borderRadius: 9999,
		paddingVertical: 5,
		paddingHorizontal: 12,
	},
	buttonRow: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F9FAFB",
		borderRadius: 8,
		paddingVertical: 13,
		paddingHorizontal: 12,
		marginBottom: 56,
		marginHorizontal: 7,
	},
	column: {
		alignItems: "center",
		paddingHorizontal: 32,
	},
	column2: {
		backgroundColor: "#FFFFFF",
		borderColor: "#9CA7B7",
		borderRadius: 12,
		borderWidth: 1,
		paddingVertical: 20,
		marginBottom: 20,
		marginHorizontal: 30,
		shadowColor: "#0000000D",
		shadowOpacity: 0.1,
		shadowOffset: {
		    width: 0,
		    height: 1
		},
		shadowRadius: 2,
		elevation: 2,
	},
	column3: {
		paddingTop: 10,
		paddingBottom: 28,
		marginBottom: 20,
		marginHorizontal: 30,
	},
	column4: {
		paddingTop: 10,
		paddingBottom: 27,
		marginBottom: 20,
		marginHorizontal: 30,
	},
	column5: {
		paddingVertical: 10,
		marginBottom: 42,
		marginHorizontal: 31,
	},
	image: {
		width: 143,
		height: 54,
	},
	image2: {
		width: 24,
		height: 24,
		marginRight: 63,
	},
	image3: {
		width: 50,
		height: 50,
		marginBottom: 9,
	},
	image4: {
		width: 20,
		height: 16,
		marginRight: 142,
	},
	image5: {
		width: 16,
		height: 16,
		marginRight: 12,
	},
	image6: {
		borderRadius: 8,
		width: 16,
		height: 16,
	},
	image7: {
		borderRadius: 10,
		width: 16,
		height: 16,
		marginRight: 8,
	},
	input: {
		color: "#FFFFFF",
		fontSize: 16,
		flex: 1,
		paddingVertical: 1,
	},
	row: {
		flexDirection: "row",
		marginBottom: 8,
	},
	row2: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 30,
		marginHorizontal: 30,
	},
	row3: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
		marginHorizontal: 10,
	},
	row4: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 2,
		marginBottom: 16,
	},
	row5: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 2,
	},
	row6: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#1EB1C5",
		borderRadius: 10,
		paddingVertical: 12,
		paddingHorizontal: 88,
		marginBottom: 32,
		marginHorizontal: 31,
	},
	scrollView: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	text: {
		color: "#000000",
		fontSize: 17,
		fontWeight: "bold",
		marginVertical: 18,
		marginLeft: 31,
		marginRight: 12,
	},
	text2: {
		color: "#000000",
		fontSize: 20,
		textAlign: "center",
		marginVertical: 10,
		marginLeft: 10,
		marginRight: 22,
		flex: 1,
	},
	text3: {
		color: "#1EB1C5",
		fontSize: 14,
	},
	text4: {
		color: "#000000",
		fontSize: 12,
		marginBottom: 5,
	},
	text5: {
		color: "#000000",
		fontSize: 14,
	},
	text6: {
		color: "#6B7280",
		fontSize: 14,
		flex: 1,
	},
	text7: {
		color: "#000000",
		fontSize: 16,
		fontWeight: "bold",
		flex: 1,
	},
	text8: {
		color: "#15803D",
		fontSize: 14,
	},
	text9: {
		color: "#000000",
		fontSize: 18,
		marginRight: 151,
	},
	text10: {
		color: "#6B7280",
		fontSize: 16,
		marginRight: 4,
		flex: 1,
	},
	text11: {
		color: "#000000",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "right",
		flex: 1,
	},
	text12: {
		color: "#000000",
		fontSize: 18,
		marginRight: 201,
	},
	text13: {
		color: "#000000",
		fontSize: 18,
		marginRight: 226,
	},
	text14: {
		color: "#000000",
		fontSize: 14,
		flex: 1,
	},
	text15: {
		color: "#000000",
		fontSize: 16,
		marginRight: 236,
	},
	view: {
		alignItems: "center",
		marginBottom: 30,
	},
	view2: {
		alignItems: "flex-end",
		backgroundColor: "#E5E7EB",
		borderRadius: 9999,
		marginHorizontal: 10,
	},
	view3: {
		alignItems: "flex-end",
		paddingVertical: 3,
		marginBottom: 16,
	},
	view4: {
		alignItems: "flex-end",
		paddingVertical: 2,
		marginBottom: 12,
		marginHorizontal: 10,
	},
	view5: {
		alignItems: "flex-end",
		paddingVertical: 2,
		marginBottom: 11,
		marginHorizontal: 38,
	},
});