import React, {useState} from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {Colors, Fonts} from '../constant/Styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WineHuntButton from '../common/WineHuntButton';
import {Dropdown} from 'react-native-element-dropdown';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const AddressModal = ({
  showAddAddressModal,
  setShowAddAddressModal,
  onPress,
  country,
  setCountry,
  city,
  setCity,
  state,
  setState,
  setFlat,
  flat,
  setArea,
  area,
  setPincode,
  pincode,
}) => {
  const inset = useSafeAreaInsets();

  const countries = [
    {id: 1, name: 'United States'},
    {id: 2, name: 'Canada'},
    {id: 3, name: 'Germany'},
    {id: 4, name: 'India'},
    {id: 5, name: 'Australia'},
    {id: 6, name: 'Japan'},
    {id: 7, name: 'United Kingdom'},
    {id: 8, name: 'France'},
    {id: 9, name: 'Italy'},
    {id: 10, name: 'Brazil'},
  ];

  return (
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
            <Text style={styles.title}>Add Address</Text>
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
              onChange={item => setCountry(item?.id)}
            />
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
              placeholder="State"
              value={state}
              onChange={item => setState(item?.id)}
            />
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
            {/* <View style={styles.currentLocationContainer}>
              <FontAwesome6
                name="location-crosshairs"
                size={20}
                color={Colors.black}
              />
              <Text style={styles.currentLocationText}>
                Use My Current Location
              </Text>
            </View> */}
            <WineHuntButton text="Save" onPress={onPress} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddressModal;

const styles = StyleSheet.create({
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
