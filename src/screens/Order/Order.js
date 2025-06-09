import {
  Alert,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Fonts} from '../../constant/Styles';
import {MultiSwitch} from 'react-native-multiswitch-selector';
import Constants from '../../helper/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {showError, showSucess, showWarning} from '../../helper/Toastify';
import CancelOrderModal from '../../Modal/CancelOrderModal';
import RNFS from 'react-native-fs';
import AnimatedCartModal from '../Home/components/AnimatedCartModal';

const Order = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const [type, setType] = useState('Current Order');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showDelteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [cartData, setCartData] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  useEffect(() => {
    getOrders();
  }, [type, isFocused]);

  const getOrders = async () => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl9 + Constants.getOrders;
    setLoading(true);
    try {
      const res = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (res?.status === 200) {
        const ordersData = res?.data?.response?.data || [];
        setOrders(ordersData);
      }
    } catch (error) {
      if (error.response) {
        console.log('Server Error:', error.response.data);
        showWarning(error.response.data?.message);
      } else if (error.request) {
        console.log('No Response:', error.request);
      } else {
        console.log('Request Error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl9 + 'cancel-order';
    const body = {
      order_id: selectedOrder?.id,
      // status: 2,
    };

    try {
      const res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res?.status === 200) {
        console.log(JSON.stringify(res?.data), 'lp');
        showSucess('order cancelled successfully');
        setShowDeleteModal(false);
        getOrders();
      }
    } catch (error) {
      if (error.response) {
        console.log('Server Error:', error.response.data);
        showWarning(error.response.data?.message);
      } else if (error.request) {
        console.log('No Response:', error.request);
      } else {
        console.log('Request Error:', error.message);
      }
    }
  };

  const onDownloadInvoice = async () => {
    try {
      const fileName = `invoice_${Date.now()}.pdf`;
      const downloadDest = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      const options = {
        fromUrl: 'https://www.wmaccess.com/downloads/sample-invoice.pdf',
        toFile: downloadDest,
      };
      const result = await RNFS.downloadFile(options).promise;
      if (result.statusCode === 200) {
        showSucess('Invoice downloaded successfully!');
      } else {
        showError('Download failed.');
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

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

  const handleRemoveItem = async itemId => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl8 + Constants.deleteCart;
    const data = {
      id: itemId,
    };
    try {
      const res = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res?.data?.status == 200) {
        // setCartData(prev => prev.filter(item => item.id !== itemId));
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
        title="Order"
        onPress={() => navigation.goBack()}
        extraStyle={styles.backNavigationExtraStyle}
      />
      <View style={styles.switchContainer}>
        <MultiSwitch
          allStates={['Current Order', 'Order History']}
          currentState={type}
          changeState={setType}
          mode="white"
          styleRoot={styles.multiSwitchRoot}
          styleAllStatesContainer={styles.multiSwitchContainer}
          styleActiveState={styles.activeState}
          styleActiveStateText={styles.activeStateText}
          styleInactiveStateText={styles.inactiveStateText}
        />
      </View>

      <FlatList
        contentContainerStyle={{padding: 20, gap: 10}}
        data={orders}
        onRefresh={getOrders}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          !loading ? (
            <View style={{alignItems: 'center', marginTop: 50}}>
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.gray4,
                  fontWeight: '500',
                }}>
                No orders found
              </Text>
            </View>
          ) : null
        }
        renderItem={({item}) => {
          return (
            <Pressable
              style={styles.cardContainer}
              onPress={() => navigation.navigate('OrderDetail', {item: item})}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: Colors.black,
                    marginBottom: 10,
                  }}>
                  Order ID: {item.id}
                </Text>
                {item?.status === 'Rejected' ||
                item?.status === 'Canceled' ||
                item?.status === 'Confirmed' ? (
                  <Text
                    style={{
                      padding: 8,
                      backgroundColor: Colors.red2,
                      borderRadius: 40,
                      paddingHorizontal: 20,
                      fontSize: 14,
                      color: Colors.white,
                      fontWeight: '600',
                    }}>
                    {item?.status}
                  </Text>
                ) : type === 'Order History' ? (
                  <Text
                    style={{
                      padding: 8,
                      backgroundColor: Colors.blue,
                      borderRadius: 40,
                      paddingHorizontal: 20,
                      fontSize: 14,
                      color: Colors.white,
                      fontWeight: '600',
                    }}>
                    {item?.status}
                  </Text>
                ) : (
                  <Text
                    style={{
                      padding: 8,
                      backgroundColor: Colors.green2,
                      borderRadius: 40,
                      paddingHorizontal: 20,
                      fontSize: 14,
                      color: Colors.white,
                      fontWeight: '600',
                    }}
                    onPress={() => {
                      setShowDeleteModal(true);
                      setSelectedOrder(item);
                    }}>
                    Cancel Order
                  </Text>
                )}
              </View>
              {item &&
                item?.order_items &&
                item?.order_items.map((orderItem, index) => {
                  const imageUri = orderItem?.product?.images?.[0]?.image;
                  return (
                    <View key={index} style={styles.topSection}>
                      <Image
                        source={{uri: imageUri}}
                        style={styles.productImage}
                        resizeMode="contain"
                      />
                      <View style={styles.middleSection}>
                        <Text style={styles.productName} numberOfLines={1}>
                          {orderItem.product_name}
                        </Text>
                        <Text style={styles.productSize}>
                          Size: {orderItem.size}
                        </Text>
                        <Text style={styles.productSize}>
                          Qty: {orderItem.quantity}
                        </Text>
                      </View>
                      <View style={styles.rightSection}>
                        <Text style={styles.priceText}>£{orderItem.price}</Text>
                      </View>
                    </View>
                  );
                })}
              <View
                style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: Colors.gray11,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                {item?.status === 'Rejected' ||
                  (item?.status === 'Canceled' && (
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 16,
                        color: Colors.black,
                      }}>
                      Refund Status: <Text style={{ color: Colors.red2}}>{item?.refund_status}</Text>
                    </Text>
                  ))}

                {/* Right: Total and Amount */}
                <View style={{flexDirection: 'row', gap: 8}}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 16,
                      color: Colors.black,
                    }}>
                    Total:
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 16,
                      color: Colors.black,
                    }}>
                    ₹{item?.amount}
                  </Text>
                </View>
              </View>
              {item?.status !== 'Rejected' &&
                type !== 'Order History' &&
                item?.status !== 'Canceled' && (
                  <>
                    <View
                      style={{
                        height: 1,
                        width: '100%',
                        backgroundColor: Colors.gray11,
                      }}
                    />
                    <View
                      style={{
                        padding: 10,
                        flexDirection: 'row',
                        gap: 10,
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 16,
                          color: Colors.red,
                          textDecorationLine: 'underline',
                        }}
                        onPress={() =>
                          navigation.navigate('TrackOrder', {item: item})
                        }>
                        Track Order
                      </Text>
                      <View
                        style={{
                          height: 20,
                          width: 2,
                          backgroundColor: Colors.gray4,
                        }}
                      />
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 16,
                          color: Colors.red,
                          textDecorationLine: 'underline',
                        }}
                        onPress={() => onDownloadInvoice()}>
                        Get Invoice
                      </Text>
                    </View>
                  </>
                )}
            </Pressable>
          );
        }}
      />

      <CancelOrderModal
        isVisible={showDelteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete()}
      />

        {cartData?.length > 0 && (
        <Pressable
          style={{
            position: 'absolute',
            bottom: 20,
            alignSelf: 'center',
            width: '60%',
            paddingVertical: 12,
            backgroundColor: Colors.blue,
            borderRadius: 25,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
          }}
          onPress={() => setIsCartVisible(true)}>
          <Text
            style={{
              color: Colors.white,
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            View Cart ({cartData.length} items)
          </Text>
        </Pressable>
      )}

      {cartData?.length > 0 && (
        <AnimatedCartModal
          visible={isCartVisible}
                    setIsCartVisible={setIsCartVisible}
          cartData={cartData}
          onClose={() => setIsCartVisible(false)}
          navigation={navigation}
          onRemoveItem={handleRemoveItem}
        />
      )}
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backNavigationExtraStyle: {
    borderBottomWidth: 0,
  },
  switchContainer: {
    padding: 20,
    borderBottomWidth: 2,
    borderColor: Colors.gray2,
  },
  multiSwitchRoot: {
    borderRadius: 50,
    padding: 0,
    height: 50,
  },
  multiSwitchContainer: {
    backgroundColor: Colors.gray6,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#E6EBF1',
  },
  activeState: {
    backgroundColor: Colors.blue,
    borderRadius: 50,
  },
  activeStateText: {
    fontFamily: Fonts.InterRegular,
    color: Colors.white,
    fontWeight: '500',
    fontSize: 14,
  },
  inactiveStateText: {
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
    fontSize: 14,
  },

  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  productSize: {
    fontSize: 13,
    color: '#555',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 5,
  },
  cancelButton: {
    backgroundColor: Colors.blue,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  refundText: {
    color: Colors.blue,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  priceText: {
    color: '#A62222',
    fontWeight: '700',
    fontSize: 16,
  },
});
