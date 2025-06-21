import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useRef, useEffect} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Fonts} from '../../constant/Styles';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');

const ThankYou = props => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const info = props?.route?.params?.info;

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const cardSlideAnim = useRef(new Animated.Value(100)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entrance animations
    const animations = [
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(successScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        delay: 200,
      }),
      Animated.timing(cardSlideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        delay: 400,
      }),
    ];

    Animated.stagger(200, animations).start();
  }, []);

  const handleButtonPress = () => {
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start(() => {
      navigation.navigate('Home');
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return Colors.green;
      case 'pending':
        return Colors.yellow;
      case 'failed':
        return Colors.red;
      default:
        return Colors.gray;
    }
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <Animated.View
          style={[
            styles.headerSection,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          {/* Success Animation */}
          <Animated.View
            style={[
              styles.successContainer,
              {
                transform: [{scale: successScale}],
              },
            ]}>
            <View style={styles.successCircle}>
              <Icon name="check" size={40} color={Colors.white} />
            </View>
          </Animated.View>

          {/* Thank You Text */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{scale: scaleAnim}],
              },
            ]}>
            <Text style={styles.thankYouText} allowFontScaling={false}>
              Thank You!
            </Text>
            <Text style={styles.subText} allowFontScaling={false}>
              Your order has been successfully placed
            </Text>
            <Text style={styles.orderNumber} allowFontScaling={false}>
              Order #{info?.order_number}
            </Text>
          </Animated.View>
        </Animated.View>

        {/* Order Details Card */}
        <Animated.View
          style={[
            styles.orderCard,
            {
              opacity: fadeAnim,
              transform: [{translateY: cardSlideAnim}],
            },
          ]}>
          <LinearGradient
            colors={[Colors.gray6, Colors.white]}
            style={styles.cardGradient}>
            {/* Order Summary */}
            <View style={styles.cardHeader}>
              <View style={styles.headerRow}>
                <Icon name="receipt" size={24} color={Colors.red} />
                <Text style={styles.cardTitle} allowFontScaling={false}>
                  Order Summary
                </Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText} allowFontScaling={false}>
                  {info?.status}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            {/* Order Details */}
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel} allowFontScaling={false}>
                  Order Amount:
                </Text>
                <Text style={styles.detailValue} allowFontScaling={false}>
                  {formatCurrency(info?.amount, info?.currency)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel} allowFontScaling={false}>
                  Payment Method:
                </Text>
                <Text style={styles.detailValue} allowFontScaling={false}>
                  {info?.payment_method}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel} allowFontScaling={false}>
                  Payment Status:
                </Text>
                <View style={styles.paymentStatusContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      {backgroundColor: getStatusColor(info?.payment_status)},
                    ]}
                  />
                  <Text
                    style={[
                      styles.detailValue,
                      {color: getStatusColor(info?.payment_status)},
                    ]}
                    allowFontScaling={false}>
                    {info?.payment_status}
                  </Text>
                </View>
              </View>

              {info?.transaction_id && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel} allowFontScaling={false}>
                    Transaction ID:
                  </Text>
                  <Text style={styles.transactionId} allowFontScaling={false}>
                    {info?.transaction_id}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.separator} />

            {/* Customer Information */}
            <View style={styles.customerSection}>
              <View style={styles.sectionHeader}>
                <Icon name="person" size={20} color={Colors.blue} />
                <Text style={styles.sectionTitle} allowFontScaling={false}>
                  Customer Details
                </Text>
              </View>

              <View style={styles.customerInfo}>
                <Text style={styles.customerName} allowFontScaling={false}>
                  {info?.user?.first_name} {info?.user?.last_name}
                </Text>
                <Text style={styles.customerEmail} allowFontScaling={false}>
                  {info?.user?.email}
                </Text>
                <Text style={styles.customerPhone} allowFontScaling={false}>
                  {info?.user?.phone}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            {/* Shipping Address */}
            <View style={styles.addressSection}>
              <View style={styles.sectionHeader}>
                <Icon name="location-on" size={20} color={Colors.blue} />
                <Text style={styles.sectionTitle} allowFontScaling={false}>
                  Shipping Address
                </Text>
              </View>

              <Text style={styles.addressText} allowFontScaling={false}>
                {info?.shipping_address?.street}
              </Text>
              <Text style={styles.addressText} allowFontScaling={false}>
                Block {info?.shipping_address?.block}
              </Text>
              <Text style={styles.addressText} allowFontScaling={false}>
                {info?.shipping_address?.city}
                {info?.shipping_address?.state_name && `, ${info?.shipping_address?.state_name}`}
              </Text>
              <Text style={styles.addressText} allowFontScaling={false}>
                {info?.shipping_address?.country_name}
                {info?.shipping_address?.zip_code && ` - ${info?.shipping_address?.zip_code}`}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{translateY: cardSlideAnim}],
            },
          ]}>
          <Animated.View
            style={[
              styles.buttonWrapper,
              {
                transform: [{scale: buttonScale}],
              },
            ]}>
            <Pressable
              style={styles.continueButton}
              onPress={handleButtonPress}
              android_ripple={{color: 'rgba(255,255,255,0.2)'}}>
              <LinearGradient
                colors={[Colors.red, Colors.red2]}
                style={styles.gradientButton}>
                <Icon name="shopping-cart" size={20} color={Colors.white} />
                <Text style={styles.buttonText} allowFontScaling={false}>
                  Continue Shopping
                </Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default ThankYou;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successContainer: {
    marginBottom: 20,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.green,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  thankYouText: {
    fontFamily: Fonts.PhilosopherBold,
    color: Colors.black,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: Colors.gray7,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Fonts.InterMedium,
  },
  orderNumber: {
    fontSize: 14,
    color: Colors.red,
    fontFamily: Fonts.InterBold,
    textAlign: 'center',
  },
  orderCard: {
    marginBottom: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: Fonts.PhilosopherBold,
    fontSize: 18,
    color: Colors.black,
    marginLeft: 10,
  },
  statusBadge: {
    backgroundColor: Colors.lightGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    color: Colors.green,
    fontFamily: Fonts.InterBold,
    textTransform: 'uppercase',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray3,
    marginVertical: 15,
  },
  detailsSection: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.gray7,
    fontFamily: Fonts.InterMedium,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
  },
  paymentStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  transactionId: {
    fontSize: 12,
    color: Colors.gray7,
    fontFamily: Fonts.InterMedium,
    maxWidth: 120,
  },
  customerSection: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
    marginLeft: 8,
  },
  customerInfo: {
    marginLeft: 28,
  },
  customerName: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
    marginBottom: 4,
  },
  customerEmail: {
    fontSize: 14,
    color: Colors.gray7,
    fontFamily: Fonts.InterMedium,
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 14,
    color: Colors.gray7,
    fontFamily: Fonts.InterMedium,
  },
  addressSection: {
    marginBottom: 10,
  },
  addressText: {
    fontSize: 14,
    color: Colors.gray7,
    fontFamily: Fonts.InterMedium,
    marginBottom: 2,
    marginLeft: 28,
  },
  buttonContainer: {
    gap: 15,
  },
  buttonWrapper: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: Colors.red,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: Fonts.InterBold,
    marginLeft: 8,
  },
  trackButton: {
    borderWidth: 2,
    borderColor: Colors.blue,
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackButtonText: {
    fontSize: 16,
    color: Colors.blue,
    fontFamily: Fonts.InterBold,
    marginLeft: 8,
  },
});
