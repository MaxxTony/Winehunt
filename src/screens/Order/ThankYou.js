import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Fonts} from '../../constant/Styles';
import WineHuntButton from '../../common/WineHuntButton';
import {useNavigation} from '@react-navigation/native';

const ThankYou = props => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const info = props?.route?.params?.info;
  console.log(info);

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.content}>
        {/* Success Image */}
        <Image
          source={require('./images/tick2.png')}
          style={styles.successIcon}
        />

        {/* Thank You Text */}
        <Text style={styles.thankYouText} allowFontScaling={false}>
          Thank you for your order
        </Text>
        <Text style={styles.subText} allowFontScaling={false}>
          Your order has been successfully placed
        </Text>

        {/* Order Details Card */}
        <View style={styles.orderCard}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Image
                source={require('./images/order.png')}
                style={styles.orderIcon}
              />
              <Text style={styles.orderTitle} allowFontScaling={false}>
                Order Details
              </Text>
            </View>
            <Text style={styles.orderId} allowFontScaling={false}>
              Order ID: {info?.payment_intent_id}
            </Text>
          </View>

          <Text style={styles.infoText} allowFontScaling={false}>
            Rifqi Naufat
          </Text>
          <Text style={styles.infoText} allowFontScaling={false}>
            Address - 1901 Thornridge Cir. Shiloh, Hawaii 81063
          </Text>
          <Text style={styles.infoText} allowFontScaling={false}>
            Mobile - +1 412 4562 234
          </Text>

          <View style={styles.separator} />

          <Text style={styles.infoText} allowFontScaling={false}>
            Scheduled delivery: Saturday, 16th March
          </Text>

          <View style={styles.separator} />

          <Text style={styles.infoText} allowFontScaling={false}>
            Payment Method: {info?.payment_method}
          </Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          {/* Continue Shopping Button */}
          <Pressable
            style={[styles.button, styles.continueButton]}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText} allowFontScaling={false}>
              Continue Shopping
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ThankYou;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 20,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  successIcon: {
    height: 90,
    width: 90,
    marginBottom: 20,
  },
  thankYouText: {
    fontFamily: Fonts.PhilosopherBold,
    color: Colors.black,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  orderCard: {
    width: '100%',
    backgroundColor: Colors.gray6,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderIcon: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  orderTitle: {
    fontFamily: Fonts.PhilosopherBold,
    fontSize: 16,
    color: Colors.black,
  },
  orderId: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  infoText: {
    fontSize: 14,
    color: Colors.black,
    marginBottom: 5,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.gray3,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 5,
  },
  trackButton: {
    backgroundColor: Colors.blue, // Change color to match theme
  },
  continueButton: {
    backgroundColor: Colors.red,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
  },
});
