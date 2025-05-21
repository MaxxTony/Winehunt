import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import WineHuntButton from '../../common/WineHuntButton';
import {Colors, Fonts} from '../../constant/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import axios from 'axios';
import {useStripe} from '@stripe/stripe-react-native';
import Loader from '../../helper/Loader';
import {showSucess} from '../../helper/Toastify';

const Checkout = props => {
  const data = props?.route?.params?.data;
  console.log(data)

  const DELIVERY_FEE = 100;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [cnfirmModal, setConfrimModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState([]);

  // Format amount with thousand separators
  const formatAmount = amount => {
    return amount?.toLocaleString();
  };

  const TotalAmount = formatAmount(parseFloat(data?.amount) + DELIVERY_FEE);

  const [payStatus, setPayStatus] = useState(false);

  useEffect(() => {
    fetchSheet();
  }, []);

  const fetchSheet = async () => {
    const data = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(data)?.token;
    const param = {
      amount: parseFloat(TotalAmount).toFixed(0),
      currency: 'USD',
    };
    const url = Constants.baseUrl9 + Constants.createIntent;
    try {
      const response = await axios.post(url, param, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.status === 200) {
        initializePaymentSheet(response?.data?.data);
        setPaymentInfo(response?.data?.data);
        setPayStatus(true);
      }
    } catch (error) {
      console.error(
        'Error fetching payment sheet params:',
        error?.response?.data,
      );
    }
  };

  const initializePaymentSheet = async clientSecret => {
    const data = await AsyncStorage.getItem('userDetail');
    const userInfo = JSON.parse(data);
    const customAppearance = {
      shapes: {
        borderRadius: 12,
        borderWidth: 0.5,
      },
      primaryButton: {
        shapes: {
          borderRadius: 20,
        },
      },
      colors: {
        primary: '#30313d',
        background: '#ffffff',
        componentBackground: '#f7f9fb',
        componentBorder: '#dcdee1',
        componentDivider: '#dcdee1',
        primaryText: '#30313d',
        secondaryText: '#303030',
        componentText: '#000000',
        placeholderText: '#73757b',
      },
    };

    const {error} = await initPaymentSheet({
      merchantDisplayName: 'WineHunt, Inc.',
      customerId: clientSecret?.stripeCustomerId,
      //customerEphemeralKeySecret: clientSecret?.paymentIntentId,
      paymentIntentClientSecret: clientSecret?.clientSecret,
      defaultBillingDetails: {
        name: userInfo?.full_name,
        email: userInfo?.email,
        phone: userInfo?.phone,
      },
      googlePay: {
        testEnv: true,
        merchantName: 'Winehunt, Inc.',
        merchantCountryCode: 'US',
        currencyCode: 'USD',
      },
      allowsDelayedPaymentMethods: true,
      billingDetailsCollectionConfiguration: {
        attachDefaultsToPaymentMethod: true,
      },

      returnURL: 'com.winehunt://stripe-redirect',
      appearance: customAppearance,
      paymentMethodOrder: ['apple_pay', 'google_pay', 'card', 'klarna'],
    });

    if (error) {
      Alert.alert(`Error: ${error.message}`);
    }
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    const {error} = await presentPaymentSheet();
    if (error) {
      console.log(error);
      setLoading(false);
    } else {
      setLoading(false);
      setConfrimModal(true);
      setPayStatus(false);
      createOrder();
    }
  };

  const createOrder = async () => {
    const datas = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(datas)?.token;
    const userId = JSON.parse(datas)?.user;

    const param = {
      user_id: userId?.id,
      amount: parseFloat(TotalAmount),
      currency: 'usd',
      payment_intent_id: paymentInfo?.paymentIntentId,
      payment_method: data?.paymentType?.name,
      shipping_address_id: data?.address?.id,
      items:
        data?.cartData?.map(item => ({
          cart_id: item?.id || '',
          vendor_id:item?.product?.user_id,
          product_id: item?.product?.id || '',
          product_name: item?.product?.name || '',
          price: item?.price_mappings?.price || 100,
          size: item?.price_mappings?.size?.name || 'small',
          quantity: item?.quantity || 1,
          status: item?.status,
        })) || [],
    };

    console.log(param)
 

    const url = Constants.baseUrl9 + Constants.createOrder;
    try {
      const response = await axios.post(url, param, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.status === 200) {
        showSucess(response?.data?.message);
        navigation.navigate('ThankYou', {info: response?.data?.data?.order});
      }
    } catch (error) {
      console.error('Error doing create order:', error?.response?.data);
    }
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <BackNavigationWithTitle
        title="Checkout"
        onPress={() => navigation.goBack()}
      />
      <Loader modalVisible={loading} setModalVisible={setLoading} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText} allowFontScaling={false}>
          Please confirm and submit your order
        </Text>
        <Text style={styles.infoText} allowFontScaling={false}>
          By clicking submit order, you agree to Terms of Condition and Privacy
          Policy.
        </Text>

        {/* Payment Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle} allowFontScaling={false}>
            Payment
          </Text>
          <View style={styles.rowBetween}>
            <View style={styles.rowAlign}>
              {data?.paymentType?.image && (
                <Image
                  source={data?.paymentType?.image}
                  style={styles.cardIcon}
                />
              )}
              <Text style={styles.text} allowFontScaling={false}>
                {data?.paymentType?.name}
              </Text>
            </View>
            <Text style={styles.text}>
              {new Date()
                .toLocaleDateString('en-US', {
                  month: '2-digit',
                  year: '2-digit',
                })
                .replace('/', '/')}
            </Text>
          </View>
        </View>

        {/* Shipping Address Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle} allowFontScaling={false}>
            Shipping Address
          </Text>
          <Text style={styles.text} allowFontScaling={false}>
            {data?.address?.address}
          </Text>
        </View>

        {/* Order Summary Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle} allowFontScaling={false}>
            Order Summary
          </Text>
          <View style={styles.rowBetween}>
            <Text style={styles.text} allowFontScaling={false}>
              SubTotal
            </Text>
            <Text style={styles.amountText} allowFontScaling={false}>
              ${formatAmount(data?.amount)}
            </Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.text} allowFontScaling={false}>
              Delivery
            </Text>
            <Text style={styles.amountText} allowFontScaling={false}>
              ${formatAmount(DELIVERY_FEE)}
            </Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.grandTotalText} allowFontScaling={false}>
              Grand Total
            </Text>
            <Text style={styles.grandTotalAmount} allowFontScaling={false}>
              ${TotalAmount}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <WineHuntButton
          text="Submit Order"
          onPress={() => {
            if (payStatus) {
              handleConfirmPayment();
            }
          }}
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
    fontSize: 18,
    marginBottom: 10,
  },
  infoText: {
    fontFamily: Fonts.InterRegular,
    color: Colors.gray,
    fontSize: 14,
    marginBottom: 15,
  },
  cardContainer: {
    padding: 15,
    backgroundColor: Colors.white,
    elevation: 5,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTitle: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontSize: 16,
    marginBottom: 10,
  },
  text: {
    fontFamily: Fonts.InterRegular,
    color: Colors.black,
    fontSize: 14,
  },
  amountText: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontSize: 14,
  },
  grandTotalText: {
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    fontSize: 16,
  },
  grandTotalAmount: {
    fontFamily: Fonts.InterBold,
    color: Colors.red,
    fontSize: 16,
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
    marginVertical: 5,
  },
  cardIcon: {
    height: 18,
    width: 30,
    resizeMode: 'contain',
  },
  buttonContainer: {
    padding: 20,
  },
});
