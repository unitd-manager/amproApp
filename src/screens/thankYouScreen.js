import React, { useLayoutEffect } from "react"
import { StyleSheet, View, Text, ScrollView, Image } from "react-native"
import { CommonActions } from "@react-navigation/native"
import { connect } from "react-redux"
import RNRestart from "react-native-restart"
import CustomBtn from "../components/customBtn"
import { HEIGHT } from "../components/config"

const AddAddressScreen = ({ navigation, theme, reduxLang }) => {
  /////////////////// Header Settings
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false // Hide the header
    })
  }, [navigation])
  ///////////////////

  return (
    <ScrollView
      style={[
        styles.scrollView,
        { backgroundColor: theme.primaryBackgroundColor }
      ]}
      contentContainerStyle={styles.scrollViewContainerStyle}
      showsVerticalScrollIndicator={false}
    >
      <Image
        resizeMode={"contain"}
        style={[styles.drawerImageStyle]}
        source={require("../images/thankyou.png")}
      />

      <Text
        style={[
          styles.headingText,
          {
            color: theme.primary,
            fontSize: theme.appFontSize.largeSize + 5,
            fontFamily: theme.appFontSize.fontFamily
          }
        ]}
      >
        {reduxLang.ThankYou}
      </Text>

      <Text
        style={[
          styles.headingText,
          {
            color: theme.textColor,
            fontSize: theme.appFontSize.largeSize,
            fontFamily: theme.appFontSize.fontFamily,
            fontWeight: "normal"
          }
        ]}
      >
        {reduxLang.Yourorderwillbeshippedverysoon}
      </Text>

      {/* /////////////////////////////////////////////////// */}
      <View style={styles.marginBot} />
      <CustomBtn
        onPressFun={() => {
          RNRestart.Restart()
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: "Tabs" }]
            })
          )
        }}
        theme={theme}
        title={reduxLang.BackToHomePage}
      ></CustomBtn>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  drawerImageStyle: {
    backgroundColor: "transparent",
    height: HEIGHT * 0.3,
    width: "80%",
    margin: 20,
    alignSelf: "center",
    marginBottom: 40
  },
  marginBot: {
    marginBottom: 12
  },
  headingText: {
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignSelf: "center"
  },
  scrollView: {
    flex: 1,
    paddingTop: HEIGHT * 0.1
  },
  scrollViewContainerStyle: {
    paddingBottom: 5
  }
})

const mapStateToProps = state => ({
  theme: state.configReducer.theme,
  reduxLang: state.configReducer.lang
})

export default connect(mapStateToProps, null)(AddAddressScreen)
