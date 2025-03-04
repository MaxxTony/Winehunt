import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors, Fonts} from '../../../constant/Styles';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Constants from '../../../helper/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showSucess, showWarning} from '../../../helper/Toastify';
import axios from 'axios';
import haversine from 'haversine';

const screenWidth = Dimensions.get('window').width;

const formatNumber = num => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

const formatTime = time => {
  const [hour, minute] = time.split(':').map(Number);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12; // Convert 24-hour format to 12-hour
  return `${formattedHour} ${suffix}`;
};

const VendorDetail = props => {
  const navigation = useNavigation();
  const data = props?.route?.params?.item;

  const userCoords = props?.route?.params?.userCoordinates;

  const inset = useSafeAreaInsets();
  const [loading, setLoading] = useState([]);
  const [detail, setDetail] = useState([]);
  const [like, setLike] = useState(false);
  const [likedItems, setLikedItems] = useState({});

  const [vendorCoordinates, setVendorCoordinates] = useState({});

  useEffect(() => {
    getVendorDetail();
  }, []);

  const getVendorDetail = async () => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl5 + Constants.vendorDetail;
    setLoading(true);
    const body = {
      vendor_id: data?.id,
    };
    try {
      const res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res?.status === 200) {
        const vendorData = res?.data?.data;
        setDetail(vendorData);
        setVendorCoordinates({
          latitude: res?.data?.data?.latitude,
          longitude: res?.data?.data?.longitude,
        });
        setLikedItems(prev => ({
          ...prev,
          [vendorData?.id]: vendorData?.is_wishlist,
        }));
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
    } finally {
      setLoading(false);
    }
  };

  const openMaps = (latitude, longitude) => {
    const url =
      Platform.OS === 'ios'
        ? `maps://app?saddr=${latitude},${longitude}`
        : `geo:${latitude},${longitude}?q=${latitude},${longitude}`;

    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  const handleContactPress = type => {
    if (!detail) return;

    switch (type) {
      case 'Call':
        if (detail.phone) Linking.openURL(`tel:${detail.phone}`);
        break;
      case 'Message':
        if (detail.email) Linking.openURL(`mailto:${detail.email}`);
        break;
      case 'View Map':
        if (detail.latitude && detail.longitude)
          openMaps(detail.latitude, detail.longitude);
        break;
      case 'Website':
        if (detail.website) Linking.openURL('https://www.isynbus.com/');
        break;
      default:
        break;
    }
  };

  const renderContactOption = ({item}) => (
    <View style={styles.contactOptionContainer}>
      <Pressable
        style={styles.contactOptionIcon}
        onPress={() => handleContactPress(item.name)}>
        <Image source={item.image} style={styles.contactImage} />
      </Pressable>
      <Text style={styles.contactOptionText}>{item.name}</Text>
    </View>
  );

  const contactOptions = [
    {id: 1, name: 'Call', image: require('../images/call.png')},
    {id: 2, name: 'Message', image: require('../images/sms.png')},
    {id: 3, name: 'View Map', image: require('../images/location.png')},
    {id: 4, name: 'Website', image: require('../images/global.png')},
  ];

  const onLike = async (id, str) => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl7 + Constants.addToWishList;
    setLoading(true);
    const body = {
      type: str === 'vendors' ? 'vendors' : 'wines',
      [str === 'vendors' ? 'vendor_id' : 'product_id']: id,
    };
    try {
      const res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res?.data?.status === 200) {
        setLikedItems(prev => ({...prev, [id]: true}));
        showSucess(res?.data?.message);
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
    } finally {
      setLoading(false);
    }
  };

  const onDisLike = async (id, str) => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl7 + Constants.removeToWishList;
    setLoading(true);
    const body = {
      id: id,
      type: str == 'vendors' ? 'vendors' : 'wines',
    };

    try {
      const res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res?.data?.status === 200) {
        setLikedItems(prev => ({...prev, [id]: false}));
        showWarning(res?.data?.message);
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
    } finally {
      setLoading(false);
    }
  };

  const distance = haversine(userCoords, vendorCoordinates, {
    unit: 'km',
  });
  const formattedDistance = formatNumber(distance);

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          {paddingTop: Platform.OS == 'ios' ? inset.top : 0},
        ]}>
        <ImageBackground
          source={require('../images/bg.png')}
          style={styles.headerBackground}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Fontisto name="angle-left" size={20} color={Colors.white} />
          </Pressable>
          <View style={styles.headerInfoContainer}>
            <Image
              source={
                detail?.image
                  ? {uri: detail?.image}
                  : require('../images/shopbg.png')
              }
              style={styles.shopImage}
            />
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons
                  name="navigate-outline"
                  size={18}
                  color={Colors.black}
                />
                <Text style={styles.infoText}>{formattedDistance} km</Text>
              </View>
              <View style={styles.infoItem}>
                <AntDesign name="star" size={18} color={Colors.yellow} />
                <Text style={styles.infoText}>{detail?.total_reviews}</Text>
              </View>
              <Pressable
                style={styles.favoriteButton}
                onPress={() => {
                  if (!likedItems[detail?.id]) {
                    onLike(detail?.id, 'vendors');
                  } else {
                    onDisLike(detail?.id, 'vendors');
                  }
                }}>
                <AntDesign
                  size={18}
                  name={likedItems[detail?.id] ? 'heart' : 'hearto'}
                  color={likedItems[detail?.id] ? Colors.red : Colors.black}
                />
              </Pressable>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.contentContainer}>
          <Text style={styles.vendorName}>{detail?.shop_name}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={15} color={Colors.gray} />
            <Text style={styles.locationText}>{detail?.address}</Text>
          </View>
          <Text style={styles.description}>{detail?.description}</Text>
          <View>
            {detail &&
              detail?.business_hours?.map(item => (
                <Text key={item.id} style={styles.openStatus}>
                  Open {'  '}
                  <Text style={styles.openTime}>
                    {item.weekday} {formatTime(item.open_time)} to{' '}
                    {formatTime(item.close_time)}
                  </Text>
                </Text>
              ))}
          </View>
          <FlatList
            data={contactOptions}
            horizontal
            scrollEnabled={false}
            contentContainerStyle={styles.contactList}
            renderItem={renderContactOption}
          />
          <View style={styles.separator} />
          <Text style={styles.sectionTitle}>Product for you</Text>
          <FlatList
            data={detail?.products}
            renderItem={({item, index}) => {
              return (
                <View style={styles.productContainer}>
                  <Image
                    source={
                      item?.product_images[0]?.image
                        ? {uri: item?.product_images[0]?.image}
                        : require('../images/bottle.png')
                    }
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                  <View style={styles.productDetails}>
                    <View style={styles.productHeader}>
                      <Text style={styles.productTitle} numberOfLines={1}>
                        {item?.name} ({item?.title})
                      </Text>
                      <Pressable
                        onPress={() => {
                          if (!likedItems[item?.id]) {
                            onLike(item?.id, 'wines');
                          } else {
                            onDisLike(item?.id, 'wines');
                          }
                        }}>
                        <AntDesign
                          size={18}
                          name={likedItems[item?.id] ? 'heart' : 'hearto'}
                          color={
                            likedItems[item?.id] ? Colors.red : Colors.black
                          }
                        />
                      </Pressable>
                    </View>
                    <Text style={styles.productTag}>Best Rated this Month</Text>
                    <View style={styles.productFooter}>
                      <Pressable
                        style={styles.viewMoreButton}
                        onPress={() =>
                          navigation.navigate('WineDetail', {item: item?.id})
                        }>
                        <Text style={styles.viewMoreText}>View More</Text>
                      </Pressable>
                      <View style={styles.ratingContainer}>
                        <AntDesign
                          name="star"
                          size={18}
                          color={Colors.yellow}
                        />
                        <Text style={styles.infoText}>
                          {item?.average_rating}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
          />

          <Text style={styles.sectionTitle}>Offers</Text>

          {detail && detail?.length > 0 && detail?.offers.length > 0 ? (
            <FlatList
              data={detail?.offers}
              horizontal
              contentContainerStyle={{gap: 10}}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      padding: 10,
                      borderWidth: 1,
                      borderColor: Colors.gray10,
                      borderRadius: 10,
                    }}>
                    <Text>{item?.name}</Text>
                  </View>
                );
              }}
            />
          ) : (
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: Fonts.InterBold,
                fontWeight: '400',
                textAlign: 'center',
              }}>
              No offers at this time{' '}
            </Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.sectionTitle}>Review (0)</Text>
            {/* <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.InterRegular,
                color: Colors.black,
              }}>
              View All
            </Text> */}
          </View>
          {detail && detail?.length > 0 && detail?.reviews.length > 0 ? (
            <Text>There is a review</Text>
          ) : (
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                fontFamily: Fonts.InterBold,
                fontWeight: '400',
                textAlign: 'center',
              }}>
              No review at this time{' '}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default VendorDetail;

const styles = StyleSheet.create({
  container: {backgroundColor: Colors.white, paddingBottom: 80},
  headerBackground: {width: '100%', height: 250, marginBottom: 100},
  backButton: {flexDirection: 'row', alignItems: 'center', padding: 20},
  headerInfoContainer: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: -100,
  },
  shopImage: {height: 100, width: 100, borderRadius: 10},
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: Colors.gray,
    gap: 4,
  },
  infoText: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '600',
  },
  favoriteButton: {marginHorizontal: 10},
  contentContainer: {paddingHorizontal: 20, gap: 10},
  vendorName: {
    fontSize: 18,
    fontFamily: Fonts.PhilosopherBold,
    color: Colors.black,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
  },
  locationText: {
    fontSize: 13,
    fontFamily: Fonts.InterRegular,
    color: Colors.gray,
    flex: 1,
    flexWrap: 'wrap',
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.InterRegular,
    color: Colors.black,
  },
  openStatus: {
    fontSize: 13,
    fontFamily: Fonts.InterBold,
    color: Colors.green,
    fontWeight: '600',
  },
  openTime: {color: Colors.gray4, fontSize: 12, fontWeight: '400'},
  contactList: {gap: 20},
  contactOptionContainer: {alignItems: 'center', gap: 5},
  contactOptionIcon: {
    padding: 10,
    borderWidth: 1,
    alignItems: 'center',
    borderRadius: 100,
    borderColor: Colors.gray4,
  },
  contactImage: {height: 20, width: 20},
  contactOptionText: {
    fontSize: 14,
    fontFamily: Fonts.InterRegular,
    color: Colors.black,
  },
  separator: {height: 1, width: '100%', backgroundColor: Colors.gray4},
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.PhilosopherBold,
    color: Colors.black,
  },
  productContainer: {
    padding: 10,
    margin: 3,
    backgroundColor: Colors.white,
    elevation: 5,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 10,
  },
  productFooter: {flexDirection: 'row', justifyContent: 'space-between'},
  productImage: {height: 75, width: 38},
  productDetails: {flex: 1, gap: 5},
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productTitle: {fontSize: 13, color: Colors.black, fontWeight: '700'},
  productTag: {fontSize: 12, color: Colors.gray, fontWeight: '700'},
  viewMoreButton: {
    padding: 5,
    backgroundColor: Colors.red,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  viewMoreText: {fontSize: 12, color: Colors.white, fontWeight: '700'},
  ratingContainer: {flexDirection: 'row', alignItems: 'center', gap: 5},
});
