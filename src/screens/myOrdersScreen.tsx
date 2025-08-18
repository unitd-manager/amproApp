import React, { useLayoutEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  FlatList,
  ScrollView,
} from 'react-native-gesture-handler';
import { appColorsType } from '../redux/types/types';
type RootStackParamList = {
  Settings: undefined;
  OrderDetails: { orderNo: string };
};
interface IProps {
  navigation: StackNavigationProp<RootStackParamList>;
  theme: appColorsType;
  reduxLang: any;
}


const singleRow = (theme: appColorsType,
  key: string, value: string,) => (

  <View style={styles.labelRow}>
    <Text
      numberOfLines={1}
      style={[styles.textStyle, {
        color: theme.textColor,
        fontSize: theme.appFontSize.mediumSize - 1,
        fontFamily: theme.appFontSize.fontFamily,
      }]}>
      {key}
    </Text>
    <Text
      numberOfLines={1}
      style={[styles.textStyle, {
        color: theme.textColor,
        fontSize: theme.appFontSize.mediumSize - 1,
        fontFamily: theme.appFontSize.fontFamily,
        fontWeight: 'bold'
      }]}>
      {value}
    </Text>
  </View>
);

const card = (theme: appColorsType,
  navigation: StackNavigationProp<RootStackParamList>,
  reduxLang: any, id: string, date: string, status: string,
  paymentMethod: string, total: string) => (
  <TouchableOpacity
    onPress={() =>
      navigation.navigate('OrderDetails', {
        orderNo: id
      })
    }
    style={[
      styles.bodyTextStyle,
      {
        backgroundColor: theme.secondryBackgroundColor,
        shadowColor: theme.secondryTextColor,
      },
    ]}>

    {singleRow(theme, reduxLang.Id, id)}
    {singleRow(theme, reduxLang.OrderDate, date)}
    {singleRow(theme, reduxLang.Status, status)}
    {singleRow(theme, reduxLang.PaymentMethod, paymentMethod)}
    {singleRow(theme, reduxLang.Total, total)}

  </TouchableOpacity>
);


const MyOrdersScreen = ({ navigation, theme, reduxLang }: IProps) => {
  // Header Settings
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: reduxLang.MyOrders,
      headerStyle: {
        backgroundColor: theme.secondryBackgroundColor,
        shadowColor: 'transparent',
      },
      headerTintColor: theme.textColor,
    });
  }, [
    navigation,
    reduxLang.MyOrders,
    theme.secondryBackgroundColor,
    theme.textColor,
  ]);

  const [screen, onChangeScreen] = React.useState(0);

  const [selected] = React.useState([true, false, false, false]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.primaryBackgroundColor },
      ]}>
      <View style={styles.container}>

        <View>

          <FlatList
            data={[
              {
                tittle: reduxLang.OnHold,
              },
              {
                tittle: reduxLang.Processing,
              },
              {
                tittle: reduxLang.Completed,
              },
            ]}
            horizontal={true}
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'space-around',
              alignItems: 'flex-start'
            }}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(item) => (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    selected.forEach(
                      (item, index) => (selected[index] = false),
                    );
                    selected[item.index] = true;
                    onChangeScreen(item.index)
                  }}
                  style={{
                    borderBottomWidth: selected[item.index]
                      ? 2
                      : 0,
                    borderColor: theme.primary,
                  }}>
                  <View
                    style={styles.titleView}
                  >
                    <Text
                      style={{
                        fontSize: theme.appFontSize.mediumSize + 1,
                        color: selected[item.index]
                          ? theme.primary
                          : 'gray',
                        fontFamily: theme.appFontSize.fontFamily,
                        fontWeight: 'bold'
                      }}>
                      {item.item.tittle}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />

        </View>
        {screen === 0 ? (

          // Screen 1
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContainerStyle}
            showsVerticalScrollIndicator={false}>

            <View style={styles.screenContainer}>

              {card(theme, navigation, reduxLang, '#123',
                '17/01/2021', 'On Hold', 'Cash on Delivery',
                '$80.00')}

              {card(theme, navigation, reduxLang, '#136',
                '17/05/2021', 'On Hold', 'Paypal',
                '$190.00')}

            </View>
          </ScrollView>
        ) : screen === 1 ? (

          // Screen 2

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContainerStyle}
            showsVerticalScrollIndicator={false}>
            <View style={styles.screenContainer}>

              {card(theme, navigation, reduxLang, '#123',
                '17/01/2021', 'In Progress', 'Cash on Delivery',
                '$80.00')}

              {card(theme, navigation, reduxLang, '#136',
                '17/05/2021', 'In Progress', 'Paypal',
                '$190.00')}

              {card(theme, navigation, reduxLang, '#123',
                '17/01/2021', 'In Progress', 'RazorPay',
                '$80.00')}

              {card(theme, navigation, reduxLang, '#136',
                '17/05/2021', 'In Progress', 'Paypal',
                '$190.00')}

              {card(theme, navigation, reduxLang, '#123',
                '17/01/2021', 'In Progress', 'Cash on Delivery',
                '$80.00')}

              {card(theme, navigation, reduxLang, '#136',
                '17/05/2021', 'In Progress', 'RazorPay',
                '$190.00')}

              {card(theme, navigation, reduxLang, '#123',
                '17/01/2021', 'In Progress', 'Cash on Delivery',
                '$80.00')}

              {card(theme, navigation, reduxLang, '#136',
                '17/05/2021', 'In Progress', 'Paypal',
                '$190.00')}

            </View>
          </ScrollView>
        ) : (

          // screen 3

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContainerStyle}
            showsVerticalScrollIndicator={false}>

            <View style={styles.screenContainer}>

              {card(theme, navigation, reduxLang, '#123',
                '17/01/2021', 'Completed', 'Cash on Delivery',
                '$80.00')}

              {card(theme, navigation, reduxLang, '#136',
                '17/05/2021', 'Completed', 'Paypal',
                '$190.00')}
            </View>
          </ScrollView>
        )}

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 5
  },
  screenContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    textAlign: 'left',
    padding: 5,
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
  titleView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    paddingTop: 10,
    paddingBottom: 4,
    margin: 10,
    marginTop: 5,
    borderRadius: 24,
  },
  scrollViewContainerStyle: {
    paddingBottom: 5,
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

const mapStateToProps = (state: any) => ({
  theme: state.configReducer.theme,
  reduxLang: state.configReducer.lang
});

export default connect(mapStateToProps, null)(MyOrdersScreen);
