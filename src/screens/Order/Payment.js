import React, {useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors, Fonts} from '../../constant/Styles';
import WineHuntButton from '../../common/WineHuntButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import axios from 'axios';
import {showWarning} from '../../helper/Toastify';

const Payment = props => {
  const total = props?.route?.params?.total;
  const cartData = props?.route?.params?.cartData;
  const vendorId = props?.route?.params?.vendorId;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused();

  // Calculate order summary with delivery fees
  const orderSummary = useMemo(() => {
    if (!cartData) return null;

    const subtotal = cartData.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
    const deliveryFee = 100; // Fixed delivery fee

    // Calculate total savings from discounts
    const totalSavings = cartData.reduce((sum, item) => {
      const product = item.product;
      const actualPrice = product.actual_price || product.price;
      const discountedPrice = product.price;
      const savingsPerItem = actualPrice - discountedPrice;
      return sum + savingsPerItem * item.quantity;
    }, 0);

    const total = subtotal + deliveryFee;

    return {
      subtotal: subtotal.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      total: total.toFixed(2),
      totalItems,
      totalSavings: totalSavings.toFixed(2),
    };
  }, [cartData]);

  // Fetch addresses on focus
  useEffect(() => {
    getAddress();
  }, [isFocused]);

  // Fetch user addresses from API
  const getAddress = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AsyncStorage.getItem('userDetail');
      const userInfo = JSON.parse(data);
      const token = userInfo?.token;
      const url = Constants.baseUrl10 + Constants.getAddress;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res?.status === 200) {
        const addresstype = res?.data?.address.map(item => ({
          id: item.id,
          name: 'Home',
          address: `${item.block}, ${item.street}, ${item.city}, ${item.state_name}, ${item.zip_code}, ${item.country_name}`,
        }));

        const allAddresses = addresstype;

        setAddressList(allAddresses);
        setSelectedAddress(allAddresses[0] || null);
      }
    } catch (error) {
      setError('Failed to fetch addresses.');

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


  // Render address option
  const renderAddressOption = ({item}) => (
    <TouchableOpacity
      style={[
        styles.addressCard,
        item.id === selectedAddress?.id && styles.selectedAddressCard,
      ]}
      onPress={() => setSelectedAddress(item)}
      accessibilityLabel={`Select address: ${item.address}`}
      activeOpacity={0.8}>
      <View style={styles.addressHeader}>
        <View style={styles.addressIconContainer}>
          <Text style={styles.addressIcon}>📍</Text>
        </View>
        <View style={styles.addressInfo}>
          <View style={styles.addressTitleRow}>
            <Text style={styles.addressName} allowFontScaling={false}>
              {item.name}
            </Text>
          </View>
          <Text style={styles.addressText} allowFontScaling={false}>
            {item.address}
          </Text>
        </View>
        <View
          style={[
            styles.radioButton,
            item.id === selectedAddress?.id && styles.radioButtonSelected,
          ]}>
          {item.id === selectedAddress?.id && <View style={styles.radioDot} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Main render
  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <BackNavigationWithTitle
        title="Payment & Checkout"
        onPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Order Summary Section */}
        <View style={styles.orderSummaryCard}>
          <View style={styles.orderSummaryHeader}>
            <Text style={styles.sectionTitle} allowFontScaling={false}>
              Order Summary
            </Text>
            <View style={styles.itemCountBadge}>
              <Text style={styles.itemCountText} allowFontScaling={false}>
                {orderSummary?.totalItems || 0} items
              </Text>
            </View>
          </View>
          <View style={styles.orderItemsContainer}>
            {cartData?.map((item, index) => {
             
              const product = item.product;
              const actualPrice = product.actual_price || product.price;
              const discountedPrice = product.price;
              const savingsPerItem = actualPrice - discountedPrice;
              const totalSavings = savingsPerItem * item.quantity;
              const itemTotal = discountedPrice * item.quantity;

              return (
                <View key={index} style={styles.orderItem}>
                  <Image
                    source={{uri: product.product_images[0]?.image}}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                  <View style={styles.productInfo}>
                    <View style={styles.productHeader}>
                      <Text style={styles.productName} allowFontScaling={false}>
                        {product.name}
                      </Text>
                      {product.has_offer && product.offer_discount && (
                        <View style={styles.offerBadge}>
                          <Text
                            style={styles.offerText}
                            allowFontScaling={false}>
                            +{product.offer_discount}% OFF
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.priceContainer}>
                      <View style={styles.priceRow}>
                        <Text
                          style={styles.actualPrice}
                          allowFontScaling={false}>
                          £{discountedPrice}
                        </Text>
                        <Text
                          style={styles.discountedPrice}
                          allowFontScaling={false}>
                          £{actualPrice}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.quantityContainer}>
                      <View style={styles.quantityBadge}>
                        <Text
                          style={styles.quantityText}
                          allowFontScaling={false}>
                          Qty: {item.quantity}
                        </Text>
                      </View>
                      {totalSavings > 0 && (
                        <View style={styles.savingsBadge}>
                          <Text
                            style={styles.savingsText}
                            allowFontScaling={false}>
                            Save £{totalSavings.toFixed(2)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.itemTotal}>
                    <Text style={styles.itemTotalText} allowFontScaling={false}>
                      £{itemTotal.toFixed(2)}
                    </Text>
                    <Text
                      style={styles.itemTotalLabel}
                      allowFontScaling={false}>
                      Total
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle} allowFontScaling={false}>
            Payment Method
          </Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <View style={styles.paymentIconContainer}>
                <Text style={styles.paymentIcon}>💳</Text>
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName} allowFontScaling={false}>
                  Credit Card
                </Text>
                <Text
                  style={styles.paymentDescription}
                  allowFontScaling={false}>
                  Secure payment with your credit card
                </Text>
              </View>
              <View style={styles.radioButton}>
                <View style={styles.radioDot} />
              </View>
            </View>
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle} allowFontScaling={false}>
            Shipping Address
          </Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText} allowFontScaling={false}>
                Loading addresses...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>⚠️</Text>
              <Text style={styles.emptyText} allowFontScaling={false}>
                {error}
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={getAddress}
                accessibilityLabel="Retry fetching addresses">
                <Text style={styles.addButtonText} allowFontScaling={false}>
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          ) : addressList?.length > 0 ? (
            <FlatList
              data={addressList}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              renderItem={renderAddressOption}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📍</Text>
              <Text style={styles.emptyText} allowFontScaling={false}>
                No address found.
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddressList')}
                accessibilityLabel="Add new address">
                <Text style={styles.addButtonText} allowFontScaling={false}>
                  + Add Address
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Price Breakdown */}
        {orderSummary && (
          <View style={styles.priceBreakdownCard}>
            <Text style={styles.sectionTitle} allowFontScaling={false}>
              Price Breakdown
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel} allowFontScaling={false}>
                Subtotal ({orderSummary.totalItems} items)
              </Text>
              <Text style={styles.priceValue} allowFontScaling={false}>
                £{orderSummary.subtotal}
              </Text>
            </View>
            {parseFloat(orderSummary.totalSavings) > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.savingsLabel} allowFontScaling={false}>
                  Total Savings
                </Text>
                <Text style={styles.savingsValue} allowFontScaling={false}>
                  -£{orderSummary.totalSavings}
                </Text>
              </View>
            )}
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel} allowFontScaling={false}>
                Delivery Fee
              </Text>
              <Text style={styles.priceValue} allowFontScaling={false}>
                £{orderSummary.deliveryFee}
              </Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel} allowFontScaling={false}>
                Total
              </Text>
              <Text style={styles.totalValue} allowFontScaling={false}>
                £{orderSummary.total}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Checkout Button */}
      <View style={styles.stickyFooter}>
        <View style={styles.footerContent}>
          <View style={styles.footerSummary}>
            <View style={styles.totalSection}>
              <Text style={styles.footerTotalLabel} allowFontScaling={false}>
                Total Amount To Be Paid:
              </Text>
              <Text style={styles.footerTotalValue} allowFontScaling={false}>
                £{orderSummary?.total || total?.toFixed(2)}
              </Text>
            </View>
          </View>
          <WineHuntButton
            text="Proceed to Checkout"
            onPress={() => {
              const data = {
                paymentType: {id: 1, name: 'Credit Card'},
                address: selectedAddress,
                amount: orderSummary?.total || total?.toFixed(2),
                cartData: cartData,
                vendorId: vendorId,
                orderSummary: orderSummary,
              };
              if (addressList?.length > 0 && selectedAddress) {
                navigation.navigate('Checkout', {data});
              } else {
                showWarning('Please add an address');
              }
            }}
            accessibilityLabel="Proceed to checkout"
          />
        </View>
      </View>
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray6,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 200,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  orderSummaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderSummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemCountBadge: {
    backgroundColor: Colors.lightPink,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  itemCountText: {
    fontFamily: Fonts.InterBold,
    color: Colors.primary,
    fontSize: 14,
  },
  orderItemsContainer: {
    marginTop: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray5,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontFamily: Fonts.InterBold,
    fontSize: 16,
    color: Colors.black,
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: Colors.lightPink,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    fontFamily: Fonts.InterBold,
    color: Colors.primary,
    fontSize: 12,
  },
  productTitle: {
    fontFamily: Fonts.InterRegular,
    fontSize: 14,
    color: Colors.gray14,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  actualPrice: {
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    fontSize: 14,
  },
  discountedPrice: {
    fontFamily: Fonts.InterMedium,
    color: Colors.gray9,
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  offerBadge: {
    backgroundColor: Colors.lightGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offerText: {
    fontFamily: Fonts.InterBold,
    color: Colors.green,
    fontSize: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityBadge: {
    backgroundColor: Colors.lightBlue,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  quantityText: {
    fontFamily: Fonts.InterBold,
    color: Colors.blue,
    fontSize: 12,
  },
  savingsBadge: {
    backgroundColor: Colors.lightYellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  savingsText: {
    fontFamily: Fonts.InterBold,
    color: Colors.yellow,
    fontSize: 12,
  },
  itemTotal: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  itemTotalText: {
    fontFamily: Fonts.InterBold,
    fontSize: 18,
    color: Colors.black,
  },
  itemTotalLabel: {
    fontFamily: Fonts.InterRegular,
    color: Colors.gray14,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: Fonts.PhilosopherBold,
    color: Colors.black,
    fontSize: 20,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  listContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  paymentCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentIcon: {
    fontSize: 20,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    fontSize: 16,
    marginBottom: 2,
  },
  paymentDescription: {
    fontFamily: Fonts.InterRegular,
    color: Colors.gray14,
    fontSize: 13,
  },
  radioButton: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.gray5,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  addressCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selectedAddressCard: {
    backgroundColor: Colors.lightPink,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressIcon: {
    fontSize: 18,
  },
  addressInfo: {
    flex: 1,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressName: {
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    fontSize: 16,
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: Colors.green,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontFamily: Fonts.InterBold,
    color: Colors.white,
    fontSize: 10,
  },
  addressText: {
    fontFamily: Fonts.InterRegular,
    color: Colors.gray14,
    fontSize: 14,
    lineHeight: 20,
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    elevation: 1,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray14,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: Fonts.InterMedium,
  },
  addButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Fonts.InterBold,
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  loadingText: {
    marginTop: 12,
    fontFamily: Fonts.InterMedium,
    color: Colors.gray14,
    fontSize: 14,
  },
  priceBreakdownCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    fontFamily: Fonts.InterRegular,
    color: Colors.gray14,
    fontSize: 14,
  },
  priceValue: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontSize: 14,
  },
  savingsLabel: {
    fontFamily: Fonts.InterRegular,
    color: Colors.gray14,
    fontSize: 14,
  },
  savingsValue: {
    fontFamily: Fonts.InterMedium,
    color: Colors.red,
    fontSize: 14,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray5,
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    fontSize: 16,
  },
  totalValue: {
    fontFamily: Fonts.InterBold,
    color: Colors.primary,
    fontSize: 18,
  },
  stickyFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderColor: Colors.gray5,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  footerContent: {
    padding: 20,
    paddingBottom: 20,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  footerTotalLabel: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontSize: 16,
  },
  footerTotalValue: {
    fontFamily: Fonts.InterBold,
    color: Colors.primary,
    fontSize: 20,
  },
  footerSummary: {
    marginBottom: 0,
  },
  savingsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  footerSavingsLabel: {
    fontFamily: Fonts.InterMedium,
    color: Colors.gray14,
    fontSize: 14,
  },
  footerSavingsValue: {
    fontFamily: Fonts.InterBold,
    color: Colors.red,
    fontSize: 16,
  },
});
