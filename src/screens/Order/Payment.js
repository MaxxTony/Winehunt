import React, {useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors, Fonts} from '../../constant/Styles';
import WineHuntButton from '../../common/WineHuntButton';

const Payment = props => {
  const total = props?.route?.params?.total;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const types = [
    {id: 1, name: 'Credit Card', image: require('./images/c1.png')},
    {id: 2, name: 'Google Pay', image: require('./images/c2.png')},
    {id: 3, name: 'UPI Method', image: require('./images/c3.png')},
    {id: 4, name: 'Cash on Delivery', image: require('./images/c4.png')},
  ];

  const [selectedPayment, setSelectedPayment] = useState(types[0].id);

  const addresstype = [
    {id: 1, name: 'Home', address: '2464 Royal Ln. Mesa, New Jersey 45463'},
    {
      id: 2,
      name: 'Office',
      address: '1901 Thornridge Cir. Shiloh, Hawaii 81063',
    },
  ];

  const [selectedAddress, setSelectedAddress] = useState(addresstype[0].id);

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <BackNavigationWithTitle
        title="Payment"
        onPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.paymentTitle}>Payment Method:</Text>
        <FlatList
          data={types}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.paymentOption,
                item.id === selectedPayment && styles.selectedOption,
              ]}
              onPress={() => setSelectedPayment(item.id)}>
              <Image source={item.image} style={styles.paymentImage} />
              <Text style={styles.paymentText}>{item.name}</Text>
              <View
                style={[
                  styles.radioButton,
                  item.id === selectedPayment && styles.radioButtonSelected,
                ]}
              />
            </TouchableOpacity>
          )}
        />
        <Text style={styles.paymentTitle}>Shipping Address:</Text>
        <FlatList
          data={addresstype}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.paymentOption,
                item.id === selectedAddress && styles.selectedOption,
              ]}
              onPress={() => setSelectedAddress(item.id)}>
              <View
                style={[
                  styles.radioButton,
                  item.id === selectedAddress && styles.radioButtonSelected,
                ]}
              />
              <View>
                <Text style={styles.paymentText}>{item.name}</Text>
                <Text style={styles.addressText}>{item.address}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
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
            }}>
            SubTotal
          </Text>
          <Text
            style={{
              fontFamily: Fonts.InterBold,
              color: Colors.black,
              fontSize: 16,
            }}>
            $ {total}
          </Text>
        </View>
      </ScrollView>
      <View style={{padding: 20}}>
        <WineHuntButton
          text="Checkout"
          onPress={() => navigation.navigate('Checkout')}
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
    fontSize: 14,
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
});
