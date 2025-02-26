import React from 'react';
import {View, ScrollView, Text, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import WineHuntButton from '../../common/WineHuntButton';
import {Colors, Fonts} from '../../constant/Styles';

const Checkout = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <BackNavigationWithTitle
        title="Payment"
        onPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>
          Please confirm and submit your order
        </Text>
        <Text style={styles.infoText}>
          By clicking submit order, you agree to Terms of Condition and Privacy
          Policy.
        </Text>

        {/* Payment Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Payment</Text>
          <View style={styles.rowBetween}>
            <View style={styles.rowAlign}>
              <Image
                source={require('./images/c1.png')}
                style={styles.cardIcon}
              />
              <Text style={styles.text}>Credit Card</Text>
            </View>
            <Text style={styles.text}>01/28</Text>
          </View>
        </View>

        {/* Shipping Address Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Shipping Address</Text>
          <Text style={styles.text}>
            1901 Thornridge Cir. Shiloh, Hawaii 81063
          </Text>
        </View>

        {/* Order Summary Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          <View style={styles.rowBetween}>
            <Text>SubTotal</Text>
            <Text>$ 400</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text>Delivery</Text>
            <Text>$ 400</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text>Grand Total</Text>
            <Text>$ 800</Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <WineHuntButton
          text="Submit Order"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    padding: 20,
  },
  headerText: {
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    fontSize: 16,
    marginBottom: 10,
  },
  infoText: {
    marginBottom: 10,
  },
  cardContainer: {
    padding: 10,
    backgroundColor: Colors.white,
    elevation: 5,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: Fonts.InterRegular,
    color: Colors.black,
    fontSize: 15,
    marginBottom: 5,
  },
  text: {
    fontFamily: Fonts.InterRegular,
    color: Colors.black,
    fontSize: 15,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardIcon: {
    height: 15,
    width: 25,
  },
  buttonContainer: {
    padding: 20,
  },
});
