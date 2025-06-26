import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors, Fonts} from '../../constant/Styles';
import Feather from 'react-native-vector-icons/Feather';
import WineHuntButton from '../../common/WineHuntButton';
import AddressFormModal from '../../Modal/AddressModal';
import {showSucess, showWarning} from '../../helper/Toastify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import axios from 'axios';

const AddressList = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const [addressList, setAddressList] = useState([]);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState('add'); 
  const [addressModalLoading, setAddressModalLoading] = useState(false);
  const [addressModalError, setAddressModalError] = useState('');
  const [addressModalInitialValues, setAddressModalInitialValues] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    getAddress();
  }, []);


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
        setAddressList(res?.data?.address);
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

  const handleAddAddress = async (form) => {
    setAddressModalLoading(true);
    setAddressModalError('');
    const data = await AsyncStorage.getItem('userDetail');
    const userInfo = JSON.parse(data);
    const token = userInfo?.token;
    const datas = {
      user_id: userInfo?.user?.id,
      country_name: form.country,
      city: form.city,
      block: form.flat,
      street: form.area,
      zip_code: form.pincode,
      latitude: 22.898989,
      longitude: 33.98765678,
    };
    const url = Constants.baseUrl10 + Constants.addAddress;
    try {
      const res = await axios.post(url, datas, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.status == 200) {
        showSucess(res?.data?.message);
        setAddressModalVisible(false);
        getAddress();
      }
    } catch (error) {
      if (error.response) {
        setAddressModalError(error.response.data?.message || 'Server error');
      } else if (error.request) {
        setAddressModalError('No response from server');
      } else {
        setAddressModalError(error.message);
      }
    } finally {
      setAddressModalLoading(false);
    }
  };

  const handleEditAddress = async (form) => {
    setAddressModalLoading(true);
    setAddressModalError('');
    const data = await AsyncStorage.getItem('userDetail');
    const userInfo = JSON.parse(data);
    const token = userInfo?.token;
    const datas = {
      user_id: userInfo?.user?.id,
      country_name: form.country,
      city: form.city,
      block: form.flat,
      street: form.area,
      zip_code: form.pincode,
      latitude: 22.898989,
      longitude: 33.98765678,
      id: selectedAddress?.id,
    };
    const url = Constants.baseUrl10 + 'update-address';
    try {
      const res = await axios.post(url, datas, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.status == 200) {
        showSucess(res?.data?.message);
        setAddressModalVisible(false);
        getAddress();
      }
    } catch (error) {
      if (error.response) {
        setAddressModalError(error.response.data?.message || 'Server error');
      } else if (error.request) {
        setAddressModalError('No response from server');
      } else {
        setAddressModalError(error.message);
      }
    } finally {
      setAddressModalLoading(false);
    }
  };

  const onDelete = async () => {
    const data = await AsyncStorage.getItem('userDetail');
    const userInfo = JSON.parse(data);
    const token = userInfo?.token;
    const datas = {
      id: selectedAddress?.id,
    };
    const url = Constants.baseUrl10 + 'delete-address';
    try {
      const res = await axios.post(url, datas, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.status == 200) {
        showSucess(res?.data?.message);
      
        getAddress();
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

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Address List"
        onPress={() => navigation.goBack()}
      />

      <FlatList
        data={addressList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return (
            <Pressable
              style={({pressed}) => [
                styles.addressCard,
                pressed && styles.cardPressed
              ]}
            >
              <View style={styles.accentBar} />
              <View style={styles.cardContent}>
                <View style={styles.iconCircle}>
                  <Feather name="map-pin" size={20} color="#fff" />
                </View>
                <View style={{flex: 1, marginLeft: 12}}>
                  <Text style={styles.addressTitle} numberOfLines={1} allowFontScaling={false}>
                    {item?.country_name}, {item?.city}
                  </Text>
                  <Text style={styles.addressDetail} numberOfLines={1} allowFontScaling={false}>
                    {item?.street}{item?.block ? `, ${item?.block}` : ''} {item?.zip_code}
                  </Text>
                  {item?.state_name ? (
                    <Text style={styles.addressDetail} numberOfLines={1} allowFontScaling={false}>
                      {item?.state_name}
                    </Text>
                  ) : null}
                  <Text style={styles.updatedAt} allowFontScaling={false}>
                    Updated: {item?.updated_at ? new Date(item.updated_at).toLocaleDateString() : ''}
                  </Text>
                </View>
                <View style={styles.cardActions}>
                  <Pressable
                    onPress={() => {
                      setSelectedAddress(item);
                      setAddressModalMode('edit');
                      setAddressModalInitialValues({
                        country: item?.country_name,
                        city: item?.city,
                        flat: item?.block,
                        area: item?.street,
                        pincode: item?.zip_code,
                      });
                      setAddressModalVisible(true);
                    }}
                    style={({pressed}) => [
                      styles.iconButton,
                      styles.editButton,
                      pressed && styles.iconButtonPressed
                    ]}
                  >
                    <Feather name="edit-2" size={18} color={Colors.primary} />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setSelectedAddress(item);
                      Alert.alert(
                        'Delete Address',
                        'Are you sure you want to delete this address?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Delete', style: 'destructive', onPress: () => onDelete() },
                        ],
                        { cancelable: true }
                      );
                    }}
                    style={({pressed}) => [
                      styles.iconButton,
                      styles.deleteButton,
                      pressed && styles.iconButtonPressed
                    ]}
                  >
                    <Feather name="trash-2" size={18} color={Colors.red} />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={{padding: 20, alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 16,
                color: Colors.gray,
                fontFamily: Fonts.InterMedium,
              }}
              allowFontScaling={false}>
              No address list found
            </Text>
          </View>
        }
      />

      <View style={{marginTop: 'auto', padding: 20, paddingBottom: 30}}>
        <WineHuntButton
          text="Add New Address"
          onPress={() => {
            setAddressModalMode('add');
            setAddressModalInitialValues({});
            setAddressModalVisible(true);
          }}
        />
      </View>

      <AddressFormModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onSubmit={addressModalMode === 'add' ? handleAddAddress : handleEditAddress}
        initialValues={addressModalInitialValues}
        mode={addressModalMode}
        loading={addressModalLoading}
        error={addressModalError}
      />
    </View>
  );
};

export default AddressList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modal: {
    margin: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContent: {
    flexGrow: 1,
  },
  modalContent: {
    padding: 20,
    backgroundColor: Colors.white,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    gap: 20,
    // minHeight: 500,
  },
  dragIndicator: {
    height: 5,
    width: 50,
    backgroundColor: Colors.gray10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
  },
  dropdown: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderColor: Colors.gray2,
  },
  placeholderStyle: {
    ...Fonts.InterRegular,
    fontSize: 15,
    color: Colors.black,
  },
  selectedTextStyle: {
    ...Fonts.InterRegular,
    fontSize: 15,
    color: Colors.black,
  },
  itemTextStyle: {
    ...Fonts.InterBold,
    color: Colors.black,
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    paddingVertical: Platform.OS === 'ios' ? 10 : 5,
    paddingHorizontal: 10,
    borderColor: Colors.gray2,
    borderRadius: 8,
    color: '#000',
  },
  currentLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  currentLocationText: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#f9f9fb',
    borderRadius: 18,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
    minHeight: 90,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.18,
  },
  accentBar: {
    width: 6,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressTitle: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
    fontWeight: '700',
    marginBottom: 2,
  },
  addressDetail: {
    fontSize: 14,
    color: Colors.gray,
    fontFamily: Fonts.InterMedium,
    marginBottom: 1,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 8,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f3f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  editButton: {
    backgroundColor: '#eaf4ff', // light primary
    borderColor: Colors.primary,
  },
  deleteButton: {
    backgroundColor: '#fff0f0', // light red
    borderColor: Colors.red,
  },
  iconButtonPressed: {
    backgroundColor: '#e0e0e0',
    opacity: 0.7,
  },
  updatedAt: {
    fontSize: 11,
    color: Colors.gray15,
    fontFamily: Fonts.InterRegular,
    marginTop: 6,
  },
});
