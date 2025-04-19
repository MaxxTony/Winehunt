import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, { useState } from 'react';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors, Fonts} from '../../constant/Styles';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import WineHuntLabelInput from '../../common/WineHuntLabelInput';

const OrderDetail = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const [orderId, setOrderId] = useState('');
  const [trakingNumber, setTrakingNumber] = useState('');
  const [trakingLink, setTrakingLink] = useState('');

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Order Detail"
        onPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Orders ID: 9900423</Text>
            <Text style={styles.orderDate}>Date: 02 April, 2025</Text>
          </View>
          <Text style={styles.downloadText}>Download Invoice</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Sub Total</Text>
            <Text style={styles.label}>£12.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Shipping Charges</Text>
            <Text style={styles.label}>£20</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Other Tax</Text>
            <Text style={styles.label}>£0</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.label}>£12.00</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Shipping Information</Text>
          <View style={styles.divider} />
          <Text style={styles.label}>Alex Pathic</Text>
          <Text style={styles.label}>305 Block B, Down Street, Arizona</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <Feather name="phone" size={18} color={Colors.black} />
            <Text style={styles.label}>+1 202-555-0123</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <Feather name="mail" size={18} color={Colors.black} />
            <Text style={styles.label}>alex@example.com</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Billing Information</Text>
          <View style={styles.divider} />
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <Image
              source={require('./images/credit.png')}
              style={{height: 44, width: 44}}
              resizeMode="contain"
            />
            <View style={{gap: 5}}>
              <Text
                style={{
                  fontFamily: Fonts.InterRegular,
                  color: Colors.black,
                  fontWeight: '600',
                  fontSize: 16,
                }}>
                Credit Card
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.InterRegular,
                  color: Colors.black,
                  fontWeight: '600',
                  fontSize: 16,
                }}>
                XXXXXXXXXX5865
              </Text>
            </View>
          </View>
          <Text
            style={{
              textAlign: 'center',
              textDecorationLine: 'underline',
              color: '#326EFF',
              fontStyle: 'italic',
              fontWeight: 'bold',
            }}>
            View Transaction Detail
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Track Order</Text>
          <Text
            style={{
              fontFamily: Fonts.InterRegular,
              color: Colors.black,
              fontSize: 15,
            }}>
            Transport Company Name -{' '}
            <Text style={{color: '#326EFF'}}>FreightWings Express</Text>
          </Text>
          <View style={styles.divider} />
          <WineHuntLabelInput
            value={orderId}
            onChangeText={e => setOrderId(e)}
            placeholder="Enter Your Order ID"
            label="Order ID"
          />
          <WineHuntLabelInput
            value={trakingNumber}
            onChangeText={e => setTrakingNumber(e)}
            placeholder="Enter Your Tracking Number"
            label="Tracking Number"
          />
          <WineHuntLabelInput
            value={trakingNumber}
            onChangeText={e => setTrakingNumber(e)}
            placeholder="Enter Your Tracking Link"
            label="Tracking Link"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    padding: 20,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderInfo: {
    gap: 5,
  },
  orderId: {
    fontFamily: Fonts.InterRegular,
    color: Colors.red2,
    fontWeight: '800',
    fontSize: 20,
  },
  orderDate: {
    fontFamily: Fonts.InterRegular,
    color: Colors.black,
    fontWeight: '400',
    fontSize: 14,
  },
  downloadText: {
    fontFamily: Fonts.InterRegular,
    color: '#5FC27B',
    fontWeight: '700',
    fontSize: 15,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 5,
    gap: 5,
  },
  summaryTitle: {
    fontFamily: Fonts.InterRegular,
    color: Colors.red2,
    fontWeight: '700',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: Fonts.InterRegular,
    color: Colors.black,
    fontWeight: '700',
    fontSize: 16,
  },
  totalLabel: {
    fontFamily: Fonts.InterRegular,
    color: Colors.red2,
    fontWeight: '700',
    fontSize: 18,
  },
});
