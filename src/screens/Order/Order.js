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
import AnimatedCartButton from '../../components/AnimatedCartButton';

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

        // Filter orders based on type
        let filteredOrders = [];
        if (type === 'Current Order') {
          // Show orders that are NOT canceled
          filteredOrders = ordersData.filter(
            order =>
              order?.status !== 'Canceled' && order?.status !== 'canceled',
          );
        } else if (type === 'Order History') {
          // Show only canceled orders
          filteredOrders = ordersData.filter(
            order =>
              order?.status === 'Canceled' || order?.status === 'canceled',
          );
        }

        setOrders(filteredOrders);
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

  const getInvoice = async item => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl9 + 'get-invoice';
    const params = {
      order_id: item?.id,
    };
    try {
      const res = await axios.post(url, params, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res?.status === 200) {
        console.log(res?.data, 'lp');
        onDownloadInvoice(res?.data?.url);
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

  const onDownloadInvoice = async url => {
    try {
      const fileName = `invoice_${Date.now()}.pdf`;
      const downloadDest = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      const options = {
        fromUrl: url,
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
        contentContainerStyle={{paddingVertical: 20}}
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
          const getStatusColor = status => {
            switch (status?.toLowerCase()) {
              case 'canceled':
              case 'cancelled':
                return Colors.red;
              case 'rejected':
                return Colors.red;
              case 'confirmed':
                return Colors.green;
              case 'delivered':
                return Colors.blue;
              default:
                return Colors.yellow;
            }
          };

          const getStatusText = status => {
            switch (status?.toLowerCase()) {
              case 'canceled':
              case 'cancelled':
                return 'Canceled';
              case 'rejected':
                return 'Rejected';
              case 'confirmed':
                return 'Confirmed';
              case 'delivered':
                return 'Delivered';
              default:
                return status || 'Processing';
            }
          };

          // Refund request handler (placeholder)
          const handleRefundRequest = () => {
            Alert.alert(
              'Refund Request',
              'Your refund request has been sent to the vendor.',
            );
          };

          return (
            <Pressable
              style={[
                styles.cardContainer,
                // Add a green border for confirmed orders
                item.status?.toLowerCase() === 'confirmed' && {
                  borderWidth: 2,
                  borderColor: Colors.green,
                },
                item.status?.toLowerCase() === 'processing' && {
                  borderWidth: 2,
                  borderColor: Colors.yellow,
                },
                item.status?.toLowerCase() === 'canceled' && {
                  borderWidth: 2,
                  borderColor: Colors.red,
                },
              ]}
              onPress={() => navigation.navigate('OrderDetail', {item: item})}>
              {/* Header with gradient background */}
              <View style={styles.cardHeader}>
                <View style={styles.headerGradient}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderNumber}>
                      Order #{item.order_number}
                    </Text>
                    <Text style={styles.orderDate}>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            },
                          )
                        : 'Date not available'}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={[
                    styles.statusBadge,
                    {backgroundColor: getStatusColor(item.status)},
                    // Make the badge larger and more prominent for confirmed orders
                    // item.status?.toLowerCase() === 'confirmed' && { borderWidth: 2, borderColor: Colors.green, shadowColor: Colors.green, shadowOpacity: 0.3, shadowRadius: 8 },
                  ]}>
                  <Text style={styles.statusText}>
                    {getStatusText(item.status)}
                  </Text>
                </View>

                {/* Refund Button for Confirmed Orders */}
                {item.status?.toLowerCase() === 'confirmed' && (
                  <View style={styles.refundBoxContainer}>
                    <Pressable
                      style={styles.refundBox}
                      onPress={handleRefundRequest}>
                      <Text style={styles.refundBoxText}>Refund</Text>
                    </Pressable>
                  </View>
                )}
              </View>

              {/* Products Section */}
              <View style={styles.productsSection}>
                <Text style={styles.sectionTitle}>Order Items</Text>
                {item?.order_items?.map((orderItem, index) => {
                  const imageUri = orderItem?.product?.images?.[0]?.image;
                  return (
                    <View key={index} style={styles.productItem}>
                      <View style={styles.productImageContainer}>
                        <Image
                          source={{uri: imageUri}}
                          style={styles.productImage}
                          resizeMode="cover"
                        />
                        <View style={styles.quantityBadge}>
                          <Text style={styles.quantityText}>
                            {orderItem.quantity}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.productDetails}>
                        <Text style={styles.productName} numberOfLines={2}>
                          {orderItem.product_name}
                        </Text>
                        <Text style={styles.productPrice}>
                          £{orderItem.price}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Total Section */}
              <View style={styles.totalSection}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalAmount}> £{item?.amount}</Text>
                </View>
              </View>

              {/* Refund Status for Canceled/Rejected Orders */}
              {(item?.status === 'Rejected' || item?.status === 'Canceled') && (
                <View style={styles.refundSection}>
                  <View style={styles.refundBadge}>
                    <Text style={styles.refundLabel}>
                      Refund Status:
                      <Text style={styles.refundStatus}>
                        {' '}
                        {item?.refund_status || 'Pending'}
                      </Text>
                    </Text>
                  </View>
                </View>
              )}

              {/* Action Buttons for Active Orders */}
              {item?.status !== 'Rejected' &&
                item?.status !== 'Canceled' &&
                type === 'Current Order' && (
                  <View style={styles.actionButtonsContainer}>
                    <View style={styles.actionButtons}>
                      <Pressable
                        style={[styles.actionButton, styles.trackButton]}
                        onPress={() =>
                          navigation.navigate('TrackOrder', {item: item})
                        }>
                        <Text style={styles.actionButtonText}>Track Order</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.actionButton, styles.invoiceButton]}
                        onPress={() => getInvoice(item)}>
                        <Text style={styles.actionButtonText}>Get Invoice</Text>
                      </Pressable>
                    </View>
                    {item.status?.toLowerCase() !== 'confirmed' && (
                      <Pressable
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => {
                          setShowDeleteModal(true);
                          setSelectedOrder(item);
                        }}>
                        <Text style={styles.cancelButtonText}>
                          Cancel Order
                        </Text>
                      </Pressable>
                    )}
                  </View>
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
        <AnimatedCartButton
          count={cartData.length}
          onPress={() => setIsCartVisible(true)}
          label="View Cart"
        />
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
    backgroundColor: Colors.gray6,
  },
  backNavigationExtraStyle: {
    borderBottomWidth: 0,
  },
  switchContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: Colors.gray5,
    backgroundColor: Colors.white,
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
    borderColor: Colors.gray5,
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
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: {width: 0, height: 6},
    shadowRadius: 12,
    borderWidth: 0,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: Colors.gray6,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray5,
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderInfo: {
    flexDirection: 'column',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: Colors.gray4,
    fontWeight: '500',
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    minWidth: 90,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
    margin: 10,
    alignSelf: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productsSection: {
    padding: 16,
    paddingVertical: 0,
    backgroundColor: Colors.white,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: Colors.gray6,
    borderRadius: 12,
  },
  productImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  productImage: {
    width: 80,
    height: 100,
    borderRadius: 10,
    backgroundColor: Colors.gray5,
  },
  quantityBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.blue,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  quantityText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.white,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 6,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.red,
  },
  totalSection: {
    padding: 16,
    backgroundColor: Colors.gray6,
    borderTopWidth: 1,
    borderTopColor: Colors.gray5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontWeight: '600',
    fontSize: 16,
    color: Colors.primary,
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 20,
    color: Colors.blue,
  },
  refundSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.gray6,
  },
  refundBadge: {
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: Colors.lightPink,
    borderWidth: 1,
    borderColor: Colors.red,
    alignItems: 'center',
  },
  refundLabel: {
    fontWeight: '600',
    fontSize: 14,
    color: Colors.red,
  },
  refundStatus: {
    color: Colors.red,
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontWeight: '600',
    fontSize: 14,
    color: Colors.white,
  },
  trackButton: {
    backgroundColor: Colors.blue,
  },
  invoiceButton: {
    backgroundColor: Colors.green,
  },
  cancelButton: {
    backgroundColor: Colors.red,
    width: '100%',
  },
  cancelButtonText: {
    fontWeight: '600',
    fontSize: 14,
    color: Colors.white,
  },
  refundBoxContainer: {
    alignItems: 'flex-end',
    marginRight: 10,
    // marginBottom: 8,
  },
  refundBox: {
    backgroundColor: Colors.blue,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.blue,
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  refundBoxText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
