import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  ScrollView,
  BackHandler,
} from 'react-native';
import React, {useRef, useEffect} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Fonts} from '../../constant/Styles';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');

const ThankYou = props => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const info = props?.route?.params?.info;

  console.log(info)

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const cardSlideAnim = useRef(new Animated.Value(100)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;

  // Handle back button press
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Home");
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  useEffect(() => {
    // Background animation
    Animated.timing(backgroundAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

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

    // Checkmark animation after success
    setTimeout(() => {
      Animated.timing(checkmarkAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 800);

    // Confetti animation after success
    setTimeout(() => {
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 1000);
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

  // Enhanced Success Animation Component
  const SuccessAnimation = () => (
    <View style={styles.successContainer}>
      {/* Main success circle */}
      <Animated.View
        style={[
          styles.successCircle,
          {
            transform: [{scale: successScale}],
          },
        ]}>
        <LinearGradient
          colors={[Colors.green, Colors.green2]}
          style={styles.successGradient}>
          <Animated.View
            style={{
              transform: [
                {
                  scale: checkmarkAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ],
            }}>
            <Icon name="check" size={40} color={Colors.white} />
          </Animated.View>
        </LinearGradient>
      </Animated.View>
      
      {/* Animated rings */}
      <Animated.View
        style={[
          styles.ring1,
          {
            opacity: confettiAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.3],
            }),
            transform: [
              {
                scale: confettiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring2,
          {
            opacity: confettiAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.2],
            }),
            transform: [
              {
                scale: confettiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1.4],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring3,
          {
            opacity: confettiAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.1],
            }),
            transform: [
              {
                scale: confettiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 1.6],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );

  // Background Pattern Component
  const BackgroundPattern = () => (
    <Animated.View
      style={[
        styles.backgroundPattern,
        {
          opacity: backgroundAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.03],
          }),
        },
      ]}>
      {[...Array(15)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.patternDot,
            {
              left: Math.random() * width,
              top: Math.random() * height,
              backgroundColor: Colors.red,
            },
          ]}
        />
      ))}
    </Animated.View>
  );

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <BackgroundPattern />
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
          <SuccessAnimation />

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

        {/* Action Button */}
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
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  patternDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
    zIndex: 1,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  successContainer: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    shadowColor: Colors.green,
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    zIndex: 3,
  },
  successGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring1: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: Colors.green,
    zIndex: 2,
  },
  ring2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: Colors.green2,
    zIndex: 1,
  },
  ring3: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: Colors.green,
    zIndex: 0,
  },
  textContainer: {
    alignItems: 'center',
  },
  thankYouText: {
    fontFamily: Fonts.PhilosopherBold,
    color: Colors.black,
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 12,
  },
  subText: {
    fontSize: 18,
    color: Colors.gray7,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: Fonts.InterMedium,
    lineHeight: 24,
  },
  orderNumber: {
    fontSize: 16,
    color: Colors.red,
    fontFamily: Fonts.InterBold,
    textAlign: 'center',
  },
  orderCard: {
    marginBottom: 40,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  cardGradient: {
    borderRadius: 24,
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: Fonts.PhilosopherBold,
    fontSize: 20,
    color: Colors.black,
    marginLeft: 12,
  },
  statusBadge: {
    backgroundColor: Colors.lightGreen,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
  },
  statusText: {
    fontSize: 13,
    color: Colors.green,
    fontFamily: Fonts.InterBold,
    textTransform: 'uppercase',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray3,
    marginVertical: 20,
  },
  detailsSection: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 15,
    color: Colors.gray7,
    fontFamily: Fonts.InterMedium,
  },
  detailValue: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
  },
  paymentStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  transactionId: {
    fontSize: 13,
    color: Colors.gray7,
    fontFamily: Fonts.InterMedium,
    maxWidth: 140,
  },
  customerSection: {
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
    marginLeft: 10,
  },
  customerInfo: {
    marginLeft: 32,
  },
  customerName: {
    fontSize: 17,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
    marginBottom: 6,
  },
  customerEmail: {
    fontSize: 15,
    color: Colors.gray7,
    fontFamily: Fonts.InterMedium,
    marginBottom: 3,
  },
  customerPhone: {
    fontSize: 15,
    color: Colors.gray7,
    fontFamily: Fonts.InterMedium,
  },
  addressSection: {
    marginBottom: 15,
  },
  addressText: {
    fontSize: 15,
    color: Colors.gray7,
    fontFamily: Fonts.InterMedium,
    marginBottom: 3,
    marginLeft: 32,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttonWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.red,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    width: '100%',
  },
  continueButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 18,
    color: Colors.white,
    fontFamily: Fonts.InterBold,
    marginLeft: 10,
  },
});
