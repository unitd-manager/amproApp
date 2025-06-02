// import React from "react";
// import { SafeAreaView, View, ScrollView, Image, TouchableOpacity, Text, StyleSheet, } from "react-native";
// export default (props) => {
// 	return (
// 		<SafeAreaView style={styles.container}>
// 			<ScrollView  style={styles.scrollView}>
// 				<View style={styles.column}>
// 					<Image
// 						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/2qi4jggz.png"}} 
// 						resizeMode = {"stretch"}
// 						style={styles.image}
// 					/>
// 					<View style={styles.column2}>
// 						<Image
// 							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/6pux22n7.png"}} 
// 							resizeMode = {"stretch"}
// 							style={styles.image2}
// 						/>
// 						<View style={styles.column3}>
// 							<View style={styles.column4}>
// 								<TouchableOpacity style={styles.button} onPress={()=>alert('Pressed!')}>
// 									<View style={styles.column5}>
// 										<Image
// 											source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/kdz3rei3.png"}} 
// 											resizeMode = {"stretch"}
// 											style={styles.image3}
// 										/>
// 										<Image
// 											source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/7mfpmpjb.png"}} 
// 											resizeMode = {"stretch"}
// 											style={styles.image4}
// 										/>
// 									</View>
// 								</TouchableOpacity>
// 								<Image
// 									source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/zm5x5opm.png"}} 
// 									resizeMode = {"stretch"}
// 									style={styles.absoluteImage}
// 								/>
// 							</View>
// 							<Text style={styles.text}>
// 								{"Password Update Successfully"}
// 							</Text>
// 							<Text style={styles.text2}>
// 								{"Your password has been update successfully"}
// 							</Text>
// 						</View>
// 					</View>
// 					<TouchableOpacity style={styles.button2} onPress={()=>alert('Pressed!')}>
// 						<Text style={styles.text3}>
// 							{"Sign Up"}
// 						</Text>
// 					</TouchableOpacity>
// 					<View style={styles.view}>
// 						<Text style={styles.text4}>
// 							{"Already have an account?  Login "}
// 						</Text>
// 					</View>
// 					<View style={styles.view2}>
// 						<Image
// 							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/pNd58t8xI9/uvvhy5x0.png"}} 
// 							resizeMode = {"stretch"}
// 							style={styles.image5}
// 						/>
// 					</View>
// 				</View>
// 			</ScrollView>
// 		</SafeAreaView>
// 	)
// }
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#FFFFFF",
// 	},
// 	absoluteImage: {
// 		position: "absolute",
// 		top: 39,
// 		right: -19,
// 		width: 38,
// 		height: 38,
// 	},
// 	button: {
// 		alignItems: "flex-start",
// 		borderColor: "#1EB1C5",
// 		borderRadius: 5,
// 		borderWidth: 4,
// 		padding: 5,
// 	},
// 	button2: {
// 		alignItems: "center",
// 		backgroundColor: "#1EB1C5",
// 		borderRadius: 10,
// 		paddingVertical: 17,
// 		marginBottom: 20,
// 		marginHorizontal: 30,
// 	},
// 	column: {
// 		height: 874,
// 		backgroundColor: "#0000004D",
// 		paddingTop: 59,
// 		paddingBottom: 16,
// 	},
// 	column2: {
// 		marginBottom: 46,
// 		marginHorizontal: 30,
// 	},
// 	column3: {
// 		alignItems: "center",
// 		backgroundColor: "#FFFFFF",
// 		borderRadius: 10,
// 		paddingTop: 87,
// 		paddingBottom: 48,
// 		paddingHorizontal: 47,
// 	},
// 	column4: {
// 		alignItems: "flex-start",
// 		marginBottom: 46,
// 	},
// 	column5: {
// 		alignItems: "center",
// 		backgroundColor: "#ECFBFF",
// 		borderRadius: 5,
// 		paddingVertical: 4,
// 		paddingHorizontal: 14,
// 	},
// 	image: {
// 		width: 24,
// 		height: 24,
// 		marginBottom: 3,
// 		marginLeft: 30,
// 	},
// 	image2: {
// 		height: 242,
// 		marginHorizontal: 50,
// 	},
// 	image3: {
// 		width: 34,
// 		height: 2,
// 		marginBottom: 112,
// 	},
// 	image4: {
// 		width: 6,
// 		height: 1,
// 	},
// 	image5: {
// 		width: 100,
// 		height: 1,
// 	},
// 	scrollView: {
// 		flex: 1,
// 		backgroundColor: "#FFFFFF",
// 	},
// 	text: {
// 		color: "#000000",
// 		fontSize: 30,
// 		fontWeight: "bold",
// 		textAlign: "center",
// 		marginBottom: 28,
// 	},
// 	text2: {
// 		color: "#9CA7B7",
// 		fontSize: 16,
// 		textAlign: "center",
// 		width: 222,
// 	},
// 	text3: {
// 		color: "#FFFFFF",
// 		fontSize: 18,
// 	},
// 	text4: {
// 		color: "#595D64",
// 		fontSize: 14,
// 	},
// 	view: {
// 		alignItems: "center",
// 		marginBottom: 60,
// 	},
// 	view2: {
// 		flex: 1,
// 		alignItems: "center",
// 	},
// });

import React, { useState } from 'react';
import { View, Button } from 'react-native';
import PasswordUpdateModal from '../components/PasswordUpdateModal';

const App = () => {
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <View>
      {/* <Button title="Update Password" onPress={() => setModalVisible(true)} /> */}
      <PasswordUpdateModal visible={modalVisible} onClose={() => {setModalVisible(false); Navigation.navigate('LoginPage')}} />
    
    </View>
  );
};

export default App;
