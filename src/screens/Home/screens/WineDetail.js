import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors, Fonts} from '../../../constant/Styles';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import Modal from 'react-native-modal';
import WineHuntButton from '../../../common/WineHuntButton';
import PreferenceModal from '../../../Modal/PreferenceModal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../../helper/Constant';
import axios from 'axios';
import {showSucess, showWarning} from '../../../helper/Toastify';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProfile} from '../../../redux/slices/profileSlice';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import AnimatedCartModal from '../components/AnimatedCartModal';
import WineDetailSkeleton from '../Skeleton/WineDetailSkeleton';
import AnimatedCartButton from '../../../components/AnimatedCartButton';

dayjs.extend(relativeTime);

const {width} = Dimensions.get('window');

const WineDetail = props => {
  const id = props?.route?.params.item;
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState([]);
  const [detail, setDetail] = useState([]);
  const [likedItems, setLikedItems] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [cartData, setCartData] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.profile);
  const [suggestionLikes, setSuggestionLikes] = useState({});

  // Add back the missing constants and state
  const sizeList = [
    {
      id: 1,
      name: 'Small',
      price: 10,
    },
    {
      id: 2,
      name: 'Regular',
      price: 50,
    },
    {
      id: 3,
      name: 'Large',
      price: 100,
    },
  ];

  const [size, setSize] = useState(sizeList[0]?.id);

  const addonListData = [
    {
      id: 1,
      name: 'Black olives',
      price: 10,
    },
    {
      id: 2,
      name: 'Fruits',
      price: 20,
    },
    {
      id: 3,
      name: 'Snacks',
      price: 60,
    },
  ];
  const [addOn, setAddOn] = useState(addonListData[0]?.id);

  // Header Component
  const Header = ({navigation, onLike, likedItems, detail}) => (
    <View style={styles.headerContainer}>
      <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
        <Fontisto name="angle-left" size={15} color={Colors.black} />
      </Pressable>
      <Pressable
        onPress={() => {
          if (!likedItems[detail?.id]) {
            onLike(detail?.id);
          } else {
            onDisLike(detail?.id);
          }
        }}
        style={styles.iconButton}>
        <AntDesign
          size={15}
          name={likedItems[detail?.id] ? 'heart' : 'hearto'}
          color={likedItems[detail?.id] ? Colors.red : Colors.black}
        />
      </Pressable>
    </View>
  );

  // Wine Info Component
  const WineInfo = ({detail, navigation, userData, setShowModal}) => (
    <View style={styles.infoContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={styles.vendorName} allowFontScaling={false}>
          {detail?.user?.shop_name}
        </Text>
        <Pressable
          style={styles.vendorDetailButton}
          onPress={() => {
            navigation.navigate('VendorDetail', {
              item: detail?.user,
              userCoordinates: {
                latitude: userData?.latitude,
                longitude: userData?.longitude,
              },
            });
          }}>
          <Text style={styles.vendorDetailText} allowFontScaling={false}>
            Vendor Detail
          </Text>
        </Pressable>
      </View>
      <View>
        <Text
          style={styles.wineName}
          numberOfLines={1}
          allowFontScaling={false}>
          {detail?.name}
        </Text>
      </View>
      <PriceRow detail={detail} />
      <RatingContainer rating={detail?.average_rating} />
      <ActionButtons
        detail={detail}
        navigation={navigation}
        setShowModal={setShowModal}
      />
    </View>
  );

  // Price Row Component
  const PriceRow = ({detail}) => (
    <View style={styles.priceRow}>
      <Text style={styles.priceText} allowFontScaling={false}>
        Price{' '}
      </Text>
      <View style={styles.priceContainer}>
        {detail?.has_discount && (
          <Text style={styles.discountedPrice} allowFontScaling={false}>
            £{detail?.actual_price ?? '0.00'} /
          </Text>
        )}
        <Text style={styles.priceValue} allowFontScaling={false}>
          £{detail?.price ?? '0.00'}
        </Text>
      </View>
    </View>
  );

  // Rating Container Component
  const RatingContainer = ({rating}) => (
    <View style={styles.ratingContainer}>
      <AntDesign name="star" size={14} color={Colors.yellow} />
      <Text style={styles.ratingText} allowFontScaling={false}>
        {rating}
      </Text>
    </View>
  );

  // Action Buttons Component
  const ActionButtons = ({detail, navigation, setShowModal}) => (
    <View style={styles.buttonContainer}>
      {detail?.cart_type?.includes(1) && (
        <>
          {detail?.is_cart ? (
            <Pressable
              style={styles.button}
              onPress={() => navigation.navigate('Cart')}>
              <Text style={styles.buttonText} allowFontScaling={false}>
                Go To Cart
              </Text>
            </Pressable>
          ) : (
            <Pressable style={styles.button} onPress={() => setShowModal(true)}>
              <Text style={styles.buttonText} allowFontScaling={false}>
                Add To Cart
              </Text>
            </Pressable>
          )}
        </>
      )}

      {detail?.cart_type?.includes(2) && (
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('ScanCode')}>
          <Text style={styles.buttonText} allowFontScaling={false}>
            Try Me
          </Text>
        </Pressable>
      )}
    </View>
  );

  // Review Card Component
  const ReviewCard = ({review}) => (
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
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={16} color={Colors.yellow} />
          <Text style={styles.ratingText}>{review?.rating}</Text>
        </View>
      </View>
      <Text style={styles.reviewText}>{review?.review}</Text>
    </View>
  );

  // Suggested Wine Item Component
  const SuggestedWineItem = ({
    item,
    navigation,
    suggestionLikes,
    onLike,
    onDisLike,
    setShowModal,
    offers = [],
    milestones = [],
  }) => {
    // Determine if this item is an offer or milestone
    const isOffer = Array.isArray(offers) && offers.some(offer => offer.id === item.id);
    const isMilestone = Array.isArray(milestones) && milestones.some(prod => prod.id === item.id);

    return (
      <Pressable
        style={styles.productCardModern}
        onPress={() => navigation.replace('WineDetail', {item: item?.id})}>
        <View style={styles.productImageWrapper}>
          <Image
            source={
              item?.image ? {uri: item?.image} : require('../images/bottle.png')
            }
            style={styles.productImageModern}
            resizeMode="contain"
          />
          {/* Heart Icon Overlay */}
          <Pressable
            style={styles.heartIconOverlay}
            onPress={e => {
              e.stopPropagation();
              if (!suggestionLikes[item?.id]) {
                onLike(item?.id, true);
              } else {
                onDisLike(item?.id, true);
              }
            }}
            hitSlop={10}>
            <AntDesign
              size={22}
              name={suggestionLikes[item?.id] ? 'heart' : 'hearto'}
              color={suggestionLikes[item?.id] ? Colors.red : Colors.white}
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
            {item?.name} {item?.title ? `(${item?.title})` : ''}
          </Text>
          <View style={styles.priceRowModern}>
            {item?.has_discount && (
              <Text style={styles.originalPriceModern} allowFontScaling={false}>
                £ {item?.actual_price}
              </Text>
            )}
            <Text style={styles.priceTextModern} allowFontScaling={false}>
              £ {item?.price ?? '0.00'}
            </Text>
          </View>
          {item?.is_cart ? (
            <Pressable
              style={styles.viewMoreButtonModern}
              onPress={e => {
                e.stopPropagation();
                navigation.navigate('Cart');
              }}>
              <Text style={styles.viewMoreTextModern} allowFontScaling={false}>
                Go To Cart
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.viewMoreButtonModern}
              onPress={e => {
                e.stopPropagation();
                setShowModal(true);
              }}>
              <Text style={styles.viewMoreTextModern} allowFontScaling={false}>
                Add To Cart
              </Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    );
  };

  // Tab View Component
  const TabView = ({
    activeTab,
    setActiveTab,
    detail,
    navigation,
    suggestionLikes,
    onLike,
    onDisLike,
    setShowModal,
  }) => {
    const tab = [
      {id: 1, name: 'Descriptions'},
      {id: 2, name: 'Reviews'},
    ];

    return (
      <View style={{padding: 20}}>
        <FlatList
          data={tab}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <Pressable
              onPress={() => setActiveTab(item.id)}
              style={[
                styles.tabButton,
                {
                  borderBottomColor:
                    item.id === activeTab ? Colors.red : Colors.gray,
                },
              ]}>
              <Text
                style={[
                  styles.tabText,
                  {
                    fontWeight: item.id === activeTab ? 'bold' : 'normal',
                    color: item.id === activeTab ? Colors.black : 'black',
                  },
                ]}
                allowFontScaling={false}>
                {item.name}
              </Text>
            </Pressable>
          )}
        />

        {activeTab === 1 ? (
          <DescriptionTab
            detail={detail}
            navigation={navigation}
            suggestionLikes={suggestionLikes}
            onLike={onLike}
            onDisLike={onDisLike}
            setShowModal={setShowModal}
          />
        ) : (
          <ReviewsTab detail={detail} navigation={navigation} />
        )}
      </View>
    );
  };


  // Description Tab Component
  const DescriptionTab = ({
    detail,
    navigation,
    suggestionLikes,
    onLike,
    onDisLike,
    setShowModal,
  }) => (
    <View style={{paddingVertical: 20, gap: 20}}>
      <Text style={styles.descriptionText} allowFontScaling={false}>
        {detail?.product_desc}
      </Text>

      <Text style={styles.sectionTitle} allowFontScaling={false}>
        Suggested for you
      </Text>

      <FlatList
        data={detail?.suggestions}
        contentContainerStyle={{gap: 10}}
        scrollEnabled={false}
        renderItem={({item}) => (
          <SuggestedWineItem
            item={item}
            navigation={navigation}
            suggestionLikes={suggestionLikes}
            onLike={onLike}
            onDisLike={onDisLike}
            setShowModal={setShowModal}
            offers={detail?.offers}
            milestones={detail?.discounted_products}
          />
        )}
      />
    </View>
  );

  // Reviews Tab Component
  const ReviewsTab = ({detail, navigation}) => (
    <View style={{paddingVertical: 20, gap: 20}}>
      <Text style={styles.sectionTitle} allowFontScaling={false}>
        Image Gallery
      </Text>
      <FlatList
        data={detail?.product_images || []}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.galleryContainer}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={styles.galleryItem}>
            <Image
              source={{uri: item?.image}}
              style={styles.galleryImage}
              resizeMode="contain"
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText} allowFontScaling={false}>
            No images at this time
          </Text>
        )}
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
              type: 'wines',
              wineId: detail?.id,
            })
          }>
          View All
        </Text>
      </View>

      <FlatList
        data={detail?.product_reviews || []}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        contentContainerStyle={{gap: 15}}
        renderItem={({item}) => <ReviewCard review={item} />}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText} allowFontScaling={false}>
            No review at this time
          </Text>
        )}
      />
    </View>
  );

  // Cart Button Component
  const CartButton = ({cartData, setIsCartVisible}) => {
    if (!cartData?.length) return null;

    return (
      <AnimatedCartButton
        count={cartData.length}
        onPress={() => setIsCartVisible(true)}
        label="View Cart"
      />
    );
  };

  useEffect(() => {
    getProductDetail();
    getCartData();
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

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfile());
    }, [dispatch]),
  );


  const getProductDetail = async () => {
    const data = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(data)?.token;
    const url = Constants.baseUrl4 + Constants.wineDetail;
    setLoading(true);
    const body = {
      product_id: id,
    };
    try {
      const res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res?.status === 200) {
        const product = res?.data?.data;
        setLikedItems(prev => ({
          ...prev,
          [product?.id]: product?.is_wishlist,
        }));
        const suggestionLikesMap = {};
        if (product?.suggestions) {
          product.suggestions.forEach(suggestion => {
            suggestionLikesMap[suggestion.id] = suggestion.is_wishlist;
          });
        }
        setSuggestionLikes(suggestionLikesMap);
        setDetail(product);
      }
    } catch (error) {
      if (error.response) {
        console.log('Server Error:sssss', error.response.data);
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

  const onLike = async (id, isSuggestion = false) => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl7 + Constants.addToWishList;
    setLoading(true);
    const body = {
      product_id: id,
      type: 'wines',
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
      type: 'wines',
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

  const onAdd = async () => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;

    const url = Constants.baseUrl8 + Constants.addToCart;

    const body = {
      product_id: detail?.id,
      quantity: quantity,
      price_id: 1,
    };

    try {
      const res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res?.data?.status === 200) {
        setShowModal(false);
        showSucess(res?.data?.message);
        navigation.goBack();
      }
    } catch (error) {
      if (error.response) {
        console.log('Server Error:', error.response.data);
        showWarning(error.response.data?.error);
      } else if (error.request) {
        console.log('No Response:', error.request);
      } else {
        console.log('Request Error:', error.message);
      }
    }
  };

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

  return (
    <View
      style={[
        styles.container,
        {paddingTop: Platform.OS == 'ios' ? inset.top : 0},
      ]}>
      {loading ? (
        <WineDetailSkeleton />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}>
          <View style={styles.semiCircleContainer}>
            <Image
              source={detail?.user?.background ? {uri:detail?.user?.background} :require('../images/bg.png')}
              style={styles.semiCircleImage}
            />
          </View>
          <Header
            navigation={navigation}
            onLike={onLike}
            likedItems={likedItems}
            detail={detail}
          />

          <View style={styles.contentContainer}>
            {detail.product_images && (
              <Image
                source={
                  detail?.product_images[0]?.image &&
                  detail?.product_images.length > 0
                    ? {uri: detail?.product_images[0]?.image}
                    : require('../images/newbottle.png')
                }
                style={styles.bottleImage}
              />
            )}
            <WineInfo
              detail={detail}
              navigation={navigation}
              userData={userData}
              setShowModal={setShowModal}
            />
          </View>

          <TabView
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            detail={detail}
            navigation={navigation}
            suggestionLikes={suggestionLikes}
            onLike={onLike}
            onDisLike={onDisLike}
            setShowModal={setShowModal}
          />
        </ScrollView>
      )}

      <CartButton cartData={cartData} setIsCartVisible={setIsCartVisible} />

      {cartData?.length > 0 && (
        <AnimatedCartModal
          visible={isCartVisible}
          setIsCartVisible={setIsCartVisible}
          cartData={cartData}
          onClose={() => setIsCartVisible(false)}
          navigation={navigation}
          onRemoveItem={handleRemoveItem}
        />
      )}

      <PreferenceModal
        AddonList={addonListData}
        addOn={addOn}
        setAddOn={setAddOn}
        setShowModal={setShowModal}
        setSize={setSize}
        showModal={showModal}
        size={size}
        sizeList={sizeList}
        quantity={quantity}
        setQuantity={setQuantity}
        onAdd={() => onAdd()}
      />
    </View>
  );
};

export default WineDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  semiCircleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    overflow: 'hidden',
    height: 250,
    width: '100%',
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 250,
    borderBottomRightRadius: 250,
  },
  semiCircleImage: {
    height: 250,
    width: '100%',
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    resizeMode: 'cover',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  iconButton: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 40,
    gap: 4,
  },
  bottleImage: {
    height: 280,
    width: 70,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  infoContainer: {
    flex: 1,
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  vendorName: {
    fontSize: 15,
    fontFamily: Fonts.InterMedium,
    fontWeight: '800',
    color: Colors.black,
    flex: 1,
  },
  wineName: {
    fontSize: 13,
    fontFamily: Fonts.InterMedium,
    fontWeight: '800',
    color: Colors.black,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  priceText: {
    fontSize: 13,
    fontFamily: Fonts.InterMedium,
    fontWeight: '800',
    color: Colors.black,
  },
  priceValue: {
    color: Colors.red,
    fontSize: 13,
    fontWeight: '700',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  ratingText: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  button: {
    padding: 6,
    paddingHorizontal: 20,
    backgroundColor: Colors.red,
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 12,
    fontFamily: Fonts.InterMedium,
    fontWeight: '800',
    color: Colors.white,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray14,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray10,
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontFamily: Fonts.InterSemiBold,
    color: Colors.black,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 13,
    color: Colors.gray15,
    fontFamily: Fonts.InterRegular,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '600',
    fontFamily: Fonts.InterMedium,
  },
  reviewText: {
    fontSize: 15,
    color: Colors.gray8,
    lineHeight: 22,
    fontFamily: Fonts.InterRegular,
  },
  vendorDetailButton: {
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: Colors.green,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vendorDetailText: {
    fontSize: 12,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
    color: Colors.white,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  discountedPrice: {
    textDecorationLine: 'line-through',
    color: Colors.gray,
    fontSize: 14,
    fontFamily: Fonts.InterRegular,
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
  tabButton: {
    width: width / 2,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    backgroundColor: '#FFF',
  },
  tabText: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    lineHeight: 22,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.PhilosopherBold,
    color: Colors.black,
  },
  galleryContainer: {
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  galleryItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.gray10,
    borderRadius: 16,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  galleryImage: {
    height: 120,
    width: 120,
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: Fonts.InterMedium,
    color: Colors.blue,
    textDecorationLine: 'underline',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    fontFamily: Fonts.InterMedium,
    textAlign: 'center',
    marginTop: 20,
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: '70%',
    paddingVertical: 14,
    backgroundColor: Colors.blue,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  cartButtonText: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: Fonts.InterSemiBold,
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
