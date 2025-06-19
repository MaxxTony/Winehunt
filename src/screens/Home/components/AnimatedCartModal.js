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

const AnimatedCartItem = ({item, onRemove, onChangeQty, index, setIsCartVisible}) => {
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.profile);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfile());
    }, [dispatch]),
  );
  const navigation = useNavigation();
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 400 + index * 60,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, []);
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
        ],
        marginBottom: 15,
      }}>
      <Pressable
        style={styles.cartItemCard}
        onPress={() => {
          setIsCartVisible(false);
          navigation.navigate('VendorDetail', {
            item: item,
            userCoordinates: {
              latitude: userData?.latitude,
              longitude: userData?.longitude,
            },
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
          <Text style={styles.qtyText}>Quantity: {item.quantity}</Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          {item.product.discount && parseFloat(item.product.discount) > 0 ? (
            <>
              <Text style={styles.discountedPrice}>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(
                  item.quantity *
                    (parseFloat(item.product.price) -
                      parseFloat(item.product.discount)),
                )}
              </Text>
              <Text style={styles.originalPrice}>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(item.quantity * parseFloat(item.product.price))}
              </Text>
            </>
          ) : (
            <Text style={styles.discountedPrice}>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(item.quantity * parseFloat(item.product.price))}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => onRemove(item.id)}
            style={styles.deleteBtn}>
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
  onChangeQty = () => {},
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

  // Calculate total
  const total = internalCart.reduce((sum, item) => {
    const price = parseFloat(item.product.price);
    const discount = parseFloat(item.product.discount || 0);
    return sum + item.quantity * (price - discount);
  }, 0);

  // Handle quantity change
  const handleChangeQty = (item, newQty) => {
    if (newQty < 1) return;
    const updated = internalCart.map(ci =>
      ci.id === item.id ? {...ci, quantity: newQty} : ci,
    );
    setInternalCart(updated);
    onChangeQty(item, newQty);
  };

  // Handle remove
  const handleRemove = id => {
    Animated.timing(slideAnim, {
      toValue: 10,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onRemoveItem(id);
    });
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose} />
      <Animated.View
        style={[styles.modalContainer, {transform: [{translateY: slideAnim}]}]}>
        <Text style={styles.title}>Your Cart</Text>
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
                  onChangeQty={handleChangeQty}
                  setIsCartVisible={setIsCartVisible}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 120}}
            />
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
                count={internalCart.length}
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
          </View>
        )}
      </Animated.View>
    </Modal>
  );
};

// Custom animated checkout button (replaces AnimatedCartButton)
const CustomCheckoutButton = ({
  count = 0,
  onPress,
  label = 'Proceed to Checkout',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const badgeScale = useRef(new Animated.Value(1)).current;
  const prevCount = useRef(count);

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

  // Animate badge when count changes
  useEffect(() => {
    if (prevCount.current !== count) {
      Animated.sequence([
        Animated.spring(badgeScale, {
          toValue: 1.3,
          useNativeDriver: true,
          speed: 30,
          bounciness: 10,
        }),
        Animated.spring(badgeScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 8,
        }),
      ]).start();
      prevCount.current = count;
    }
  }, [count, badgeScale]);

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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: Fonts.InterBold,
  },
  cartItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray10,
    padding: 10,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray6,
  },
  cartItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: Fonts.InterBold,
    color: Colors.black,
  },
  qtyText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.blue,
    minWidth: 24,
    fontFamily: Fonts.InterBold,
  },
  discountedPrice: {
    fontWeight: 'bold',
    fontSize: 15,
    color: Colors.red,
    marginBottom: 2,
    fontFamily: Fonts.InterBold,
  },
  originalPrice: {
    fontSize: 13,
    color: Colors.gray,
    textDecorationLine: 'line-through',
    fontFamily: Fonts.InterRegular,
  },
  deleteBtn: {
    marginTop: 8,
    alignSelf: 'flex-end',
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
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
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
    fontSize: 16,
    color: Colors.gray,
    marginTop: 18,
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
    paddingVertical: 14,
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
});

export default AnimatedCartModal;
