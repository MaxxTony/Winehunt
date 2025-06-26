import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  Animated,
  Easing,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import {Modal} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors, Fonts} from '../../../constant/Styles';
import Lottie from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProfile} from '../../../redux/slices/profileSlice';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const calculatePricing = (product, quantity = 1) => {
  const actualPrice = parseFloat(product.actual_price);
  const currentPrice = parseFloat(product.price);
  const discount = parseFloat(product.discount || 0);
  const offerDiscount = parseFloat(product.offer_discount || 0);

  let finalPrice = currentPrice;

  return {
    originalPrice: actualPrice * quantity,
    currentPrice: currentPrice * quantity,
    finalPrice: finalPrice * quantity,
    hasDiscount: product.has_discount || false,
    hasOffer: product.has_offer || false,
    discountAmount: discount,
    offerDiscountAmount: offerDiscount,
    discountPercentage:
      actualPrice > 0 ? ((actualPrice - finalPrice) / actualPrice) * 100 : 0,
  };
};

const AnimatedCartItem = ({item, onRemove, index, setIsCartVisible}) => {
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.profile);
  const [quantity, setQuantity] = useState(item.quantity);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfile());
    }, [dispatch]),
  );

  const navigation = useNavigation();
  const anim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 400 + index * 60,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, []);

  const pricing = calculatePricing(item.product, quantity);

  const handleRemove = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onRemove(item.id);
    });
  };

  

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [40, 0],
            }),
          },
          {scale: scaleAnim},
        ],
        marginBottom: 15,
      }}>
      <Pressable
        style={styles.cartItemCard}
        onPress={() => {
          setIsCartVisible(false);
         
          navigation.navigate('WineDetail', {
            item: item?.product?.id,
            
          });
        }}>
        <Image
          source={{
            uri:
              item?.product?.product_images?.[0]?.image ||
              'https://via.placeholder.com/50',
          }}
          style={styles.cartItemImage}
          resizeMode="contain"
        />
        <View style={{flex: 1, marginLeft: 12}}>
          <Text style={styles.cartItemTitle}>{item.product.name}</Text>
          <Text style={styles.qtyText}>Quantity: {quantity}</Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginTop: 4,
            }}>
            {/* Offer badge */}
            {pricing.hasOffer && (
              <View style={styles.offerBadge}>
                <Text style={styles.offerText}>
                  {parseFloat(item.product.offer_discount).toFixed(0)}% OFF
                </Text>
              </View>
            )}
            {/* MileStone badge */}
            {pricing.hasDiscount && (
              <View style={styles.milestoneBadge}>
                <Text style={styles.milestoneText}>
                  {parseFloat(item.product.discount).toFixed(0)}% OFF
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={{alignItems: 'flex-end'}}>
          {/* Pricing */}
          <View style={styles.pricingContainer}>
            <Text style={styles.finalPrice}>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(pricing.finalPrice)}
            </Text>

            {pricing.hasDiscount && (
              <Text style={styles.originalPrice}>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(pricing.originalPrice)}
              </Text>
            )}
          </View>

          <TouchableOpacity onPress={handleRemove} style={styles.deleteBtn}>
            <Icon name="delete" size={22} color={Colors.red} />
          </TouchableOpacity>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const AnimatedCartModal = ({
  visible,
  onClose,
  cartData,
  navigation,
  onRemoveItem,
  setIsCartVisible,
}) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [internalCart, setInternalCart] = useState(cartData);



  useEffect(() => {
    setInternalCart(cartData);
  }, [cartData]);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 18,
        bounciness: 7,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Calculate total with correct pricing
  const total = internalCart.reduce((sum, item) => {
    const pricing = calculatePricing(item.product, item.quantity);
    return sum + pricing.finalPrice;
  }, 0);

  // Handle remove
  const handleRemove = id => {
    onRemoveItem(id);
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose} />
      <Animated.View
        style={[styles.modalContainer, {transform: [{translateY: slideAnim}]}]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Cart</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Icon name="close" size={24} color={Colors.black} />
          </TouchableOpacity>
        </View>

        {internalCart.length > 0 ? (
          <>
            <FlatList
              data={internalCart}
              keyExtractor={item => item.id.toString()}
              renderItem={({item, index}) => (
                <AnimatedCartItem
                  item={item}
                  index={index}
                  onRemove={handleRemove}
                  setIsCartVisible={setIsCartVisible}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 140}}
            />

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(total)}
                </Text>
              </View>

              <View style={{height: 10}} />
              <CustomCheckoutButton
                label="Proceed to Checkout"
                onPress={() => {
                  setIsCartVisible(false);
                  navigation.navigate('Cart');
                }}
              />
            </View>
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Lottie
              source={require('../../../../assets/json/loader.json')}
              autoPlay
              loop
              style={{width: 120, height: 120, alignSelf: 'center'}}
            />
            <Text style={styles.emptyText}>Your cart is empty.</Text>
            <Text style={styles.emptySubText}>
              Add some wines to get started!
            </Text>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
};

// Custom animated checkout button (replaces AnimatedCartButton)
const CustomCheckoutButton = ({onPress, label = 'Proceed to Checkout'}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Animate button press
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.93,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  };

  return (
    <Animated.View
      style={[styles.animatedWrapper, {transform: [{scale: scaleAnim}]}]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{borderRadius: 30, overflow: 'hidden'}}>
        <Animated.View>
          <LinearGradient
            colors={[Colors.red, Colors.blue]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.gradientButton}>
            <View style={styles.contentRow}>
              <Ionicons
                name="cart-outline"
                size={22}
                color="#fff"
                style={{marginRight: 10}}
              />
              <Text style={styles.buttonText}>{label}</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: SCREEN_HEIGHT * 0.85,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: Fonts.InterBold,
    color: Colors.black,
  },
  closeBtn: {
    padding: 5,
  },
  cartItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray13,
    padding: 15,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.gray6,
  },
  cartItemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray6,
  },
  cartItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: Fonts.InterBold,
    color: Colors.black,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray15,
    fontFamily: Fonts.InterMedium,
  },
  offerBadge: {
    backgroundColor: Colors.red, 
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  offerText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: Fonts.InterBold,
    textTransform: 'uppercase',
  },
  milestoneBadge: {
    backgroundColor: Colors.blue,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  milestoneText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: Fonts.InterBold,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.gray6,
  },
  quantityBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.gray13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 12,
    fontFamily: Fonts.InterBold,
    color: Colors.black,
  },
  pricingContainer: {
    alignItems: 'flex-end',
  },
  finalPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.red,
    marginBottom: 2,
    fontFamily: Fonts.InterBold,
  },
  originalPrice: {
    fontSize: 13,
    color: Colors.gray15,
    textDecorationLine: 'line-through',
    fontFamily: Fonts.InterRegular,
  },
  discountPercentage: {
    fontSize: 11,
    color: Colors.green,
    fontWeight: 'bold',
    fontFamily: Fonts.InterBold,
  },
  deleteBtn: {
    marginTop: 8,
    alignSelf: 'flex-end',
    padding: 4,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Platform.OS === 'ios' ? 30 : 10,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
    paddingBottom: 10,
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.green + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 10,
  },
  savingsText: {
    fontSize: 14,
    color: Colors.green,
    fontWeight: 'bold',
    marginLeft: 6,
    fontFamily: Fonts.InterBold,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.gray13,
    paddingVertical: 12,
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 17,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
  },
  totalValue: {
    fontSize: 18,
    color: Colors.red,
    fontWeight: 'bold',
    fontFamily: Fonts.InterBold,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: Colors.black,
    marginTop: 18,
    fontFamily: Fonts.InterBold,
  },
  emptySubText: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.gray,
    marginTop: 8,
    fontFamily: Fonts.InterRegular,
  },
  animatedWrapper: {
    alignSelf: 'center',
    minWidth: 180,
    zIndex: 10,
  },
  gradientButton: {
    flexDirection: 'row',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 180,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.2,
    fontFamily: Fonts.InterBold,
  },
  cartBadge: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: Colors.red,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Fonts.InterBold,
  },
});

export default AnimatedCartModal;
