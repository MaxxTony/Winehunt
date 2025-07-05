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
import AnimatedCartButton from '../../../components/AnimatedCartButton';

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
    <Pressable
      style={({pressed}) => [
        styles.contactOptionIconModern,
        pressed && styles.contactOptionIconPressed,
      ]}
      android_ripple={{color: '#e0e0e0', borderless: true}}
      onPress={() => onContactPress(item.name)}>
      <Image source={item.image} style={styles.contactImageModern} />
      <Text style={styles.contactOptionTextModern}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.contactListModern}>
      {contactOptions.map(option => (
        <View key={option.id} style={styles.contactOptionContainerModern}>
          {renderContactOption({item: option})}
        </View>
      ))}
    </View>
  );
});

const ProductCard = React.memo(({item, onLike, isLiked, onPress, isOffer, isMilestone}) => (
  <Pressable style={styles.productCardModern} onPress={onPress}>
    <View style={styles.productImageWrapper}>
      <Image
        source={
          item?.product_images[0]?.image
            ? {uri: item?.product_images[0]?.image}
            : require('../images/bottle.png')
        }
        style={styles.productImageModern}
        resizeMode="contain"
      />
      {/* Heart Icon Overlay */}
      <Pressable style={styles.heartIconOverlay} onPress={onLike} hitSlop={10}>
        <AntDesign
          size={22}
          name={isLiked ? 'heart' : 'hearto'}
          color={isLiked ? Colors.red : Colors.white}
        />
      </Pressable>
      {/* Rating Overlay */}
      <View style={styles.ratingOverlay}>
        <AntDesign name="star" size={16} color={Colors.yellow} />
        <Text style={styles.ratingTextModern} allowFontScaling={false}>
          {item?.average_rating || '0.0'}
        </Text>
      </View>
      {/* Offer and Milestone Badges */}
      {isOffer && (
        <View style={[styles.productBadge, {backgroundColor: Colors.primary, top: 10, left: 10}]}> 
          <Text style={styles.productBadgeText}>Offer</Text>
        </View>
      )}
      {isMilestone && (
        <View style={[styles.productBadge, {backgroundColor: Colors.green, top: 40, left: 10}]}> 
          <Text style={styles.productBadgeText}>Milestone</Text>
        </View>
      )}
    </View>
    <View style={styles.productInfoModern}>
      <Text
        style={styles.productTitleModern}
        numberOfLines={1}
        allowFontScaling={false}>
        {item?.name}
      </Text>
      <View style={styles.priceRowModern}>
        {item?.has_discount && (
          <Text style={styles.originalPriceModern} allowFontScaling={false}>
            £ {item?.actual_price}
          </Text>
        )}
        <Text style={styles.priceTextModern} allowFontScaling={false}>
          £ {item?.price}
        </Text>
      </View>
      <Pressable style={styles.viewMoreButtonModern} onPress={onPress}>
        <Text style={styles.viewMoreTextModern} allowFontScaling={false}>
          View More
        </Text>
      </Pressable>
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
  console.log(data,"vendor k liye data")
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
          vendor_id: data?.user_id || data?.id  || data?.userId,
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
          <View style={styles.vendorInfoSection}>
            <Text style={styles.vendorName} allowFontScaling={false}>
              {detail?.shop_name}
            </Text>

            {detail?.address && (
              <View style={styles.locationContainer}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={Colors.gray15}
                />
                <Text style={styles.locationText} allowFontScaling={false}>
                  {detail?.address}
                </Text>
              </View>
            )}

            {detail?.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.description} allowFontScaling={false}>
                  {detail?.description}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle} allowFontScaling={false}>
              Business Hours
            </Text>
          </View>

          {/* Modernized Business Hours Section - Creative UI */}
          {detail?.business_hours && detail?.business_hours.length > 0 && (
            <View style={styles.businessHoursModernCard}>
              {detail.business_hours.map((item, index) => (
                <View key={item.id} style={styles.businessHoursModernRow}>
                  <Ionicons name="time-outline" size={20} color={Colors.primary} style={styles.businessHoursIcon} />
                  <Text style={styles.businessHoursModernDay}>{item.weekday}</Text>
                  <View style={styles.businessHoursPill}>
                    <Text style={styles.businessHoursModernTime}>
                      {formatTime(item.open_time)} - {formatTime(item.close_time)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <ContactOptions onContactPress={handleContactPress} />

          <View style={styles.separator} />

          {/* Milestone Rewards Section */}
          {detail?.discounted_products && detail.discounted_products.length > 0 && (
            <>
              <Text style={styles.milestoneLabel} allowFontScaling={false}>
                Milestone Rewards
              </Text>
              <FlatList
                data={detail.discounted_products}
                horizontal
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                contentContainerStyle={styles.milestoneListContainer}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <View style={styles.milestoneCard}>
                    <View style={styles.milestoneCardHeader}>
                      <Text style={styles.milestoneProductName} numberOfLines={1} allowFontScaling={false}>
                        {item.name}
                      </Text>
                      <View style={styles.milestoneDiscountBadge}>
                        <Text style={styles.milestoneDiscountText} allowFontScaling={false}>
                          -{Number(item.discount).toFixed(0)} %
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.milestoneDesc} numberOfLines={2} allowFontScaling={false}>
                      {item.discount_desc}
                    </Text>
                    <View style={styles.milestonePriceRow}>
                      <Text style={styles.milestoneActualPrice} allowFontScaling={false}>
                        £ {item.actual_price}
                      </Text>
                      <Text style={styles.milestoneFinalPrice} allowFontScaling={false}>
                        £ {item.final_price}
                      </Text>
                    </View>
                  </View>
                )}
                ListEmptyComponent={null}
              />
            </>
          )}

          <Text style={styles.sectionTitle} allowFontScaling={false}>
            Product for you
          </Text>

        
          <FlatList
            data={detail?.products}
            renderItem={({item}) => {
              // Check if product is in offers or milestone
              const isOffer = (detail?.offers || []).some(offer => offer.id === item.id);
              const isMilestone = (detail?.discounted_products || []).some(prod => prod.id === item.id);
              return (
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
                  isOffer={isOffer}
                  isMilestone={isMilestone}
                />
              );
            }}
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
        <AnimatedCartButton
          count={cartData.length}
          onPress={() => setIsCartVisible(true)}
          label="View Cart"
        />
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
    fontSize: 22,
    fontFamily: Fonts.PhilosopherBold,
    color: Colors.black,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 4,
  },
  locationText: {
    fontSize: 14,
    fontFamily: Fonts.InterRegular,
    color: Colors.gray15,
    flex: 1,
    lineHeight: 20,
  },
  description: {
    fontSize: 15,
    fontFamily: Fonts.InterRegular,
    color: Colors.black,
    lineHeight: 22,
  },
  openStatus: {
    fontSize: 12,
    fontFamily: Fonts.InterBold,
    color: Colors.green,
    fontWeight: '600',
    backgroundColor: Colors.green + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  openTime: {
    color: Colors.gray8,
    fontSize: 13,
    fontWeight: '500',
    fontFamily: Fonts.InterMedium,
  },
  contactListModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 18,
    gap: 0,
  },
  contactOptionContainerModern: {
    alignItems: 'center',
    flex: 1,
  },
  contactOptionIconModern: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'center',
    transitionDuration: '150ms',
  },
  contactOptionIconPressed: {
    backgroundColor: '#e0e0e0',
    transform: [{scale: 0.96}],
  },
  contactImageModern: {
    height: 28,
    width: 28,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  contactOptionTextModern: {
    fontSize: 13,
    fontFamily: Fonts.InterMedium,
    color: Colors.gray8,
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 0.1,
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
  productCardModern: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginVertical: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: 12,
  },
  productImageWrapper: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.gray13,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageModern: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  heartIconOverlay: {
    position: 'absolute',
    top: 10,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 16,
    padding: 4,
    zIndex: 2,
  },
  ratingOverlay: {
    position: 'absolute',
    top: 10,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    zIndex: 2,
  },
  ratingTextModern: {
    fontSize: 13,
    color: Colors.black,
    fontWeight: '600',
    marginLeft: 3,
  },
  productInfoModern: {
    width: '92%',
    alignSelf: 'center',
    marginTop: 12,
    alignItems: 'flex-start',
  },
  productTitleModern: {
    fontSize: 16,
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    marginBottom: 4,
  },
  priceRowModern: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  originalPriceModern: {
    fontSize: 13,
    color: Colors.gray15,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  priceTextModern: {
    fontSize: 15,
    color: Colors.green,
    fontWeight: 'bold',
  },
  viewMoreButtonModern: {
    marginTop: 2,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
  },
  viewMoreTextModern: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
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
  cartButtonModern: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 180,
    left: 30,
    right: 30,
  },
  cartButtonContentModern: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cartButtonTextModern: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.2,
    fontFamily: Fonts.InterBold,
  },
  cartBadgeModern: {
    backgroundColor: Colors.red,
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  cartBadgeTextModern: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Fonts.InterBold,
  },
  vendorInfoSection: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  descriptionContainer: {
    padding: 12,
    backgroundColor: Colors.gray13,
    borderRadius: 8,
  },
  businessHoursModernCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  businessHoursModernRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7,
    padding: 8,
    backgroundColor:Colors.gray13,
    borderRadius:10
  },
  businessHoursIcon: {
    marginRight: 10,
  },
  businessHoursModernDay: {
    fontSize: 15,
    fontFamily: Fonts.InterBold,
    color: Colors.primary,
    minWidth: 80,
    flex:1
  },
  businessHoursPill: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 14,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  businessHoursModernTime: {
    fontSize: 15,
    fontFamily: Fonts.InterMedium,
    color: Colors.gray8,
    letterSpacing: 0.1,
  },
  milestoneLabel: {
    fontSize: 18,
    fontFamily: Fonts.PhilosopherBold,
    color: Colors.primary,
    marginBottom: 8,
    marginTop: 10,
  },
  milestoneListContainer: {
    gap: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  milestoneCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginRight: 12,
    padding: 16,
    minWidth: 200,
    maxWidth: 220,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.gray14,
    justifyContent: 'space-between',
  },
  milestoneCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  milestoneProductName: {
    fontSize: 16,
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    flex: 1,
    marginRight: 8,
  },
  milestoneDiscountBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  milestoneDiscountText: {
    color: Colors.white,
    fontSize: 13,
    fontFamily: Fonts.InterMedium,
    fontWeight: 'bold',
  },
  milestoneDesc: {
    fontSize: 13,
    color: Colors.gray8,
    fontFamily: Fonts.InterRegular,
    marginBottom: 8,
    marginTop: 2,
  },
  milestonePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  milestoneActualPrice: {
    fontSize: 14,
    color: Colors.gray15,
    textDecorationLine: 'line-through',
    marginRight: 8,
    fontFamily: Fonts.InterRegular,
  },
  milestoneFinalPrice: {
    fontSize: 16,
    color: Colors.green,
    fontWeight: 'bold',
    fontFamily: Fonts.InterBold,
  },
  productBadge: {
    position: 'absolute',
    zIndex: 3,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  productBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Fonts.InterBold,
  },
});

export default VendorDetail;
