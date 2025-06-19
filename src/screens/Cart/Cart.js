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
                  <Text style={styles.itemNamePro} numberOfLines={1} allowFontScaling={false}>
                    {item?.product?.name}
                  </Text>
                  <Text style={styles.itemDescriptionPro} numberOfLines={1} allowFontScaling={false}>
                    {item?.product?.product_desc || item?.product?.title}
                  </Text>
                  <View style={styles.priceQuantityRow}>
                    <Text style={styles.priceTextPro} allowFontScaling={false}>
                      £ {parseFloat(item?.product?.price).toFixed(2)}
                    </Text>
                    <View style={styles.quantityControlPro}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Entypo name="squared-plus" color={Colors.red} size={22} />
                      </TouchableOpacity>
                      <Text style={styles.quantityTextPro} allowFontScaling={false}>
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
                        <Entypo name="squared-minus" color={Colors.red} size={22} />
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
          <View style={styles.couponContainerPro}>
            <Image
              source={require('./images/coupon.png')}
              style={styles.couponImage}
              resizeMode="contain"
            />
            <TextInput
              value={couponCode}
              onChangeText={setCouponCode}
              placeholderTextColor={Colors.gray4}
              style={styles.couponInputPro}
              placeholder="Enter Promo Code/ Milestone reward"
            />
            <WineHuntButton
              text="Apply"
              extraButtonStyle={[
                styles.applyButtonPro,
                {
                  backgroundColor:
                    couponCode.length > 0 ? Colors.red : Colors.gray,
                },
              ]}
              disabled={couponCode.length === 0}
            />
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
  couponContainerPro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    padding: 12,
    gap: 10,
    marginTop: 8,
  },
  couponImage: {
    height: 22,
    width: 32,
  },
  couponInputPro: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 7 : 0,
    color: Colors.black,
    fontSize: 15,
    fontFamily: Fonts.InterMedium,
    backgroundColor: Colors.gray13,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 4,
  },
  applyButtonPro: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
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
});
