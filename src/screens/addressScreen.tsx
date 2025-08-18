import React, { useLayoutEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/FontAwesome';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { appColorsType } from '../redux/types/types';
type RootStackParamList = {
  Settings: undefined;
  AddAddress: { headerTitle: string };
};
interface IProps {
  navigation: StackNavigationProp<RootStackParamList>;
  theme: appColorsType;
  reduxLang: any;
}

const card = (theme: appColorsType, navigation: any, reduxLang: any) => (
  <TouchableOpacity
    onPress={() =>
      navigation.navigate('AddAddress', {
        headerTitle: reduxLang.EditAddress,
      })
    }
    style={[
      styles.bodyTextStyle,
      {
        backgroundColor: theme.secondryBackgroundColor,
        shadowColor: theme.secondryTextColor,
      },
    ]}>
    <Text
      numberOfLines={1}
      style={[styles.textStyle, {
        color: theme.textColor,
        fontSize: theme.appFontSize.mediumSize,
        fontFamily: theme.appFontSize.fontFamily,
      }]}>
      {reduxLang['Dr. Mark White']+ ' ' }
    </Text>
    <Text
      numberOfLines={1}
      style={[styles.textStyle, {
        color: theme.textColor,
        fontSize: theme.appFontSize.mediumSize,
        fontFamily: theme.appFontSize.fontFamily,
      }]}>
      {reduxLang['3874 Cedarstone Drive, Mansfield OH']}
    </Text>
    <Text
      numberOfLines={1}
      style={[styles.textStyle, {
        color: theme.textColor,
        fontSize: theme.appFontSize.mediumSize,
        fontFamily: theme.appFontSize.fontFamily,
      }]}>
      922323
    </Text>
    <Text
      numberOfLines={1}
      style={[styles.textStyle, {
        color: theme.textColor,
        fontSize: theme.appFontSize.mediumSize,
        fontFamily: theme.appFontSize.fontFamily,
      }]}>
      kzee42ct2f@temporary-mail.net
    </Text>
    <Text
      numberOfLines={1}
      style={[styles.textStyle, {
        color: theme.textColor,
        fontSize: theme.appFontSize.mediumSize,
        fontFamily: theme.appFontSize.fontFamily,
      }]}>
      419-512-2854
    </Text>
  </TouchableOpacity>
);

const App = ({ navigation, theme, reduxLang }: IProps) => {
  // Header Settings
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: reduxLang.Address,
      headerStyle: {
        backgroundColor: theme.secondryBackgroundColor,
        shadowColor: 'transparent',
      },
      headerTintColor: theme.textColor,
    });
  }, [
    navigation,
    reduxLang.Address,
    theme.secondryBackgroundColor,
    theme.textColor,
  ]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.primaryBackgroundColor },
      ]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainerStyle}
        showsVerticalScrollIndicator={false}>
        {/* card */}

        {card(theme, navigation, reduxLang)}
        {card(theme, navigation, reduxLang)}
        {/* btn */}
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('AddAddress', {
              headerTitle: reduxLang.AddAddress,
            })
          }
          style={[
            styles.addAddressBtn,
            {
              backgroundColor: theme.primaryBackgroundColor,
              borderColor: theme.secondryTextColor,
            },
          ]}>

          <Ionicons
            style={
              {
                color: theme.textColor,
                fontSize: theme.appFontSize.largeSize,
                padding: '1.3%'
              }}
            name={'plus'}
          />
          <Text
            style={[
              styles.btnText,
              {
                fontSize: theme.appFontSize.largeSize,
                fontFamily: theme.appFontSize.fontFamily,
                color: theme.textColor,
              },
            ]}>
            {reduxLang.AddAddress}
          </Text>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textStyle: {
    textAlign: 'left',
    padding: 2,
  },
  bodyTextStyle: {
    width: '94%',
    padding: 10,
    borderRadius: 12,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    elevation: 2,
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContainerStyle: {
    paddingBottom: 5,
    alignItems: 'center',
  },
  addAddressBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
    borderStyle: 'dotted',
    borderWidth: 1,
  },
  btnText: {
    fontWeight: '500',
    padding: '1%'
  },
});

const mapStateToProps = (state: any) => ({
  theme: state.configReducer.theme,
  reduxLang: state.configReducer.lang
});


export default connect(mapStateToProps, null)(App);
