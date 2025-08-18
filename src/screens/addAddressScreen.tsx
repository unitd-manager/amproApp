import React, { useLayoutEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  I18nManager,
  Modal,
  Platform,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/FontAwesome';
import * as globalLocation from '../components/locationData';
import CustomBtn from '../components/customBtn';
import { appColorsType } from '../redux/types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { HEADER_IOS_HEIGHT, HEADER_ANDROID_HEIGHT } from '../components/config';

import { TouchableOpacity } from 'react-native-gesture-handler';
type RootStackParamList = {
};
export interface IProps {
  navigation: StackNavigationProp<RootStackParamList>;
  theme: appColorsType;
  reduxLang: any;
  route: any;
}
const labelViewFun = (
  theme: appColorsType,
  text: string,
  selectedValue: string,
  showModal: () => void,
  headerText: string,
  setmodalHeader: (arg0: string) => void,
  setmodalData: (arg0: any) => void,
  modalData: any
) => (
  <TouchableOpacity
    onPress={() => {
      setmodalData(modalData)
      setmodalHeader(headerText)
      showModal()
    }}
    style={[
      styles.textInput,
      {
        backgroundColor: theme.secondryBackgroundColor,
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
    ]}>

    <Text style={[
      styles.textStyle,
      {
        color: theme.textColor,
        fontSize: theme.appFontSize.mediumSize,
        fontFamily: theme.appFontSize.fontFamily
      },
    ]}>{text}</Text>

    <View style={styles.commonViewTextIconStyle}>
      <Text numberOfLines={1} style={[styles.selectedText,
      {
        color: theme.textColor, width: '50%', textAlign: 'right',
        fontSize: theme.appFontSize.mediumSize,
        fontFamily: theme.appFontSize.fontFamily
      }]}>
        {selectedValue}
      </Text>
      <Ionicons
        style={[
          {
            color: theme.secondry,
            fontSize: theme.appFontSize.smallSize + 1,
          },
        ]}
        name={!I18nManager.isRTL ? 'chevron-right' : 'chevron-left'}
      />
    </View>
  </TouchableOpacity>
);

const AddAddressScreen = ({ navigation, theme, reduxLang, route }: IProps) => {
  /////////////////// Header Settings
  const { headerTitle } = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: headerTitle,
      headerStyle: {
        backgroundColor: theme.secondryBackgroundColor,
        shadowColor: 'transparent',
      },
      headerTintColor: theme.textColor,
    });
  }, [navigation, headerTitle, theme.secondryBackgroundColor, theme.textColor]);
  ///////////////////

  ///////////////////
  const [firstName, onChangefirstName] = React.useState('');
  const [lastName, onChangeLastName] = React.useState('');
  const [email, onChangeEmail] = React.useState('');
  const [phone, onChangePhone] = React.useState('');
  const [city, onChangeCity] = React.useState('');
  const [pincode, onChangePincode] = React.useState('');
  const [address, onChangeAddress] = React.useState('');
  let firstNameTextInput: any = '';
  let lastNameTextInput: any = '';
  let addressTextInput: any = '';
  let cityTextInput: any = '';
  let emailTextInput: any = '';
  let pincodeTextInput: any = '';
  ////////////////

  // states and country data
  const [country, setCountryName] = React.useState(globalLocation.data.countries[12].name);
  const [statesName, setStateName] = React.useState(globalLocation.data.states.AU[1].name);

  const [countriesArray] = useState(
    globalLocation.data.countries
  );
  const [StatesArray] = useState(
    globalLocation.data.states
  );


  //Modal
  const [modalData, setmodalData] = React.useState(globalLocation.data.countries);
  const [modalHeader, setmodalHeader] = React.useState('');
  const [isModalVisible, setModalVisibles] = useState(false);
  const showModal = () => setModalVisibles(true);
  const hideModal = () => setModalVisibles(false);


  function selectedText(value: string) {
    if (modalHeader === reduxLang.Select + ' ' + reduxLang.State) {
      setStateName(value)
    } else {
      setCountryName(value)
    }
    hideModal();
  }


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
        <KeyboardAvoidingView
          keyboardVerticalOffset={5}
          behavior={'position'}
          style={styles.container}>

          <Modal visible={isModalVisible}  >
            <View
              style={[
                styles.modalView,
                {
                  backgroundColor: theme.primaryBackgroundColor,
                },
              ]}>
              <View style={{
                height: Platform.OS === 'ios' ? '9%' : '7%',
                backgroundColor: theme.secondryBackgroundColor,
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexDirection: 'row',
                paddingTop: Platform.OS === 'ios' ? '8%' : '0%'
              }}>
                <TouchableOpacity
                  style={{ overflow: 'visible' }}
                  onPress={() => {
                    hideModal()
                  }}
                >
                  <IoniconsIcon
                    onPress={() => {
                      hideModal()
                    }}
                    name={'close-outline'}

                    //light
                    style={{
                      fontSize: theme.appFontSize.largeSize + 7,
                      paddingLeft: I18nManager.isRTL ? '5%' : '7%',
                      paddingRight: I18nManager.isRTL ? '5%' : '23%'
                    }}
                    color={theme.textColor}
                  />
                </TouchableOpacity>
                <Text style={[styles.modalText, {
                  color: theme.textColor,
                  marginBottom: 0,
                  fontSize: theme.appFontSize.largeSize,
                  fontFamily: theme.appFontSize.fontFamily
                }]}>
                  {modalHeader}
                </Text>
              </View>
              <FlatList
                data={modalData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={item => (
                  <TouchableOpacity
                    key={item.item.value}
                    onPress={() => selectedText(item.item.name)}
                    style={[
                      styles.picketTouchAbleStyle,
                      {
                        backgroundColor: theme.primaryBackgroundColor,
                      }
                    ]}>
                    <Text
                      onPress={() => selectedText(item.item.name)}
                      style={[
                        styles.pickerTextStyle,
                        {
                          color: theme.textColor,
                          width: '100%',
                          fontSize: theme.appFontSize.mediumSize,
                          fontFamily: theme.appFontSize.fontFamily,
                        },
                      ]}>
                      {item.item.name}
                    </Text>
                  </TouchableOpacity>
                )}>
              </FlatList>
            </View>

          </Modal>

          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.secondryBackgroundColor,
                color: theme.textColor,
                fontSize: theme.appFontSize.mediumSize,
                fontFamily: theme.appFontSize.fontFamily
              },
            ]}
            onChangeText={(text) => onChangefirstName(text)}
            placeholder={reduxLang.FirstName}
            placeholderTextColor={'gray'}
            value={firstName}
            onSubmitEditing={() => {
              firstNameTextInput.focus();
            }}
            blurOnSubmit={false}
          />

          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.secondryBackgroundColor,
                color: theme.textColor,
                fontSize: theme.appFontSize.mediumSize,
                fontFamily: theme.appFontSize.fontFamily
              },
            ]}
            onChangeText={(text) => onChangeLastName(text)}
            placeholder={reduxLang.LastName}
            placeholderTextColor={'gray'}
            value={lastName}
            ref={(input) => {
              firstNameTextInput = input;
            }}
            onSubmitEditing={() => {
              lastNameTextInput.focus();
            }}
            blurOnSubmit={false}
          />
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.secondryBackgroundColor,
                color: theme.textColor,
                fontSize: theme.appFontSize.mediumSize,
                fontFamily: theme.appFontSize.fontFamily
              },
            ]}
            onChangeText={(text) => onChangeAddress(text)}
            placeholder={reduxLang.Address}
            placeholderTextColor={'gray'}
            value={address}
            ref={(input) => {
              lastNameTextInput = input;
            }}
            onSubmitEditing={() => {
              addressTextInput.focus();
            }}
          />
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.secondryBackgroundColor,
                color: theme.textColor,
                fontSize: theme.appFontSize.mediumSize,
                fontFamily: theme.appFontSize.fontFamily
              },
            ]}
            onChangeText={(text) => onChangeCity(text)}
            placeholder={reduxLang.City}
            placeholderTextColor={'gray'}
            value={city}
            ref={(input) => {
              addressTextInput = input;
            }}
            onSubmitEditing={() => {
              cityTextInput.focus();
            }}
          />

          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.secondryBackgroundColor,
                color: theme.textColor,
                fontSize: theme.appFontSize.mediumSize,
                fontFamily: theme.appFontSize.fontFamily
              },
            ]}
            onChangeText={(text) => onChangePincode(text)}
            placeholder={reduxLang.Pincode}
            placeholderTextColor={'gray'}
            value={pincode}
            ref={(input) => {
              cityTextInput = input;
            }}
            onSubmitEditing={() => {
              pincodeTextInput.focus();
            }}
            blurOnSubmit={false}
          />

          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.secondryBackgroundColor,
                color: theme.textColor,
                fontSize: theme.appFontSize.mediumSize,
                fontFamily: theme.appFontSize.fontFamily
              },
            ]}
            onChangeText={(text) => onChangeEmail(text)}
            placeholder={reduxLang.Email}
            placeholderTextColor={'gray'}
            keyboardType={'email-address'}
            value={email}
            ref={(input) => {
              pincodeTextInput = input;
            }}
            onSubmitEditing={() => {
              emailTextInput.focus();
            }}
            blurOnSubmit={false}
          />

          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.secondryBackgroundColor,
                color: theme.textColor,
                fontSize: theme.appFontSize.mediumSize,
                fontFamily: theme.appFontSize.fontFamily
              },
            ]}
            onChangeText={(text) => onChangePhone(text)}
            placeholder={reduxLang.PhoneNumber}
            placeholderTextColor={'gray'}
            keyboardType={'number-pad'}
            value={phone}
            ref={(input) => {
              emailTextInput = input;
            }}
          />


          {/* /////////////////////////////////////////////////// */}



          {labelViewFun(
            theme,
            reduxLang.Select + " " + reduxLang.Country,
            country,
            showModal,
            reduxLang.Select + ' ' + reduxLang.Country,
            setmodalHeader,
            setmodalData,
            countriesArray,
          )}

          {labelViewFun(
            theme,
            reduxLang.Select + " " + reduxLang.State,
            statesName,
            showModal,
            reduxLang.Select + ' ' + reduxLang.State,
            setmodalHeader,
            setmodalData,
            StatesArray.AR
          )}

          {/* /////////////////////////////////////////////////// */}
          <View style={styles.marginBot} />
          <CustomBtn onPressFun={() => { }} theme={theme} title={reduxLang.Save}></CustomBtn>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginBot: {
    marginBottom: 8
  },
  textInput: {
    height: Platform.OS === 'ios' ? HEADER_IOS_HEIGHT * 0.47 :
      HEADER_ANDROID_HEIGHT * 0.74,
    borderColor: 'gray',
    width: '93%',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 8,
    marginBottom: 6,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    alignSelf: 'center',
  },
  textStyle: {
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    alignSelf: 'center',
  },
  scrollView: {
    flex: 1,
    paddingTop: 8,
  },
  scrollViewContainerStyle: {
    paddingBottom: 5,
  },
  commonViewTextIconStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '60%',
  },
  selectedText: { marginRight: 5, marginLeft: 5, alignItems: 'center' },
  modalView: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '700',
  },
  picketTouchAbleStyle: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 10,
    paddingLeft: I18nManager.isRTL ? 80 : 0,
    paddingRight: I18nManager.isRTL ? 0 : 80,
  },
  pickerTextStyle: {
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

const mapStateToProps = (state: any) => ({
  theme: state.configReducer.theme,
  reduxLang: state.configReducer.lang
});


export default connect(mapStateToProps, null)(AddAddressScreen);
