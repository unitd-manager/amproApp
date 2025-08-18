import React, { useLayoutEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  ScrollView,
} from 'react-native-gesture-handler';
import { appColorsType } from '../redux/types/types';
import ScreenIndicator from '../components/screenIndicator';


type RootStackParamList = {
  Settings: undefined;
  AddAddress: { headerTitle: string };
};
interface IProps {
  navigation: StackNavigationProp<RootStackParamList>;
  theme: appColorsType;
  reduxLang: any;
  route: any;
}

const headingText = (theme: appColorsType, heading: string) => (

  <View style={[
    styles.headingView
    , {
      backgroundColor: theme.secondryBackgroundColor,
    }]}>
    <Text style={{
      fontSize: theme.appFontSize.largeSize,
      color: theme.textColor, fontFamily: theme.appFontSize.fontFamily,
      fontWeight: 'bold',
      textAlign: 'left'
    }}>{heading}</Text>
  </View>
)


const singleRowtext = (theme: appColorsType, key: string,
  value: string, bold: boolean) => (
  <View style={styles.singleRowView}>
    <Text style={{
      color: theme.textColor,
      fontSize: theme.appFontSize.mediumSize,
      fontFamily: theme.appFontSize.fontFamily,
      fontWeight: bold ? 'bold' : 'normal'
    }}>{key}</Text>
    <Text style={{
      color: theme.textColor,
      fontSize: theme.appFontSize.mediumSize,
      fontFamily: theme.appFontSize.fontFamily,
      fontWeight: bold ? 'bold' : 'normal'
    }}>{value}</Text>
  </View>
)
const bodyRowText = (theme: appColorsType, text: string) => (
  <View style={styles.bodyView}>
    <Text style={{
      fontSize: theme.appFontSize.mediumSize,
      color: theme.textColor, fontFamily: theme.appFontSize.fontFamily,
    }}>{text}</Text>
  </View>
)

const MyOrdersScreen = ({ navigation, theme, reduxLang, route }: IProps) => {

  const { orderNo } = route.params;

  // Header Settings
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: orderNo,
      headerStyle: {
        backgroundColor: theme.secondryBackgroundColor,
        shadowColor: 'transparent',
      },
      headerTintColor: theme.textColor,
    });
  }, [
    navigation,
    orderNo,
    theme.secondryBackgroundColor,
    theme.textColor,
  ]);

  const [] = React.useState(0);

  const [] = React.useState([true, false, false, false]);

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

        <View style={styles.deviderStyleView}>

          <ScreenIndicator theme={theme} text={'1'} label={reduxLang.OnHold}
            selectedValue={true} />
          <ScreenIndicator theme={theme} text={'2'} label={reduxLang.Processing}
            selectedValue={false} />
          <ScreenIndicator theme={theme} text={'3'} label={reduxLang.Completed}
            selectedValue={false} />

        </View>


        {headingText(theme, reduxLang.BillingAddress)}

        {bodyRowText(theme, reduxLang['2084 Forest Drive,Chantilly,Virginia,22021'])}


        {headingText(theme, reduxLang.ShippingAddress)}

        {bodyRowText(theme, reduxLang['4122  Jennifer Lane,Durham,North Carolina,27703'])}


        {headingText(theme, reduxLang.Products)}
        <View style={{
          width: '95%',
          alignSelf: 'center',
          borderBottomWidth: 1,
          borderBottomColor: theme.secondryBackgroundColor
        }}>


          {singleRowtext(theme, reduxLang.TShirt, '', false)}

          {singleRowtext(theme, reduxLang.Price, '20.00$', false)}

          {singleRowtext(theme, reduxLang.Quantity, '3', false)}

          {singleRowtext(theme, reduxLang.Total, '60.00$', true)}

        </View>


        <View style={{
          width: '95%',
          alignSelf: 'center',
          borderBottomWidth: 1,
          borderBottomColor: theme.secondryBackgroundColor
        }}>


          {singleRowtext(theme, reduxLang.Mobile, '', false)}

          {singleRowtext(theme, reduxLang.Price, '500.00$', false)}

          {singleRowtext(theme, reduxLang.Quantity, '9', false)}

          {singleRowtext(theme, reduxLang.Total, '960.00$', true)}

        </View>


        <View style={{
          width: '95%',
          alignSelf: 'center',
          backgroundColor: theme.secondryBackgroundColor,
          marginTop: '3%',
          marginBottom: '3%',
          padding: '3%'
        }}>


          {singleRowtext(theme, reduxLang.Subtotal, '$80.00', false)}

          {singleRowtext(theme, reduxLang.ShippingMethod, 'Free Shipping', false)}

          {singleRowtext(theme, reduxLang.Totaltax, '$0.00', false)}

          {singleRowtext(theme, reduxLang.Total, '160.00$', false)}

        </View>


        {headingText(theme, reduxLang.PaymentMethod)}

        {bodyRowText(theme, reduxLang.CashOnDelivery)}



        {headingText(theme, reduxLang.OrderNotes)}

        {bodyRowText(theme, reduxLang.DontHaveAnAccount)}


      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  headingView: {
    justifyContent: 'flex-start', width: '100%',
    padding: 10,
    margin: 1,
    marginLeft: 0,
    marginRight: 0,
  },
  scrollViewContainerStyle: {
    paddingBottom: 5,
    alignItems: 'center',
  },
  bodyView: {
    alignItems: 'flex-start',
    width: '100%',
    padding: 10,
    paddingTop: 8,
    paddingBottom: 8
  },
  singleRowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0.8%'
  },
  deviderStyleView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '10%',
    marginBottom: '10%',
    width: '100%',
    alignSelf: 'center'
  }
});

const mapStateToProps = (state: any) => ({
  theme: state.configReducer.theme,
  reduxLang: state.configReducer.lang,
});

export default connect(mapStateToProps, null)(MyOrdersScreen);
