import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, Image, StyleSheet, Alert} from 'react-native';
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
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [cnfirmModal, setConfrimModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState([]);
  const TotalAmount = parseFloat(data?.amount);
  const [payStatus, setPayStatus] = useState(false);

  useEffect(() => {
    fetchSheet();
  }, []);

  const fetchSheet = async () => {
    const data = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(data)?.token;
    const param = {
      amount: TotalAmount,
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
      // delievery_address: data?.address?.name,
      vendor_id: data?.vendorId,
      delivery_amount: parseFloat(data?.orderSummary?.deliveryFee),
      items:
        data?.cartData?.map(item => ({
          cart_id: item?.id || '',
          vendor_id: item?.product?.user_id,
          product_id: item?.product?.id || '',
          product_name: item?.product?.name || '',
          price: item?.product?.price,
          size: 'large',
          quantity: item?.quantity,
          status: item?.status,
        })) || [],
    };

    // console.log(param);
    // return

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
        console.log(response?.data, 'vishal');
        showSucess(response?.data?.message);
        navigation.navigate('ThankYou', {info: response?.data?.data?.order});
      }
    } catch (error) {
      console.error('Error doing create order:', error?.response?.data);
    }
  };

  const formatPrice = price => {
    return `£${parseFloat(price).toFixed(2)}`;
  };

  const renderCartItem = (item, index) => (
    <View key={index} style={styles.cartItemContainer}>
      <View style={styles.cartItemImageContainer}>
        {item?.product?.product_images?.[0]?.image && (
          <Image
            source={{uri: item?.product?.product_images[0]?.image}}
            style={styles.cartItemImage}
          />
        )}
      </View>
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName} allowFontScaling={false}>
          {item?.product?.name}
        </Text>
        <Text style={styles.cartItemTitle} allowFontScaling={false}>
          {item?.product?.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.cartItemPrice} allowFontScaling={false}>
            {formatPrice(item?.product?.price)}
          </Text>
          {item?.product?.has_discount && (
            <Text style={styles.originalPrice} allowFontScaling={false}>
              {formatPrice(item?.product?.actual_price)}
            </Text>
          )}
        </View>
        <Text style={styles.quantityText} allowFontScaling={false}>
          Qty: {item?.quantity}
        </Text>
      </View>
      <View style={styles.cartItemTotal}>
        <Text style={styles.cartItemTotalText} allowFontScaling={false}>
          {formatPrice(item?.product?.price * item?.quantity)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <BackNavigationWithTitle
        title="Checkout"
        onPress={() => navigation.goBack()}
      />
      <Loader modalVisible={loading} setModalVisible={setLoading} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerText} allowFontScaling={false}>
            Complete Your Order
          </Text>
          <Text style={styles.infoText} allowFontScaling={false}>
            Review your order details and confirm your purchase
          </Text>
        </View>

        {/* Order Items Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle} allowFontScaling={false}>
            Order Items ({data?.orderSummary?.totalItems || 0})
          </Text>
          <View style={styles.cartItemsContainer}>
            {data?.cartData?.map((item, index) => renderCartItem(item, index))}
          </View>
        </View>

        {/* Shipping Address Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle} allowFontScaling={false}>
            Shipping Address
          </Text>
          <View style={styles.addressContainer}>
            <View style={styles.addressHeader}>
              <Text style={styles.addressName} allowFontScaling={false}>
                {data?.address?.name}
              </Text>
              <View style={styles.addressBadge}>
                <Text style={styles.addressBadgeText} allowFontScaling={false}>
                  Default
                </Text>
              </View>
            </View>
            <Text style={styles.addressText} allowFontScaling={false}>
              {data?.address?.address}
            </Text>
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle} allowFontScaling={false}>
            Payment Method
          </Text>
          <View style={styles.paymentContainer}>
            <View style={styles.paymentMethodRow}>
              <View style={styles.paymentIconContainer}>
                <Text style={styles.paymentIcon}>💳</Text>
              </View>
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentMethodName} allowFontScaling={false}>
                  {data?.paymentType?.name}
                </Text>
                <Text style={styles.paymentInfo} allowFontScaling={false}>
                  Secure payment via Stripe
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Summary Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle} allowFontScaling={false}>
            Order Summary
          </Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel} allowFontScaling={false}>
                Subtotal
              </Text>
              <Text style={styles.summaryValue} allowFontScaling={false}>
                {formatPrice(data?.orderSummary?.subtotal)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel} allowFontScaling={false}>
                Delivery Fee
              </Text>
              <Text style={styles.summaryValue} allowFontScaling={false}>
                {formatPrice(data?.orderSummary?.deliveryFee)}
              </Text>
            </View>
            {data?.orderSummary?.totalSavings > 0 && (
              <View style={styles.savingsRow}>
                <Text style={styles.savingsLabel} allowFontScaling={false}>
                  Total Savings
                </Text>
                <Text style={styles.savingsValue} allowFontScaling={false}>
                  -{formatPrice(data?.orderSummary?.totalSavings)}
                </Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel} allowFontScaling={false}>
                Total Amount
              </Text>
              <Text style={styles.totalValue} allowFontScaling={false}>
                {formatPrice(data?.orderSummary?.total)}
              </Text>
            </View>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText} allowFontScaling={false}>
            By proceeding with this order, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <WineHuntButton
          text={`Pay ${formatPrice(data?.orderSummary?.total)}`}
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
    backgroundColor: Colors.gray6,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  headerSection: {
    marginBottom: 24,
  },
  headerText: {
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    fontSize: 24,
    marginBottom: 8,
  },
  infoText: {
    fontFamily: Fonts.InterRegular,
    color: Colors.gray14,
    fontSize: 16,
    lineHeight: 22,
  },
  sectionContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    fontSize: 18,
    marginBottom: 16,
  },
  cartItemsContainer: {
    gap: 16,
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray12,
  },
  cartItemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.gray12,
    marginRight: 12,
  },
  cartItemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    fontSize: 16,
    marginBottom: 4,
  },
  cartItemTitle: {
    fontFamily: Fonts.InterRegular,
    color: Colors.gray14,
    fontSize: 14,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontFamily: Fonts.InterBold,
    color: Colors.red,
    fontSize: 16,
  },
  originalPrice: {
    fontFamily: Fonts.InterRegular,
    color: Colors.gray14,
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  quantityText: {
    fontFamily: Fonts.InterMedium,
    color: Colors.gray9,
    fontSize: 12,
  },
  cartItemTotal: {
    alignItems: 'flex-end',
  },
  cartItemTotalText: {
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    fontSize: 16,
  },
  addressContainer: {
    backgroundColor: Colors.gray6,
    borderRadius: 12,
    padding: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addressName: {
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    fontSize: 16,
  },
  addressBadge: {
    backgroundColor: Colors.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  addressBadgeText: {
    fontFamily: Fonts.InterMedium,
    color: Colors.white,
    fontSize: 10,
  },
  addressText: {
    fontFamily: Fonts.InterRegular,
    color: Colors.gray14,
    fontSize: 14,
    lineHeight: 20,
  },
  paymentContainer: {
    backgroundColor: Colors.gray6,
    borderRadius: 12,
    padding: 16,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentIcon: {
    fontSize: 20,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentMethodName: {
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    fontSize: 16,
    marginBottom: 2,
  },
  paymentInfo: {
    fontFamily: Fonts.InterRegular,
    color: Colors.gray14,
    fontSize: 12,
  },
  summaryContainer: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: Fonts.InterRegular,
    color: Colors.gray14,
    fontSize: 16,
  },
  summaryValue: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontSize: 16,
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsLabel: {
    fontFamily: Fonts.InterRegular,
    color: Colors.green,
    fontSize: 16,
  },
  savingsValue: {
    fontFamily: Fonts.InterBold,
    color: Colors.green,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray12,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    fontSize: 18,
  },
  totalValue: {
    fontFamily: Fonts.InterBold,
    color: Colors.red,
    fontSize: 20,
  },
  termsContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  termsText: {
    fontFamily: Fonts.InterRegular,
    color: Colors.gray14,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  termsLink: {
    color: Colors.red,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray12,
  },
});
