import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
import {useFocusEffect, useIsFocused, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors, Fonts} from '../../constant/Styles';
import WineHuntButton from '../../common/WineHuntButton';
import {fetchProfile} from '../../redux/slices/profileSlice';
import {useDispatch, useSelector} from 'react-redux';
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
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.profile);
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused();

  // Memoize payment types for performance
  const paymentTypes = useMemo(() => [
    {id: 1, name: 'Credit Card', image: require('./images/c1.png')},
    // Add more payment types here if needed
  ], []);
  const [selectedPayment, setSelectedPayment] = useState(paymentTypes[0]);

  // Fetch addresses on focus
  useEffect(() => {
    getAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const addresstype = res?.data?.address.map((item) => ({
          id: item.id,
          name: 'Home',
          address: `${item.block}, ${item.street}, ${item.city}, ${item.state_name}, ${item.zip_code}, ${item.country_name}`,
        }));
        setAddressList(addresstype);
        setSelectedAddress(addresstype[0] || null);
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

  // Refresh profile on focus
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfile());
    }, [dispatch]),
  );

  // Render payment method option
  const renderPaymentOption = ({item}) => (
    <TouchableOpacity
      style={[
        styles.card,
        styles.paymentOption,
        item.id === selectedPayment.id && styles.selectedOption,
      ]}
      onPress={() => setSelectedPayment(item)}
      accessibilityLabel={`Select payment method: ${item.name}`}
      activeOpacity={0.8}
    >
      <Image source={item.image} style={styles.paymentImage} />
      <Text style={styles.paymentText} allowFontScaling={false}>{item.name}</Text>
      <View
        style={[
          styles.radioButton,
          item.id === selectedPayment.id && styles.radioButtonSelected,
        ]}
      >
        {item.id === selectedPayment.id && <View style={styles.radioDot} />}
      </View>
    </TouchableOpacity>
  );

  // Render address option
  const renderAddressOption = ({item}) => (
    <TouchableOpacity
      style={[
        styles.card,
        styles.paymentOption,
        item.id === selectedAddress?.id && styles.selectedOption,
      ]}
      onPress={() => setSelectedAddress(item)}
      accessibilityLabel={`Select address: ${item.address}`}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.radioButton,
          item.id === selectedAddress?.id && styles.radioButtonSelected,
        ]}
      >
        {item.id === selectedAddress?.id && <View style={styles.radioDot} />}
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.paymentText} allowFontScaling={false}>{item.name}</Text>
        <Text style={styles.addressText} allowFontScaling={false}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  // Main render
  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>  
      <BackNavigationWithTitle
        title="Payment"
        onPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Payment Method Section */}
        <Text style={styles.sectionTitle} allowFontScaling={false}>Payment Method</Text>
        <FlatList
          data={paymentTypes}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={renderPaymentOption}
          scrollEnabled={false}
        />

        {/* Address Section */}
        <Text style={styles.sectionTitle} allowFontScaling={false}>Shipping Address</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText} allowFontScaling={false}>{error}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={getAddress}
              accessibilityLabel="Retry fetching addresses"
            >
              <Text style={styles.addButtonText} allowFontScaling={false}>Retry</Text>
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
            <Text style={styles.emptyText} allowFontScaling={false}>No address found.</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddressList')}
              accessibilityLabel="Add new address"
            >
              <Text style={styles.addButtonText} allowFontScaling={false}>+ Add Address</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Order Summary Section */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel} allowFontScaling={false}>SubTotal</Text>
          <Text style={styles.summaryValue} allowFontScaling={false}>£ {total?.toFixed(0)}</Text>
        </View>
      </ScrollView>
      {/* Sticky Checkout Button */}
      <View style={styles.stickyFooter}>
        <WineHuntButton
          text="Checkout"
          onPress={() => {
            const data = {
              paymentType: selectedPayment,
              address: selectedAddress,
              amount: total?.toFixed(0),
              cartData: cartData,
              vendorId: vendorId,
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
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 120, // extra space for sticky footer
  },
  sectionTitle: {
    fontFamily: Fonts.PhilosopherRegular,
    color: Colors.black,
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
    letterSpacing: 0.2,
  },
  listContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    margin: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    gap: 12,
  },
  selectedOption: {
    backgroundColor: Colors.gray2,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  paymentImage: {
    height: 24,
    width: 36,
    resizeMode: 'contain',
    marginRight: 8,
  },
  paymentText: {
    fontFamily: Fonts.PhilosopherRegular,
    color: Colors.black,
    fontSize: 16,
    flex: 1,
  },
  addressText: {
    fontFamily: Fonts.PhilosopherRegular,
    color: Colors.gray15,
    fontSize: 13,
    marginTop: 2,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.gray5,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#fff',
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: Fonts.InterBold,
  },
  addButton: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Fonts.InterBold,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summarySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
  },
  summaryLabel: {
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    fontSize: 16,
  },
  summaryValue: {
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    fontSize: 16,
  },
  stickyFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
});
