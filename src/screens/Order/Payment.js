import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
  const isFocused = useIsFocused();

  useEffect(() => {
    getAddress();
  }, [isFocused]);

  const getAddress = async () => {
    const data = await AsyncStorage.getItem('userDetail');
    const userInfo = JSON.parse(data);
    const token = userInfo?.token;

    const url = Constants.baseUrl10 + Constants.getAddress;

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res?.status == 200) {
        const addresstype = res?.data?.address.map((item, index) => ({
          id: item.id,
          name: 'Home',
          address: `${item.block}, ${item.street}, ${item.city}, ${item.state_name}, ${item.zip_code}, ${item.country_name}`,
        }));
        setAddressList(addresstype);
        setSelectedAddress(addresstype[0]);
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

  const types = [
    {id: 1, name: 'Credit Card', image: require('./images/c1.png')},
  ];

  const [selectedPayment, setSelectedPayment] = useState(types[0]);

  const addresstype = [{id: 1, name: 'Home', address: `${userData?.address}`}];

  const [selectedAddress, setSelectedAddress] = useState(addresstype[0]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfile());
    }, [dispatch]),
  );

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <BackNavigationWithTitle
        title="Payment"
        onPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.paymentTitle} allowFontScaling={false}>
          Payment Method:
        </Text>
        <FlatList
          data={types}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.paymentOption,
                item.id === selectedPayment.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedPayment(item)}>
              <Image source={item.image} style={styles.paymentImage} />
              <Text style={styles.paymentText} allowFontScaling={false}>
                {item.name}
              </Text>
              <View
                style={[
                  styles.radioButton,
                  item.id === selectedPayment.id && styles.radioButtonSelected,
                ]}
              />
            </TouchableOpacity>
          )}
        />
        {addressList?.length > 0 ? (
          <>
            <Text style={styles.paymentTitle} allowFontScaling={false}>
              Shipping Address:
            </Text>
            <FlatList
              data={addressList}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    item.id === selectedAddress?.id && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedAddress(item)}>
                  <View
                    style={[
                      styles.radioButton,
                      item.id === selectedAddress?.id &&
                        styles.radioButtonSelected,
                    ]}
                  />
                  <View>
                    <Text style={styles.paymentText} allowFontScaling={false}>
                      {item.name}
                    </Text>
                    <Text style={styles.addressText} allowFontScaling={false}>
                      {item.address}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText} allowFontScaling={false}>
              No address found.
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddressList')}>
              <Text style={styles.addButtonText} allowFontScaling={false}>
                + Add Address
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: Fonts.InterBold,
              color: Colors.black,
              fontSize: 16,
            }}
            allowFontScaling={false}>
            SubTotal
          </Text>
          <Text
            style={{
              fontFamily: Fonts.InterBold,
              color: Colors.black,
              fontSize: 16,
            }}
            allowFontScaling={false}>
             £  {total.toFixed(0)}
          </Text>
        </View>
      </ScrollView>
      <View style={{padding: 20}}>
        <WineHuntButton
          text="Checkout"
          onPress={() => {
            const data = {
              paymentType: selectedPayment,
              address: selectedAddress,
              amount: total.toFixed(0),
              cartData: cartData,
              vendorId: vendorId,
            };

            if (addressList?.length > 0) {
              navigation.navigate('Checkout', {data});
            } else {
              showWarning('Please add an address');
            }
          }}
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
  },
  paymentTitle: {
    fontFamily: Fonts.PhilosopherRegular,
    color: Colors.black,
    fontSize: 16,
    marginBottom: 10,
  },
  listContainer: {
    elevation: 5,
    backgroundColor: Colors.white,
    borderRadius: 8,
    overflow: 'hidden',
    margin: 5,
    marginBottom: 10,
  },
  paymentOption: {
    padding: 15,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
    gap: 10,
  },
  selectedOption: {
    backgroundColor: Colors.gray2,
  },
  paymentImage: {
    height: 20,
    width: 30,
    resizeMode: 'contain',
  },
  paymentText: {
    fontFamily: Fonts.PhilosopherRegular,
    color: Colors.black,
    fontSize: 16,
    flex: 1,
  },
  addressText: {
    fontFamily: Fonts.PhilosopherRegular,
    color: Colors.black,
    fontSize: 12,
  },
  radioButton: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.gray5,
    backgroundColor: 'transparent',
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  emptyContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
    // textAlign: 'center',
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.red2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
