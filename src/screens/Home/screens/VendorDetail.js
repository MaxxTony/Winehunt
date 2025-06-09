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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Constants from '../../../helper/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showSucess, showWarning} from '../../../helper/Toastify';
import axios from 'axios';
import haversine from 'haversine';
import AnimatedCartModal from '../components/AnimatedCartModal';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

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
  const isFocused = useIsFocused();

  const userCoords = props?.route?.params?.userCoordinates;

  const inset = useSafeAreaInsets();
  const [loading, setLoading] = useState([]);
  const [detail, setDetail] = useState([]);
  const [like, setLike] = useState(false);
  const [likedItems, setLikedItems] = useState({});
  const [suggestionLikes, setSuggestionLikes] = useState({});

  const [vendorCoordinates, setVendorCoordinates] = useState({});
  const [cartData, setCartData] = useState([]);

  const [isCartVisible, setIsCartVisible] = useState(false);

  useEffect(() => {
    getVendorDetail();
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) getCartData();
  }, [isFocused]);

  const getCartData = async () => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl8 + Constants.getCart;
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setCartData(res?.data?.cart);
    } catch (error) {
      showWarning(error.response?.data?.message || 'Error fetching cart');
    }
  };

  const getVendorDetail = async () => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl5 + Constants.vendorDetail;
    setLoading(true);
    const body = {
      vendor_id: data?.product?.user_id ? data?.product?.user_id : data?.id,
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

        // Set suggested products wishlist status
        const suggestionLikesMap = {};
        if (vendorData?.products) {
          vendorData?.products.forEach(suggestion => {
            suggestionLikesMap[suggestion.id] = suggestion.is_wishlist;
          });
        }
        setSuggestionLikes(suggestionLikesMap);
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

  const onLike = async (id, isSuggestion = false) => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl7 + Constants.addToWishList;
    setLoading(true);
    const body = {
      type: isSuggestion ? 'wines' : 'vendors',
      [isSuggestion ? 'product_id' : 'vendor_id']: id,
    };
    try {
      const res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res?.data?.status === 200) {
        if (isSuggestion) {
          setSuggestionLikes(prev => ({...prev, [id]: true}));
        } else {
          setLikedItems(prev => ({...prev, [id]: true}));
        }
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

  const onDisLike = async (id, isSuggestion = false) => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl7 + Constants.removeToWishList;
    setLoading(true);
    const body = {
      id: id,
      type: isSuggestion ? 'wines' : 'vendors',
    };

    try {
      const res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res?.data?.status === 200) {
        if (isSuggestion) {
          setSuggestionLikes(prev => ({...prev, [id]: false}));
        } else {
          setLikedItems(prev => ({...prev, [id]: false}));
        }
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

  const handleRemoveItem = async itemId => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl8 + Constants.deleteCart;
    const data = {
      id: itemId,
    };
    try {
      const res = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res?.data?.status == 200) {
        getCartData();
      }
    } catch (error) {
      console.log(error);
      showWarning(error.response?.data?.message || 'Error updating cart');
    }
  };

  const formatDate = dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

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
              {detail?.latitude !== 'undefined' && (
                <View style={styles.infoItem}>
                  <Ionicons
                    name="navigate-outline"
                    size={18}
                    color={Colors.black}
                  />
                  <Text style={styles.infoText} allowFontScaling={false}>
                    {formattedDistance}km
                  </Text>
                </View>
              )}
              {/* <View style={styles.infoItem}>
                <AntDesign name="star" size={18} color={Colors.yellow} />
                <Text style={styles.infoText} allowFontScaling={false}>
                  {detail?.total_reviews}
                </Text>
              </View> */}
              <Pressable
                style={styles.favoriteButton}
                onPress={() => {
                  if (!likedItems[detail?.id]) {
                    onLike(detail?.id, false);
                  } else {
                    onDisLike(detail?.id, false);
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
          <Text style={styles.vendorName} allowFontScaling={false}>
            {detail?.shop_name}
          </Text>
          {detail?.address !== '' && (
            <View style={styles.locationContainer}>
              <Ionicons
                name="location-outline"
                size={15}
                color={Colors.gray15}
              />
              <Text style={styles.locationText} allowFontScaling={false}>
                {detail?.address}
              </Text>
            </View>
          )}
          <Text style={styles.description} allowFontScaling={false}>
            {detail?.description}
          </Text>
          <View>
            {detail &&
              detail?.business_hours?.map(item => (
                <Text
                  key={item.id}
                  style={styles.openStatus}
                  allowFontScaling={false}>
                  Open {'  '}
                  <Text style={styles.openTime} allowFontScaling={false}>
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
          <Text style={styles.sectionTitle} allowFontScaling={false}>
            Product for you
          </Text>
          <FlatList
            data={detail?.products}
            renderItem={({item}) => {
             
              
            
             
              return (
                <Pressable
                  style={styles.productContainer}
                  onPress={() =>
                    navigation.navigate('WineDetail', {item: item?.id})
                  }>
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
                      <Text
                        style={styles.productTitle}
                        numberOfLines={1}
                        allowFontScaling={false}>
                        {item?.name} ({item?.title})
                      </Text>
                      <Pressable
                        onPress={() => {
                          if (!suggestionLikes[item?.id]) {
                            onLike(item?.id, true);
                          } else {
                            onDisLike(item?.id, true);
                          }
                        }}>
                        <AntDesign
                          size={20}
                          name={suggestionLikes[item?.id] ? 'heart' : 'hearto'}
                          color={
                            suggestionLikes[item?.id]
                              ? Colors.red
                              : Colors.black
                          }
                        />
                      </Pressable>
                    </View>

                    <View style={styles.productFooter}>
                      <Pressable
                        style={styles.viewMoreButton}
                        onPress={() =>
                          navigation.navigate('WineDetail', {item: item?.id})
                        }>
                        <Text
                          style={styles.viewMoreText}
                          allowFontScaling={false}>
                          View More
                        </Text>
                      </Pressable>

                      <View style={styles.bottomRight}>
                        <View style={styles.ratingContainer}>
                          <AntDesign
                            name="star"
                            size={16}
                            color={Colors.yellow}
                          />
                          <Text
                            style={styles.infoText}
                            allowFontScaling={false}>
                            {item?.average_rating || '0.0'}
                          </Text>
                        </View>
                        <Text style={styles.priceText} allowFontScaling={false}>
                          £ {item?.price}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <Text style={{marginVertical: 20, color: '#888'}}>
                No products available.
              </Text>
            }
          />

          <Text style={styles.sectionTitle} allowFontScaling={false}>
            Offers
          </Text>

          <FlatList
            data={detail?.offers || []}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              gap: 10,
              paddingVertical: 8,
            }}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <View
                style={{
                  width: 250,
                  borderRadius: 16,
                  backgroundColor: Colors.white,
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }}>
                {/* Image */}
                <Image
                  source={{uri: item.image}}
                  style={{
                    width: '100%',
                    height: 140,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                  }}
                  resizeMode="cover"
                />

                {/* Content */}
                <View style={{padding: 12}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Fonts.InterBold,
                      color: Colors.black,
                      marginBottom: 4,
                    }}
                    numberOfLines={1}
                    allowFontScaling={false}>
                    {item?.name}
                  </Text>

                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: Fonts.InterRegular,
                      color: Colors.black,
                      marginBottom: 4,
                    }}
                    numberOfLines={2}
                    allowFontScaling={false}>
                    {item?.offer_desc}
                  </Text>

                  {item?.discount?.name && (
                    <Text
                      style={{
                        fontSize: 13,
                        color: Colors.primary,
                        fontFamily: Fonts.InterMedium,
                        marginTop: 2,
                      }}
                      allowFontScaling={false}>
                      🎁 {item.discount.name}% OFF
                    </Text>
                  )}

                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: Fonts.InterRegular,
                      color: Colors.gray15,
                      marginTop: 6,
                    }}
                    allowFontScaling={false}>
                    {formatDate(item.from_date)} - {formatDate(item.to_date)}
                  </Text>
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <Text
                style={{
                  textAlign: 'center',
                  marginVertical: 20,
                  color: '#888',
                }}>
                No Offers right now.
              </Text>
            )}
          />

          <Text style={styles.sectionTitle} allowFontScaling={false}>
            Image Gallery
          </Text>
          <FlatList
            data={detail?.vendor_images || []}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              gap: 10,
              // paddingHorizontal: 16,
              paddingVertical: 8,
            }}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <View
                style={{
                  padding: 10,
                  borderWidth: 1,
                  borderColor: Colors.gray10,
                  borderRadius: 10,
                }}>
                <Image
                  source={{uri: item?.image}}
                  style={{height: 100, width: 100}}
                  resizeMode="contain"
                />
              </View>
            )}
            ListEmptyComponent={() => (
              <Text
                style={{
                  marginVertical: 20,
                  color: '#888',
                }}>
                No images available.
              </Text>
            )}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.sectionTitle} allowFontScaling={false}>
              Review
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.InterRegular,
                color: Colors.black,
              }}
              onPress={() =>
                navigation.navigate('ReviewList', {
                  reviews: detail,
                  type: 'vendors',
                  data: data,
                })
              }>
              View All
            </Text>
          </View>

          <FlatList
            data={detail?.reviews}
            keyExtractor={(item, index) =>
              item?.id?.toString() || index.toString()
            }
            contentContainerStyle={{gap: 15}}
            renderItem={({item}) => (
              <View style={styles.card}>
                <View style={styles.header}>
                  <Image
                    source={{uri: item?.user?.image}}
                    style={styles.avatar}
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                      {item?.user?.first_name} {item?.user?.last_name}
                    </Text>
                    <Text style={styles.dateText}>
                      {dayjs(item?.created_at).fromNow()}
                    </Text>
                  </View>
                  {/* <View style={styles.ratingContainer}>
                    <AntDesign name="star" size={16} color={Colors.yellow} />
                    <Text style={styles.ratingText}>{item?.rating}</Text>
                  </View> */}
                </View>
                <Text style={styles.reviewText}>{item?.review}</Text>
              </View>
            )}
            ListEmptyComponent={() => (
              <Text
                style={{
                  marginVertical: 20,
                  color: '#888',
                }}>
                No review available.
              </Text>
            )}
          />
        </View>
      </ScrollView>

      {cartData?.length > 0 && (
        <Pressable
          style={{
            position: 'absolute',
            bottom: 20,
            alignSelf: 'center',
            width: '60%',
            paddingVertical: 12,
            backgroundColor: Colors.blue,
            borderRadius: 25,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
          }}
          onPress={() => setIsCartVisible(true)}>
          <Text
            style={{
              color: Colors.white,
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            View Cart ({cartData.length} items)
          </Text>
        </Pressable>
      )}

      {cartData?.length > 0 && (
        <AnimatedCartModal
          visible={isCartVisible}
          cartData={cartData}
          setIsCartVisible={setIsCartVisible}
          onClose={() => setIsCartVisible(false)}
          navigation={navigation}
          onRemoveItem={handleRemoveItem}
        />
      )}
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
    color: Colors.gray15,
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
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 5,
    backgroundColor: Colors.white,
    elevation: 4,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },

  productImage: {
    height: 90,
    width: 50,
    borderRadius: 6,
  },

  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 12,
  },

  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  productTitle: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },

  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  viewMoreButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: Colors.red,
    borderRadius: 12,
  },

  viewMoreText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
  },

  bottomRight: {
    alignItems: 'flex-end',
    gap: 4,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  infoText: {
    fontSize: 12,
    color: Colors.black,
    fontWeight: '600',
  },

  priceText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.green,
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
