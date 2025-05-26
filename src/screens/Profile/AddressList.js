import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors, Fonts} from '../../constant/Styles';
import Feather from 'react-native-vector-icons/Feather';
import WineHuntButton from '../../common/WineHuntButton';
import ActionnModal from '../../Modal/ActionnModal';
import DeleteModal from '../../Modal/DeleteModal';
import AddressModal from '../../Modal/AddressModal';
import {showSucess, showWarning} from '../../helper/Toastify';
import Modal from 'react-native-modal';
import {Dropdown, SelectCountry} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import axios from 'axios';

const AddressList = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();

  const [addressList, setAddressList] = useState([]);

  const [showActionModal, setShowActionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);
  const [countryCode, setCountryCode] = useState(null);

  const [statesList, setStatesList] = useState([]);
  const [state, setState] = useState(null);

  const [city, setCity] = useState('');
  const [flat, setFlat] = useState('');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchCountries();
    getAddress();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      const countryList = data.map(country => ({
        id: country.cca2,
        name: country.name.common,
      }));
      setCountries(countryList);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

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

  const addAddress = async () => {
    const data = await AsyncStorage.getItem('userDetail');
    const userInfo = JSON.parse(data);
    const token = userInfo?.token;

    if (!country) {
      showWarning('Please Slect the country');
      return;
    }

    if (!city) {
      showWarning('Please insert the City');
      return;
    }
    if (!flat) {
      showWarning('Please enter the flat number');
      return;
    }
    if (!area) {
      showWarning('Please enter the area');
      return;
    }
    if (!pincode) {
      showWarning('Please enter the pincode');
      return;
    }

    const datas = {
      user_id: userInfo?.user?.id,
      country_name: countryCode,
      state_name: 'delhi',
      city: city,
      block: flat,
      street: area,
      zip_code: pincode,
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
        console.log(res?.data);
        showSucess(res?.data?.message);
        setShowAddAddressModal(false);
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

  const updateAddress = async () => {
    const data = await AsyncStorage.getItem('userDetail');
    const userInfo = JSON.parse(data);
    const token = userInfo?.token;

    if (!country) {
      showWarning('Please Slect the country');
      return;
    }

    if (!city) {
      showWarning('Please insert the City');
      return;
    }
    if (!flat) {
      showWarning('Please enter the flat number');
      return;
    }
    if (!area) {
      showWarning('Please enter the area');
      return;
    }
    if (!pincode) {
      showWarning('Please enter the pincode');
      return;
    }

    const datas = {
      user_id: userInfo?.user?.id,
      country_name: country,
      state_name: 'delhi',
      city: city,
      block: flat,
      street: area,
      zip_code: pincode,
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
        console.log(res?.data);
        showSucess(res?.data?.message);
        setShowEditModal(false);
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
        console.log(res?.data);
        showSucess(res?.data?.message);
        setShowDeleteModal(false);
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
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderColor: Colors.gray2,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{gap: 5, flex: 1}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.black,
                    fontFamily: Fonts.InterMedium,
                    fontWeight: '600',
                  }}
                  allowFontScaling={false}>
                  {item?.country_name} {item?.city}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: Colors.black,
                    fontFamily: Fonts.InterMedium,
                    fontWeight: '500',
                  }}
                  allowFontScaling={false}>
                  {item?.state_name} {item?.street} {item?.zip_code}
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  setSelectedAddress(item);
                  setShowActionModal(true);
                }}>
                <Feather name="more-vertical" size={25} color={Colors.red} />
              </Pressable>
            </View>
          );
        }}
      />
      <View style={{marginTop: 'auto', padding: 20, paddingBottom: 30}}>
        <WineHuntButton
          text="Add New Address"
          onPress={() => setShowAddAddressModal(true)}
        />
      </View>

      <ActionnModal
        setShowActionModal={setShowActionModal}
        showActionModal={showActionModal}
        onDelete={() => {
          setShowActionModal(false);
          setShowDeleteModal(true);
        }}
        onEdit={() => {
          setShowActionModal(false);
          setShowEditModal(true);
          setCountry(selectedAddress?.country_name);
          setCity(selectedAddress?.city);
          setFlat(selectedAddress?.block);
          setArea(selectedAddress?.street);
          setPincode(selectedAddress?.zip_code);
        }}
      />

      {showDeleteModal && (
        <DeleteModal
          onCancel={() => setShowDeleteModal(false)}
          onDelete={() => {
            // setShowDeleteModal(false)
            onDelete();
          }}
        />
      )}
      {/* add address */}
      <Modal
        animationIn="fadeInUp"
        animationInTiming={500}
        backdropOpacity={0.5}
        animationOutTiming={500}
        animationOut="fadeOutDown"
        isVisible={showAddAddressModal}
        style={styles.modal}
        onBackdropPress={() => {
          setShowAddAddressModal(false);
        }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces={false}>
            <View style={[styles.modalContent, {paddingBottom: inset.bottom}]}>
              <View style={styles.dragIndicator} />
              <Text style={styles.title} allowFontScaling={false}>
                Add Address
              </Text>
              {countries && countries.length > 0 && (
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  itemTextStyle={styles.itemTextStyle}
                  data={countries}
                  maxHeight={250}
                  dropdownPosition={'auto'}
                  labelField="name"
                  valueField="id"
                  placeholder="Country"
                  value={country}
                  onChange={item => {
                    setCountry(item?.id);
                    setCountryCode(item?.name);
                  }}
                />
              )}

              <TextInput
                value={city}
                onChangeText={setCity}
                style={styles.input}
                placeholder="City"
                placeholderTextColor={Colors.gray10}
              />
              <TextInput
                value={flat}
                onChangeText={setFlat}
                style={styles.input}
                placeholder="Flat/Block"
                placeholderTextColor={Colors.gray10}
              />
              <TextInput
                value={area}
                onChangeText={setArea}
                style={styles.input}
                placeholder="Apartment/Street/Area"
                placeholderTextColor={Colors.gray10}
              />
              <TextInput
                value={pincode}
                onChangeText={setPincode}
                style={styles.input}
                placeholder="ZIP Code"
                placeholderTextColor={Colors.gray10}
              />

              <WineHuntButton text="Save" onPress={() => addAddress()} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
      {/* edit address */}
      <Modal
        animationIn="fadeInUp"
        animationInTiming={500}
        backdropOpacity={0.5}
        animationOutTiming={500}
        animationOut="fadeOutDown"
        isVisible={showEditModal}
        style={styles.modal}
        onBackButtonPress={() => setShowEditModal(false)}
        onBackdropPress={() => setShowEditModal(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces={false}>
            <View style={[styles.modalContent, {paddingBottom: inset.bottom}]}>
              <View style={styles.dragIndicator} />
              <Text style={styles.title} allowFontScaling={false}>
                Update Address
              </Text>
              {countries && countries.length > 0 && (
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  itemTextStyle={styles.itemTextStyle}
                  data={countries}
                  maxHeight={250}
                  dropdownPosition={'auto'}
                  labelField="name"
                  valueField="id"
                  placeholder="Country"
                  value={country}
                  onChange={item => {
                    setCountry(item?.id);
                    setCountryCode(item?.name);
                  }}
                />
              )}

              <TextInput
                value={city}
                onChangeText={setCity}
                style={styles.input}
                placeholder="City"
                placeholderTextColor={Colors.gray10}
              />
              <TextInput
                value={flat}
                onChangeText={setFlat}
                style={styles.input}
                placeholder="Flat/Block"
                placeholderTextColor={Colors.gray10}
              />
              <TextInput
                value={area}
                onChangeText={setArea}
                style={styles.input}
                placeholder="Apartment/Street/Area"
                placeholderTextColor={Colors.gray10}
              />
              <TextInput
                value={pincode}
                onChangeText={setPincode}
                style={styles.input}
                placeholder="ZIP Code"
                placeholderTextColor={Colors.gray10}
              />
              <WineHuntButton text="Update" onPress={() => updateAddress()} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
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
    minHeight: 500,
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
});
