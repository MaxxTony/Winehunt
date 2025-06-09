import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors, Fonts} from '../../constant/Styles';
import WineHuntLabelInput from '../../common/WineHuntLabelInput';

const TrackOrder = props => {
  const data = props?.route?.params?.item;
  const [orderId, setOrderId] = useState(data?.id ? data?.id.toString() : '');
  const [trakingNumber, setTrakingNumber] = useState(
    '3RSydIEw5S69YHnU0SBdnAlY',
  );
  const [trakingLink, setTrakingLink] = useState(
    'https://www.delhivery.com/tracking',
  );

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
            <Text style={styles.orderId}>
              Orders Number: {data?.order_number}
            </Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Track Order</Text>

          <View style={styles.divider} />
          {data?.order_number ? (
            <View style={styles.row}>
              <Text style={styles.label}>Order Number:</Text>
              <Text style={styles.value}>{data?.order_number}</Text>
            </View>
          ) : null}

          {data?.tracking_number ? (
            <View style={styles.row}>
              <Text style={styles.label}>Tracking Number:</Text>
              <Text style={styles.value}>{data?.tracking_number}</Text>
            </View>
          ) : null}

          {data?.transport_company_name ? (
            <View style={styles.row}>
              <Text style={styles.label}>Tracking Company:</Text>
              <Text style={styles.value}>{data?.transport_company_name}</Text>
            </View>
          ) : null}
          {data?.tracking_link ? (
            <View style={styles.row}>
              <Text style={styles.label}>Tracking Company:</Text>
              <Text
                style={[styles.value, {color: 'blue', fontWeight: '700'}]}
               onPress={() => Linking.openURL('https://www.google.com')}>
                {data?.tracking_link}
              </Text>
            </View>
          ) : null}
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
    fontSize: 17,
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
  row: {
    marginBottom: 10,
  },

  label: {
    fontFamily: Fonts.InterMedium,
    fontSize: 14,
    color: Colors.gray4,
  },

  value: {
    fontFamily: Fonts.InterSemiBold,
    fontSize: 15,
    color: Colors.black,
    marginTop: 2,
  },
});
