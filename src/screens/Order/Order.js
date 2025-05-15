import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Fonts} from '../../constant/Styles';
import {MultiSwitch} from 'react-native-multiswitch-selector';
import Constants from '../../helper/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {showWarning} from '../../helper/Toastify';

const Order = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const [type, setType] = useState('Current Order');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders();
  }, [type]);

  const getOrders = async () => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl9 + Constants.getOrders;
    setLoading(true);

    const body = type === 'Current Order' ? {status: 1} : undefined;

    try {
      const res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res?.status === 200) {
        const ordersData = res?.data?.response?.data || [];

        // If you want to display one card per order
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
                <Text
                  style={{
                    padding: 8,
                    backgroundColor: Colors.green2,
                    borderRadius: 40,
                    paddingHorizontal: 16,
                    fontSize: 14,
                    color: Colors.white,
                    fontWeight: '600',
                  }}>
                  {item?.status}
                </Text>
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
                  justifyContent: 'flex-end',
                  marginTop: 10,
                  gap: 50,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: Colors.black,
                  }}>
                  Total
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: Colors.blue,
                  }}>
                  £
                  {item?.order_items
                    ?.reduce((sum, i) => {
                      const price = parseFloat(i.price) || 0;
                      const qty = parseInt(i.quantity) || 0;
                      return sum + price * qty;
                    }, 0)
                    .toFixed(2)}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
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
