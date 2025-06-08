import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import BackNavigationWithTitle from '../../../components/BackNavigationWithTitle';
import { Colors, Fonts } from '../../../constant/Styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Constants from '../../../helper/Constant';
import { showWarning } from '../../../helper/Toastify';

dayjs.extend(relativeTime);

const ReviewList = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  const [detail, setDetail] = useState([]);

  const {
    type,
    reviews: passedReviews,
    data: mainData,
    wineId,
  } = route?.params || {};



  // useEffect(() => {
  //   if (!isFocused) return;

  //   if (type === 'wines') {
     
  //     fetchProductDetail();
  //   } else {
     
  //     fetchVendorDetail();
  //   }
  // }, [isFocused]);

  useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    if (type === 'wines') {
      fetchProductDetail();
    } else {
      fetchVendorDetail();
    }
  });

  return unsubscribe;
}, [navigation, fetchProductDetail, fetchVendorDetail]);


  const fetchProductDetail = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(userData)?.token;

      const response = await axios.post(
        `${Constants.baseUrl4}${Constants.wineDetail}`,
        { product_id: wineId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setDetail(response.data?.data || {});
      }
    } catch (error) {
      handleAxiosError(error);                                                                                            
    }
  }, [wineId]);

  const fetchVendorDetail = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(userData)?.token;

      const vendorId = mainData?.product?.user_id ?? mainData?.id;

      const response = await axios.post(
        `${Constants.baseUrl5}${Constants.vendorDetail}`,
        { vendor_id: vendorId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setDetail(response.data?.data || {});
      }
    } catch (error) {
      handleAxiosError(error);
    }
  }, [mainData]);

  const handleAxiosError = (error) => {
    if (error?.response) {
      console.log('Server Error:', error.response.data);
      showWarning(error.response.data?.message);
    } else if (error?.request) {
      console.log('No Response:', error.request);
    } else {
      console.log('Request Error:', error.message);
    }
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: item?.user?.image }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item?.user?.first_name} {item?.user?.last_name}
          </Text>
          <Text style={styles.dateText}>
            {dayjs(item?.created_at).fromNow()}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={16} color={Colors.yellow} />
          <Text style={styles.ratingText}>{item?.rating}</Text>
        </View>
      </View>
      <Text style={styles.reviewText}>{item?.review}</Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <Text style={{ color: '#888', fontSize: 16,textAlign:"center" }}>
      No reviews at this time
    </Text>
  );

  const reviewData = detail?.reviews || passedReviews?.product_reviews || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <BackNavigationWithTitle
        title="Reviews"
        onPress={() => navigation.goBack()}
        review
        onPressReview={() =>
          navigation.navigate('Review', {
            vendorId: passedReviews?.id,
            type,
          })
        }
      />

      <FlatList
        data={reviewData}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={renderReviewItem}
        ListEmptyComponent={renderEmptyComponent}
        
      />
    </View>
  );
};

export default ReviewList;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContainer: {
    padding: 20,
    gap: 15,
  },
  card: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray14,
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray10,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontFamily: Fonts.InterSemiBold,
    color: Colors.black,
  },
  dateText: {
    fontSize: 13,
    color: Colors.gray15,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '600',
  },
  reviewText: {
    fontSize: 15,
    color: Colors.gray8,
    lineHeight: 20,
    fontFamily: Fonts.InterRegular,
  },
});
