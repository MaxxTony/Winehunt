import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Fonts} from '../../constant/Styles';
import Entypo from 'react-native-vector-icons/Entypo';
import WineHuntButton from '../../common/WineHuntButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import {showWarning} from '../../helper/Toastify';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const Cart = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const {width} = useWindowDimensions();
  const [cartData, setCartData] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const DELIVERY_FEE = 100;

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
      (acc, item) =>
        acc + item.quantity * (item?.product?.price_mappings?.price || 0),
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
      {/* <BackNavigationWithTitle
        title="Add to cart"
        onPress={() => navigation.goBack()}
      /> */}

<View style={styles.con}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton}>
        <Icon name="chevron-back" size={20} color="black" onPress={() => navigation.goBack()} />
        <Text style={styles.text}>Add to Cart</Text>
      </TouchableOpacity>

      {/* Favorite Button */}
      <TouchableOpacity style={styles.favoriteButton}>
        <Icon name="heart-outline" size={18} color="white" />
      </TouchableOpacity>
    </View>
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
          contentContainerStyle={{gap: 5, paddingBottom: 10}}
          renderItem={({item, index}) => {
            return (
              <View style={styles.cartItemContainer} key={index}>
                <Image
                  source={
                    item?.product?.product_images[0]?.image
                      ? {uri: item?.product?.product_images[0]?.image}
                      : require('./images/cartBottle.png')
                  }
                  style={styles.bottleImage}
                  resizeMode="contain"
                />
                <View style={styles.cartDetailsContainer}>
                  <Text style={styles.itemName} allowFontScaling={false}>
                    {item?.product?.name} ({item?.product?.title})
                  </Text>
                  <Text style={styles.itemDescription} allowFontScaling={false}>
                    Best Rated this Month
                  </Text>
                  <View style={styles.priceQuantityContainer}>
                    <View style={styles.priceTag}>
                      <Text style={styles.priceText} allowFontScaling={false}>
                        ${item?.product?.price_mappings?.price}
                      </Text>
                    </View>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }>
                        <Entypo
                          name="squared-plus"
                          color={Colors.red}
                          size={25}
                        />
                      </TouchableOpacity>
                      <Text style={styles.quantityText} allowFontScaling={false}>{item?.quantity}</Text>
                      <TouchableOpacity
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
                          size={25}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
        {cartData && cartData.length > 0 ? (
          <View style={styles.couponContainer}>
            <Image
              source={require('./images/coupon.png')}
              style={styles.couponImage}
              resizeMode="contain"
            />
            <TextInput
              value={couponCode}
              onChangeText={setCouponCode}
              placeholderTextColor={Colors.gray4}
              style={styles.couponInput}
              placeholder="Enter Promo Code/ Milestone reward"
              allowFontScaling={false}
            />
            <WineHuntButton
              text="Apply"
              extraButtonStyle={[
                styles.applyButton,
                {
                  backgroundColor:
                    couponCode.length > 0 ? Colors.red : Colors.gray,
                },
              ]}
              disabled={couponCode.length === 0}
              allowFontScaling={false}
            />
          </View>
        ) : (
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: Fonts.InterMedium,
                color: Colors.black,
                fontWeight: '600',
                fontSize: 16,
              }} allowFontScaling={false}>
              Your WineHunt Cart is empty
            </Text>
          </View>
        )}
      </ScrollView>
      {cartData && cartData.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel} allowFontScaling={false}>Sub Total</Text>
            <Text style={styles.summaryValue} allowFontScaling={false}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel} allowFontScaling={false}>Delivery</Text>
            <Text style={styles.summaryValue} allowFontScaling={false}>${DELIVERY_FEE}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel} allowFontScaling={false}>Grand Total</Text>
            <Text style={styles.totalValue} allowFontScaling={false}>${grandTotal.toFixed(2)}</Text>
          </View>
          <WineHuntButton
            text="Next"
            onPress={() =>
              navigation.navigate('Payment', {
                total: grandTotal,
                cartData: cartData,
              })
            }allowFontScaling={false}
          />
        </View>
      )}
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
    gap: 20,
  },
  cartImage: {
    height: 180,
    borderRadius: 10,
  },
  cartItemContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray13,
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  bottleImage: {
    height: 75,
    width: 40,
  },
  cartDetailsContainer: {
    gap: 10,
    flex: 1,
  },
  itemName: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontWeight: '700',
    fontSize: 16,
  },
  itemDescription: {
    fontFamily: Fonts.InterMedium,
    color: Colors.gray7,
    fontWeight: '600',
    fontSize: 12,
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceTag: {
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: Colors.red,
    alignItems: 'center',
    borderRadius: 5,
  },
  priceText: {
    fontFamily: Fonts.InterMedium,
    color: Colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityText: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontWeight: '600',
    fontSize: 15,
  },
  couponContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray13,
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  couponImage: {
    height: 18,
    width: 28,
  },
  couponInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 5 : 0,
    color: Colors.black,
  },
  applyButton: {
    padding: 10,
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: '#fff',
    elevation: 8,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontWeight: '600',
    fontSize: 16,
  },
  summaryValue: {
    fontFamily: Fonts.InterMedium,
    color: Colors.gray14,
    fontWeight: '600',
    fontSize: 16,
  },
  totalLabel: {
    fontWeight: '800',
    fontSize: 17,
  },
  totalValue: {
    fontWeight: '700',
    fontSize: 16,
  },
  con: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: 'black',
    marginLeft: 5,
  },
  favoriteButton: {
    backgroundColor: '#d76a83', 
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
