import {
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Fonts} from '../../constant/Styles';
import Entypo from 'react-native-vector-icons/Entypo';
import WineHuntButton from '../../common/WineHuntButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import {showWarning} from '../../helper/Toastify';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProfile} from '../../redux/slices/profileSlice';

const Cart = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const {width} = useWindowDimensions();
  const [cartData, setCartData] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const DELIVERY_FEE = 100;
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.profile);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfile());
    }, [dispatch]),
  );

  useEffect(() => {
    if (isFocused) getCartData();
  }, [isFocused]);

  const getCartData = async () => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl8 + Constants.getCart;
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setCartData(res?.data?.cart);
    } catch (error) {
      showWarning(error.response?.data?.message || 'Error fetching cart');
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl8 + Constants.updateCart;
    const data = {
      id: productId,
      quantity: newQuantity,
    };
    try {
      const res = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res?.data?.status == 200) {
        getCartData();
      }
    } catch (error) {
      console.log(error);
      showWarning(error.response?.data?.message || 'Error updating cart');
    }
  };

  const calculateSubtotal = () => {
    if (!Array.isArray(cartData)) return 0;
    return cartData.reduce(
      (acc, item) => acc + item.quantity * (item?.product?.price || 0),
      0,
    );
  };

  const subtotal = calculateSubtotal();
  const grandTotal = subtotal + DELIVERY_FEE;

  const deleteCart = async productId => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl8 + Constants.deleteCart;
    const data = {
      id: productId,
    };
    try {
      const res = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res?.data?.status == 200) {
        getCartData();
      }
    } catch (error) {
      console.log(error);
      showWarning(error.response?.data?.message || 'Error updating cart');
    }
  };

  // Simulate promo code validation (replace with real API if available)
  const validatePromoCode = async code => {
    setCouponLoading(true);
    setCouponError('');
    setCouponApplied(false);
    // Simulate API delay
    await new Promise(res => setTimeout(res, 800));
    // Example: only 'WINE10' is valid
    if (code.trim().toUpperCase() === 'WINE10') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid promo code');
      setCouponApplied(false);
    }
    setCouponLoading(false);
  };

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Add to cart"
        onPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <Image
          source={require('./images/cartBG.png')}
          style={[styles.cartImage, {width: width - 40}]}
        />
        <FlatList
          data={cartData}
          scrollEnabled={false}
          contentContainerStyle={{gap: 16, paddingBottom: 10}}
          renderItem={({item, index}) => {
            return (
              <View style={styles.cartItemCard} key={index}>
                <Pressable
                  style={styles.imageWrapper}
                  onPress={() => {
                    navigation.navigate('VendorDetail', {
                      item: item,
                      userCoordinates: {
                        latitude: userData?.latitude,
                        longitude: userData?.longitude,
                      },
                    });
                  }}>
                  <Image
                    source={
                      item?.product?.product_images[0]?.image
                        ? {uri: item?.product?.product_images[0]?.image}
                        : require('./images/cartBottle.png')
                    }
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                </Pressable>
                <View style={styles.cartDetailsContainerPro}>
                  <Text
                    style={styles.itemNamePro}
                    numberOfLines={1}
                    allowFontScaling={false}>
                    {item?.product?.name}
                  </Text>
                  <Text
                    style={styles.itemDescriptionPro}
                    numberOfLines={1}
                    allowFontScaling={false}>
                    {item?.product?.product_desc || item?.product?.title}
                  </Text>
                  <View style={styles.priceQuantityRow}>
                    <Text style={styles.priceTextPro} allowFontScaling={false}>
                      £ {parseFloat(item?.product?.price).toFixed(2)}
                    </Text>
                    <View style={styles.quantityControlPro}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }>
                        <Entypo
                          name="squared-plus"
                          color={Colors.red}
                          size={22}
                        />
                      </TouchableOpacity>
                      <Text
                        style={styles.quantityTextPro}
                        allowFontScaling={false}>
                        {item?.quantity}
                      </Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => {
                          if (item?.quantity == 1) {
                            deleteCart(item?.id);
                          } else {
                            updateQuantity(item.id, item.quantity - 1);
                          }
                        }}>
                        <Entypo
                          name="squared-minus"
                          color={Colors.red}
                          size={22}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deleteCart(item?.id)}>
                  <Entypo name="trash" color={Colors.gray7} size={20} />
                </TouchableOpacity>
              </View>
            );
          }}
        />
        {cartData && cartData.length > 0 ? (
          <View style={styles.promoCardContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <View style={styles.promoIconCircle}>
                <Entypo name="ticket" size={24} color={Colors.white} />
              </View>
              <TextInput
                value={couponCode}
                onChangeText={text => {
                  setCouponCode(text);
                  setCouponError('');
                  setCouponApplied(false);
                }}
                placeholder="Promo or milestone code"
                placeholderTextColor={Colors.gray4}
                style={styles.promoInput}
                editable={!couponLoading}
              />
              {couponApplied && (
                <TouchableOpacity
                  onPress={() => {
                    setCouponCode('');
                    setCouponApplied(false);
                    setCouponError('');
                  }}
                  style={{marginLeft: 8, padding: 4}}>
                  <Entypo name="cross" size={20} color={Colors.gray7} />
                </TouchableOpacity>
              )}
            </View>
            <WineHuntButton
              text={couponLoading ? '...' : couponApplied ? '✓' : 'Apply'}
              extraButtonStyle={[
                styles.promoApplyBtn,
                {
                  backgroundColor:
                    couponCode.length > 0 && !couponApplied
                      ? Colors.red
                      : Colors.gray,
                  opacity: couponLoading ? 0.7 : 1,
                },
              ]}
              extraTextStyle={{fontSize: 15, paddingHorizontal: 0}}
              disabled={
                couponCode.length === 0 || couponLoading || couponApplied
              }
              onPress={() => validatePromoCode(couponCode)}
            />
            {couponError ? (
              <View style={styles.promoMsgPillError}>
                <Entypo
                  name="circle-with-cross"
                  size={15}
                  color={Colors.white}
                  style={{marginRight: 4}}
                />
                <Text style={styles.promoMsgPillText}>{couponError}</Text>
              </View>
            ) : couponApplied ? (
              <View style={styles.promoMsgPillSuccess}>
                <Entypo
                  name="check"
                  size={15}
                  color={Colors.white}
                  style={{marginRight: 4}}
                />
                <Text style={styles.promoMsgPillText}>Promo code applied!</Text>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.emptyCartContainer}>
            <Image
              source={require('./images/cartBottle.png')}
              style={styles.emptyCartImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyCartText} allowFontScaling={false}>
              Your WineHunt Cart is empty
            </Text>
          </View>
        )}

        {cartData && cartData.length > 0 && (
          <View style={styles.summaryContainerPro}>
            <View style={styles.summaryRowPro}>
              <Text style={styles.summaryLabelPro} allowFontScaling={false}>
                Sub Total
              </Text>
              <Text style={styles.summaryValuePro} allowFontScaling={false}>
                £ {subtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRowPro}>
              <Text style={styles.summaryLabelPro} allowFontScaling={false}>
                Delivery
              </Text>
              <Text style={styles.summaryValuePro} allowFontScaling={false}>
                £ {DELIVERY_FEE}
              </Text>
            </View>
            <View style={styles.summaryRowPro}>
              <Text style={styles.totalLabelPro} allowFontScaling={false}>
                Grand Total
              </Text>
              <Text style={styles.totalValuePro} allowFontScaling={false}>
                £ {grandTotal.toFixed(2)}
              </Text>
            </View>
            <WineHuntButton
              text="Next"
              onPress={() =>
                navigation.navigate('Payment', {
                  total: grandTotal,
                  cartData: cartData,
                  vendorId: cartData?.[0]?.product?.user_id,
                })
              }
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100,
    gap: 24,
  },
  cartImage: {
    height: 180,
    borderRadius: 16,
    marginBottom: 8,
  },
  cartItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 0,
    padding: 16,
    gap: 16,
    position: 'relative',
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.gray13,
    height: 80,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    height: 80,
    width: 60,
    borderRadius: 12,
  },
  cartDetailsContainerPro: {
    flex: 1,
    gap: 6,
    justifyContent: 'center',
  },
  itemNamePro: {
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 2,
  },
  itemDescriptionPro: {
    fontFamily: Fonts.InterMedium,
    color: Colors.gray7,
    fontWeight: '500',
    fontSize: 13,
    marginBottom: 2,
  },
  priceQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  priceTextPro: {
    fontFamily: Fonts.InterBold,
    color: Colors.red,
    fontWeight: '700',
    fontSize: 15,
  },
  quantityControlPro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray13,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 8,
  },
  qtyBtn: {
    padding: 2,
    borderRadius: 16,
  },
  quantityTextPro: {
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    fontWeight: '700',
    fontSize: 15,
    minWidth: 24,
    textAlign: 'center',
  },
  deleteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 4,
    borderRadius: 12,
    backgroundColor: Colors.gray13,
  },
  summaryContainerPro: {
    marginTop: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    gap: 14,
  },
  summaryRowPro: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  summaryLabelPro: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontWeight: '600',
    fontSize: 16,
  },
  summaryValuePro: {
    fontFamily: Fonts.InterMedium,
    color: Colors.gray14,
    fontWeight: '600',
    fontSize: 16,
  },
  totalLabelPro: {
    fontWeight: '900',
    fontSize: 18,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
  },
  totalValuePro: {
    fontWeight: '900',
    fontSize: 18,
    color: Colors.red,
    fontFamily: Fonts.InterBold,
  },
  emptyCartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  emptyCartImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
    opacity: 0.5,
  },
  emptyCartText: {
    fontFamily: Fonts.InterMedium,
    color: Colors.gray7,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  promoCardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    padding: 16,
    marginTop: 8,
    marginBottom: 4,
    gap: 10,
  },
  promoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },

  promoInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
    backgroundColor: Colors.gray13,
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  promoApplyBtn: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 4,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'transparent',
    elevation: 0,
  },
  promoMsgPillError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.red,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
    alignSelf: 'center',
    minHeight: 28,
  },
  promoMsgPillSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.green,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
    alignSelf: 'center',
    minHeight: 28,
  },
  promoMsgPillText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
  },
});
