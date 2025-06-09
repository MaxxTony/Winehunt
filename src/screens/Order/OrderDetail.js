import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors, Fonts} from '../../constant/Styles';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import WineHuntLabelInput from '../../common/WineHuntLabelInput';
import RNFS from 'react-native-fs';
import {showError, showSucess, showWarning} from '../../helper/Toastify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import axios from 'axios';

const OrderDetail = props => {
  const data = props?.route?.params?.item;

  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const [orderId, setOrderId] = useState(data?.id ? data?.id.toString() : '');
  const [trakingNumber, setTrakingNumber] = useState(
    '3RSydIEw5S69YHnU0SBdnAlY',
  );
  const [trakingLink, setTrakingLink] = useState(
    'https://www.delhivery.com/tracking',
  );
  const shippingCharge = 20;

  const formatDate = isoString => {
    const date = new Date(isoString);
    const options = {day: '2-digit', month: 'long', year: 'numeric'};
    return `Date: ${date.toLocaleDateString('en-GB', options)}`;
  };

   const getInvoice = async data => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl9 + 'get-invoice';
    const params = {
      order_id: data?.id,
    };
    try {
      const res = await axios.post(url, params, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res?.status === 200) {
        console.log(res?.data, 'lp');
        onDownloadInvoice(res?.data?.url);
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

  const onDownloadInvoice = async (url) => {
    try {
      const fileName = `invoice_${Date.now()}.pdf`;
      const downloadDest = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      const options = {
        fromUrl: url, // Your PDF link
        toFile: downloadDest,
      };

      const result = await RNFS.downloadFile(options).promise;
      if (result.statusCode === 200) {
        showSucess('Invoice downloaded successfully!');
      } else {
        showError('Download failed.');
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Order Detail"
        onPress={() => navigation.goBack()}
        // refund={true}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Orders No: {data?.order_number}</Text>
            <Text style={styles.orderDate}>{formatDate(data?.created_at)}</Text>
          </View>
        </View>
        <Text style={styles.downloadText} onPress={() => getInvoice(data)}>
          Download Invoice
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Sub Total</Text>
            <Text style={styles.label}> £ {data?.amount}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.label}> £ {parseFloat(data?.amount)}</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Shipping Information</Text>
          <View style={styles.divider} />
          <Text style={styles.label}>
            {data?.user?.first_name} {data?.user?.last_name}
          </Text>
          <Text style={styles.label}>
            {data?.shipping_address?.country_name}{' '}
            {data?.shipping_address?.city} {data?.shipping_address?.state_name}{' '}
            {data?.shipping_address?.city} {data?.shipping_address?.block}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <Feather name="phone" size={18} color={Colors.black} />
            <Text style={styles.label}>{data?.user?.phone}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <Feather name="mail" size={18} color={Colors.black} />
            <Text style={styles.label}>{data?.user?.email}</Text>
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
                Transaction ID
              </Text>

              <Text
                style={{
                  fontFamily: Fonts.InterRegular,
                  color: Colors.black,
                  fontWeight: '600',
                  fontSize: 16,
                }}>
                {data?.transaction_id}
              </Text>
                <Text
                style={{
                  fontFamily: Fonts.InterRegular,
                  color: Colors.green,
                  fontWeight: '600',
                  fontSize: 16,
                }}>
                {data?.payment_status}
              </Text>
            </View>
          </View>
          {/* <Text
            style={{
              textAlign: 'center',
              textDecorationLine: 'underline',
              color: '#326EFF',
              fontStyle: 'italic',
              fontWeight: 'bold',
            }}>
            View Transaction Detail
          </Text> */}
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
              <Text style={styles.value}>{data?.tracking_link}</Text>
            </View>
          ) : null}
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
    textAlign: 'right',
    marginVertical: 10,
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
