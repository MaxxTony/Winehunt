import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors, Fonts} from '../../constant/Styles';
import WineHuntLabelInput from '../../common/WineHuntLabelInput';

const TrackOrder = props => {
  const data = props?.route?.params?.item;
  const [orderId, setOrderId] = useState(data?.id ? data?.id : '');
  const [trakingNumber, setTrakingNumber] = useState('');
  const [trakingLink, setTrakingLink] = useState('');

  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Track Order"
        onPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Orders ID: {data?.id}</Text>
          </View>
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

export default TrackOrder;

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
});
