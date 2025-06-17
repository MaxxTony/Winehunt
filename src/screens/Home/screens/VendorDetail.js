import React, {useEffect, useState, useCallback, useMemo} from 'react';
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
  ActivityIndicator,
  Animated,
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
import ImageView from 'react-native-image-viewing';

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

const formatDate = dateStr => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const VendorHeader = React.memo(
  ({detail, onBack, onLike, isLiked, distance}) => (
    <ImageBackground
      source={
        detail?.background
          ? {uri: detail?.background}
          : require('../images/bg.png')
      }
      style={styles.headerBackground}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <View style={styles.backButtonInner}>
          <Fontisto name="angle-left" size={20} color={Colors.white} />
        </View>
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
                {formatNumber(distance)}km
              </Text>
            </View>
          )}
          <Pressable style={styles.favoriteButton} onPress={onLike}>
            <AntDesign
              size={18}
              name={isLiked ? 'heart' : 'hearto'}
              color={isLiked ? Colors.red : Colors.black}
            />
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  ),
);

const ContactOptions = React.memo(({onContactPress}) => {
  const contactOptions = [
    {id: 1, name: 'Call', image: require('../images/call.png')},
    {id: 2, name: 'Message', image: require('../images/sms.png')},
    {id: 3, name: 'View Map', image: require('../images/location.png')},
    {id: 4, name: 'Website', image: require('../images/global.png')},
  ];

  const renderContactOption = ({item}) => (
    <View style={styles.contactOptionContainer}>
      <Pressable
        style={styles.contactOptionIcon}
        onPress={() => onContactPress(item.name)}>
        <Image source={item.image} style={styles.contactImage} />
      </Pressable>
      <Text style={styles.contactOptionText}>{item.name}</Text>
    </View>
  );

  return (
    <FlatList
      data={contactOptions}
      horizontal
      scrollEnabled={false}
      contentContainerStyle={styles.contactList}
      renderItem={renderContactOption}
    />
  );
});

const ProductCard = React.memo(({item, onLike, isLiked, onPress}) => (
  <Pressable style={styles.productContainer} onPress={onPress}>
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
        <Pressable onPress={onLike}>
          <AntDesign
            size={20}
            name={isLiked ? 'heart' : 'hearto'}
            color={isLiked ? Colors.red : Colors.black}
          />
        </Pressable>
      </View>

      <View style={styles.productFooter}>
        <Pressable style={styles.viewMoreButton} onPress={onPress}>
          <Text style={styles.viewMoreText} allowFontScaling={false}>
            View More
          </Text>
        </Pressable>

        <View style={styles.bottomRight}>
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={16} color={Colors.yellow} />
            <Text style={styles.infoText} allowFontScaling={false}>
              {item?.average_rating || '0.0'}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            {item?.has_discount && (
              <Text style={styles.originalPrice} allowFontScaling={false}>
                £ {item?.actual_price}
              </Text>
            )}
            <Text style={styles.priceText} allowFontScaling={false}>
              £ {item?.price}
            </Text>
          </View>
        </View>
      </View>
    </View>
  </Pressable>
));

const ReviewCard = React.memo(({review}) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Image source={{uri: review?.user?.image}} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {review?.user?.first_name} {review?.user?.last_name}
        </Text>
        <Text style={styles.dateText}>
          {dayjs(review?.created_at).fromNow()}
        </Text>
      </View>
    </View>
    <Text style={styles.reviewText}>{review?.review}</Text>
  </View>
));

const SkeletonLoader = () => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.loadingContainer}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonBackButton} />
        <View style={styles.skeletonShopInfo}>
          <View style={styles.skeletonShopImage} />
          <View style={styles.skeletonShopDetails}>
            <Animated.View style={[styles.skeletonText, {opacity}]} />
            <Animated.View
              style={[styles.skeletonText, {opacity, width: '60%'}]}
            />
          </View>
        </View>
      </View>

      <View style={styles.skeletonContent}>
        <Animated.View style={[styles.skeletonTitle, {opacity}]} />
        <Animated.View style={[styles.skeletonText, {opacity, width: '80%'}]} />
        <Animated.View style={[styles.skeletonText, {opacity, width: '90%'}]} />

        <View style={styles.skeletonContactOptions}>
          {[1, 2, 3, 4].map(item => (
            <Animated.View
              key={item}
              style={[styles.skeletonContactItem, {opacity}]}
            />
          ))}
        </View>

        <View style={styles.skeletonSeparator} />

        <Animated.View style={[styles.skeletonTitle, {opacity}]} />
        {[1, 2, 3].map(item => (
          <View key={item} style={styles.skeletonProductCard}>
            <Animated.View style={[styles.skeletonProductImage, {opacity}]} />
            <View style={styles.skeletonProductDetails}>
              <Animated.View
                style={[styles.skeletonText, {opacity, width: '70%'}]}
              />
              <Animated.View
                style={[styles.skeletonText, {opacity, width: '40%'}]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const VendorDetail = props => {
  const navigation = useNavigation();
  const data = props?.route?.params?.item;
  const isFocused = useIsFocused();
  const userCoords = props?.route?.params?.userCoordinates;
  const inset = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [likedItems, setLikedItems] = useState({});
  const [suggestionLikes, setSuggestionLikes] = useState({});
  const [vendorCoordinates, setVendorCoordinates] = useState({});
  const [cartData, setCartData] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  const distance = useMemo(
    () => haversine(userCoords, vendorCoordinates, {unit: 'km'}),
    [userCoords, vendorCoordinates],
  );

  const getCartData = useCallback(async () => {
    try {
      const info = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(info)?.token;
      const res = await axios.get(Constants.baseUrl8 + Constants.getCart, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setCartData(res?.data?.cart);
    } catch (error) {
      showWarning(error.response?.data?.message || 'Error fetching cart');
    }
  }, []);

  const getVendorDetail = useCallback(async () => {
    try {
      setLoading(true);
      const info = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(info)?.token;
      const res = await axios.post(
        Constants.baseUrl5 + Constants.vendorDetail,
        {
          vendor_id: data?.product?.user_id ? data?.product?.user_id : data?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (res?.status === 200) {
        const vendorData = res?.data?.data;
        setDetail(vendorData);
        setVendorCoordinates({
          latitude: vendorData?.latitude,
          longitude: vendorData?.longitude,
        });
        setLikedItems(prev => ({
          ...prev,
          [vendorData?.id]: vendorData?.is_wishlist,
        }));

        if (vendorData.vendor_images?.length > 0) {
          setImages(vendorData.vendor_images.map(img => ({uri: img?.image})));
        }

        const suggestionLikesMap = {};
        if (vendorData?.products) {
          vendorData?.products.forEach(suggestion => {
            suggestionLikesMap[suggestion.id] = suggestion.is_wishlist;
          });
        }
        setSuggestionLikes(suggestionLikesMap);
      }
    } catch (error) {
      showWarning(
        error.response?.data?.message || 'Error fetching vendor details',
      );
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (isFocused) {
      getVendorDetail();
      getCartData();
    }
  }, [isFocused, getVendorDetail, getCartData]);

  const handleContactPress = useCallback(
    type => {
      if (!detail) return;

      switch (type) {
        case 'Call':
          if (detail.phone) Linking.openURL(`tel:${detail.phone}`);
          break;
        case 'Message':
          if (detail.email) Linking.openURL(`mailto:${detail.email}`);
          break;
        case 'View Map':
          if (detail.latitude && detail.longitude) {
            const url =
              Platform.OS === 'ios'
                ? `maps://app?saddr=${detail.latitude},${detail.longitude}`
                : `geo:${detail.latitude},${detail.longitude}?q=${detail.latitude},${detail.longitude}`;
            Linking.openURL(url);
          }
          break;
        case 'Website':
          if (detail.website) Linking.openURL(detail.website);
          break;
      }
    },
    [detail],
  );

  const handleLike = useCallback(async (id, isSuggestion = false) => {
    try {
      const info = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(info)?.token;
      const res = await axios.post(
        Constants.baseUrl7 + Constants.addToWishList,
        {
          type: isSuggestion ? 'wines' : 'vendors',
          [isSuggestion ? 'product_id' : 'vendor_id']: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (res?.data?.status === 200) {
        if (isSuggestion) {
          setSuggestionLikes(prev => ({...prev, [id]: true}));
        } else {
          setLikedItems(prev => ({...prev, [id]: true}));
        }
        showSucess(res?.data?.message);
      }
    } catch (error) {
      showWarning(error.response?.data?.message || 'Error updating wishlist');
    }
  }, []);

  const handleDislike = useCallback(async (id, isSuggestion = false) => {
    try {
      const info = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(info)?.token;
      const res = await axios.post(
        Constants.baseUrl7 + Constants.removeToWishList,
        {
          id: id,
          type: isSuggestion ? 'wines' : 'vendors',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (res?.data?.status === 200) {
        if (isSuggestion) {
          setSuggestionLikes(prev => ({...prev, [id]: false}));
        } else {
          setLikedItems(prev => ({...prev, [id]: false}));
        }
        showWarning(res?.data?.message);
      }
    } catch (error) {
      showWarning(error.response?.data?.message || 'Error updating wishlist');
    }
  }, []);

  const handleRemoveItem = useCallback(
    async itemId => {
      try {
        const info = await AsyncStorage.getItem('userDetail');
        const token = JSON.parse(info)?.token;
        const res = await axios.post(
          Constants.baseUrl8 + Constants.deleteCart,
          {id: itemId},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        if (res?.data?.status === 200) {
          getCartData();
        }
      } catch (error) {
        showWarning(error.response?.data?.message || 'Error updating cart');
      }
    },
    [getCartData],
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          {paddingTop: Platform.OS === 'ios' ? inset.top : 0},
        ]}>
        <VendorHeader
          detail={detail}
          onBack={() => navigation.goBack()}
          onLike={() =>
            likedItems[detail?.id]
              ? handleDislike(detail?.id)
              : handleLike(detail?.id)
          }
          isLiked={likedItems[detail?.id]}
          distance={distance}
        />

        <View style={styles.contentContainer}>
          <Text style={styles.vendorName} allowFontScaling={false}>
            {detail?.shop_name}
          </Text>

          {detail?.address && (
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

          {detail?.business_hours?.map(item => (
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

          <ContactOptions onContactPress={handleContactPress} />

          <View style={styles.separator} />

          <Text style={styles.sectionTitle} allowFontScaling={false}>
            Product for you
          </Text>

          <FlatList
            data={detail?.products}
            renderItem={({item}) => (
              <ProductCard
                item={item}
                onLike={() =>
                  suggestionLikes[item?.id]
                    ? handleDislike(item?.id, true)
                    : handleLike(item?.id, true)
                }
                isLiked={suggestionLikes[item?.id]}
                onPress={() =>
                  navigation.navigate('WineDetail', {item: item?.id})
                }
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No products available.</Text>
            }
          />

          <Text style={styles.sectionTitle} allowFontScaling={false}>
            Offers
          </Text>

          <FlatList
            data={detail?.offers || []}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.offersContainer}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <Pressable
                style={styles.offerCard}
                onPress={() =>
                  navigation.navigate('WineDetail', {item: item?.id})
                }>
                <ImageBackground
                  source={{uri: item.image}}
                  style={styles.offerImageBackground}
                  imageStyle={styles.offerImageStyle}>
                  <View style={styles.offerContent}>
                    <Text
                      style={styles.offerTitle}
                      numberOfLines={1}
                      allowFontScaling={false}>
                      {item?.name}
                    </Text>
                    <Text
                      style={styles.offerDescription}
                      numberOfLines={2}
                      allowFontScaling={false}>
                      {item?.offer_desc}
                    </Text>
                    {item?.discount?.name && (
                      <View style={styles.discountContainer}>
                        <Text
                          style={styles.discountText}
                          allowFontScaling={false}>
                          🎁 {item.discount.name}% OFF
                        </Text>
                      </View>
                    )}
                    <Text style={styles.offerDate} allowFontScaling={false}>
                      {formatDate(item.from_date)} - {formatDate(item.to_date)}
                    </Text>
                  </View>
                </ImageBackground>
              </Pressable>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Offers right now.</Text>
            }
          />

          <Text style={styles.sectionTitle} allowFontScaling={false}>
            Image Gallery
          </Text>

          <FlatList
            data={detail?.vendor_images || []}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.galleryContainer}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <Pressable
                style={styles.galleryItem}
                onPress={() => {
                  setSelectedImageIndex(index);
                  setIsImageViewVisible(true);
                }}>
                <Image
                  source={{uri: item?.image}}
                  style={styles.galleryImage}
                  resizeMode="contain"
                />
              </Pressable>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No images available.</Text>
            }
          />

          <View style={styles.reviewHeader}>
            <Text style={styles.sectionTitle} allowFontScaling={false}>
              Review
            </Text>
            <Text
              style={styles.viewAllText}
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
            contentContainerStyle={styles.reviewsContainer}
            renderItem={({item}) => <ReviewCard review={item} />}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No review available.</Text>
            }
          />
        </View>
      </ScrollView>

      {cartData?.length > 0 && (
        <Pressable
          style={styles.cartButton}
          onPress={() => setIsCartVisible(true)}>
          <Text style={styles.cartButtonText}>
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

      <ImageView
        images={images}
        imageIndex={selectedImageIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  skeletonHeader: {
    height: 250,
    backgroundColor: Colors.gray4,
    marginBottom: 100,
  },
  skeletonBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray10,
    margin: 20,
  },
  skeletonShopInfo: {
    flexDirection: 'row',
    padding: 20,
    position: 'absolute',
    bottom: -100,
  },
  skeletonShopImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: Colors.gray10,
  },
  skeletonShopDetails: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
    gap: 10,
  },
  skeletonContent: {
    padding: 20,
    gap: 15,
  },
  skeletonTitle: {
    height: 24,
    backgroundColor: Colors.gray10,
    borderRadius: 4,
    width: '40%',
  },
  skeletonText: {
    height: 16,
    backgroundColor: Colors.gray10,
    borderRadius: 4,
    width: '100%',
  },
  skeletonContactOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  skeletonContactItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.gray10,
  },
  skeletonSeparator: {
    height: 1,
    backgroundColor: Colors.gray4,
    marginVertical: 20,
  },
  skeletonProductCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginVertical: 6,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  skeletonProductImage: {
    width: 50,
    height: 90,
    borderRadius: 6,
    backgroundColor: Colors.gray10,
  },
  skeletonProductDetails: {
    flex: 1,
    gap: 10,
  },
  container: {
    backgroundColor: Colors.white,
    paddingBottom: 80,
  },
  headerBackground: {
    width: '100%',
    height: 250,
    marginBottom: 100,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    zIndex: 1,
  },
  backButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfoContainer: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: -100,
  },
  shopImage: {
    height: 100,
    width: 100,
    borderRadius: 10,
  },
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
  favoriteButton: {
    marginHorizontal: 10,
  },
  contentContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
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
  openTime: {
    color: Colors.gray4,
    fontSize: 12,
    fontWeight: '400',
  },
  contactList: {
    gap: 20,
  },
  contactOptionContainer: {
    alignItems: 'center',
    gap: 5,
  },
  contactOptionIcon: {
    padding: 10,
    borderWidth: 1,
    alignItems: 'center',
    borderRadius: 100,
    borderColor: Colors.gray4,
  },
  contactImage: {
    height: 20,
    width: 20,
  },
  contactOptionText: {
    fontSize: 14,
    fontFamily: Fonts.InterRegular,
    color: Colors.black,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.gray4,
  },
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
  priceContainer: {
    alignItems: 'flex-end',
    gap: 2,
  },
  originalPrice: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.gray15,
    textDecorationLine: 'line-through',
  },
  priceText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.green,
  },
  offersContainer: {
    gap: 10,
    paddingVertical: 8,
  },
  offerCard: {
    width: 250,
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  offerImageBackground: {
    width: '100%',
    height: '100%',
  },
  offerImageStyle: {
    borderRadius: 16,
  },
  offerContent: {
    flex: 1,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  offerTitle: {
    fontSize: 18,
    fontFamily: Fonts.InterBold,
    color: Colors.white,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  offerDescription: {
    fontSize: 13,
    fontFamily: Fonts.InterRegular,
    color: Colors.white,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  discountContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  discountText: {
    fontSize: 13,
    color: Colors.white,
    fontFamily: Fonts.InterMedium,
  },
  offerDate: {
    fontSize: 11,
    fontFamily: Fonts.InterRegular,
    color: Colors.white,
    marginTop: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  galleryContainer: {
    gap: 10,
    paddingVertical: 8,
  },
  galleryItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray10,
    borderRadius: 10,
  },
  galleryImage: {
    height: 100,
    width: 100,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: Fonts.InterRegular,
    color: Colors.black,
  },
  reviewsContainer: {
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
  reviewText: {
    fontSize: 15,
    color: Colors.gray8,
    lineHeight: 20,
    fontFamily: Fonts.InterRegular,
  },
  emptyText: {
    marginVertical: 20,
    color: '#888',
    textAlign: 'center',
  },
  cartButton: {
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
  },
  cartButtonText: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VendorDetail;
