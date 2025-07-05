import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect, useState, useMemo, useRef} from 'react';
import {Colors, Fonts} from '../../constant/Styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import {MultiSwitch} from 'react-native-multiswitch-selector';
import HeadingWithLink from '../../components/HeadingWithLink';
import NearVendorCards from './components/NearVendorCards';
import FeatureWindeCard from './components/FeatureWindeCard';
import NewArrivalCard from './components/NewArrivalCard';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import Constants from '../../helper/Constant';
import {showWarning, showSuccess} from '../../helper/Toastify';
import axios from 'axios';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProfile} from '../../redux/slices/profileSlice';
import AnimatedCartModal from './components/AnimatedCartModal';
import AnimatedCartButton from '../../components/AnimatedCartButton';
const API_TIMEOUT = 10000;

const Home = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const scrollViewRef = useRef(null);
  const width = Dimensions.get('window').width;
  const [type, setType] = useState('Wine types');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [homeData, setHomeData] = useState({});
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.profile);
  const [cartData, setCartData] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [offers, setOffers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

 

  const userFullName = useMemo(() => {
    if (!userData) return '';
    return `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
  }, [userData]);

  const userAddress = useMemo(() => {
    if (!userData?.address) return 'Default Address';
    return userData.address.length > 25
      ? `${userData.address.slice(0, 25)}...`
      : userData.address;
  }, [userData?.address]);

  const quizProgress = useMemo(() => {
    const milestone = userData?.milestone || 0;
    return Math.min((milestone / 40) * 100, 100);
  }, [userData?.milestone]);

  const milestoneProgress = useMemo(() => {
    const milestone = userData?.milestone || 0;
    return Math.min((milestone / 10) * 100, 100);
  }, [userData?.milestone]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isCartVisible) {
          setIsCartVisible(false);
          return true;
        }
        return false;
      },
    );

    return () => backHandler.remove();
  }, [isCartVisible]);

  useEffect(() => {
    if (isFocused) {
      loadInitialData();
    }
  }, [isFocused]);

  const loadInitialData = useCallback(async () => {
    try {
      setError(null);
      await Promise.all([getCartData(), getHomePageData(), getOffers()]);
    } catch (error) {
      console.error('Initial data loading error:', error);
      setError(error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfile());
    }, [dispatch]),
  );

  useEffect(() => {
    const selectedCategory = homeData?.categories?.find(
      item => item.name === type,
    );
    setCategories(selectedCategory?.categories || []);
  }, [type, homeData]);

  const getCartData = async () => {
    try {
      const info = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(info)?.token;

      if (!token) {
        console.warn('No token found for cart request');
        return;
      }

      const url = Constants.baseUrl8 + Constants.getCart;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: API_TIMEOUT,
      });

      if (response?.data?.cart) {
        setCartData(response.data.cart);
      }
    } catch (error) {
      console.error('Cart fetch error:', error);
      if (error.response?.status !== 401) {
        showWarning(error.response?.data?.message || 'Error fetching cart');
      }
    }
  };

  const getHomePageData = async () => {
    const data = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(data)?.token;

    if (!token) {
      throw new Error('Authentication required');
    }

    const url = Constants.baseUrl2 + Constants.home;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: API_TIMEOUT,
      });
      if (res?.status == 200) {
        setHomeData(res?.data);
        const firstType = res?.data?.categories?.[0]?.name || 'Wine types';
        setType(firstType);
      }
    } catch (error) {
      console.error('Home data fetch error:', error);
      setError(error);
      if (error.response) {
        showWarning(error.response.data?.message || 'Error loading home data');
      } else if (error.request) {
        showWarning('Network error. Please check your connection.');
      } else {
        showWarning('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

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


  const getOffers = async () => {
    try {
      const info = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(info)?.token;

      if (!token) return;

      const url = Constants.baseUrl10 + Constants.latestOffers;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: API_TIMEOUT,
      });
      setOffers(res?.data?.data || []);
    } catch (error) {
      console.error('Offers fetch error:', error);
      if (error.response?.status !== 401) {
        showWarning(error.response?.data?.message || 'Error fetching offers');
      }
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadInitialData();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [loadInitialData]);

  const handleConvertQuizPoints = useCallback(async () => {
    if ((userData?.milestone || 0) < 40) {
      showWarning('You need 40 quiz points to convert to milestone');
      return;
    }

    Alert.alert(
      'Convert Quiz Points',
      'Are you sure you want to convert 40 quiz points to 1 milestone?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Convert',
          onPress: () => {
            console.log("lp")
          },
        },
      ],
    );
  }, [userData?.milestone]);

  const handleRewardSelection = useCallback(
    rewardType => {
      Alert.alert('Reward Selected', `You've selected: ${rewardType}`, [
        {text: 'OK', onPress: () => navigation.navigate('ScanCode')},
      ]);
    },
    [navigation],
  );


  if (error && !loading) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          {paddingTop: inset.top},
        ]}>
        <Text style={styles.errorText}>Something went wrong</Text>
        <Pressable style={styles.retryButton} onPress={loadInitialData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }


  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate('Profile')}>
          <Image
            source={
              userData && userData?.image !== null
                ? {uri: userData?.image}
                : require('./images/profile.png')
            }
            style={styles.profileImage}
          />
        </Pressable>
        <View style={styles.userInfo}>
          <Text style={styles.userName} allowFontScaling={false}>
            {userFullName || 'Guest User'}
          </Text>
          <View style={styles.userLocationContainer}>
            <Image
              source={require('./images/location.png')}
              style={styles.locationIcon}
              resizeMode="contain"
            />
            <Text
              style={styles.userLocationText}
              numberOfLines={1}
              allowFontScaling={false}>
              {userAddress}
            </Text>
          </View>
        </View>
        <View style={styles.actionIcons}>
          <Pressable onPress={() => navigation.navigate('ScanCode')}>
            <Image
              source={
                userData?.milestone >= 40
                  ? require('./images/scanner.png')
                  : require('./images/scanner2.png')
              }
              style={styles.icon}
            />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Notifications')}>
            <Image
              source={require('./images/notification.png')}
              style={styles.icon}
            />
          </Pressable>
        </View>
      </View>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#ff6347']}
            tintColor={Colors.red}
          />
        }>
        {offers?.length > 0 && (
          <View style={styles.carouselContainer}>
            {loading ? (
              <SkeletonPlaceholder borderRadius={10}>
                <SkeletonPlaceholder.Item
                  width={Dimensions.get('window').width - 40}
                  height={220}
                />
              </SkeletonPlaceholder>
            ) : (
              <Carousel
                loop
                width={width - 40}
                height={width / 2}
                // autoPlay={true}
                data={offers}
                scrollAnimationDuration={1000}
                pagingEnabled={true}
                renderItem={({item}) => {
                  const toDate = new Date(item.to_date);
                  const formattedToDate = !isNaN(toDate)
                    ? `${toDate.getDate().toString().padStart(2, '0')}/${(
                        toDate.getMonth() + 1
                      )
                        .toString()
                        .padStart(2, '0')}/${toDate.getFullYear()}`
                    : 'N/A';
                  return (
                    <Pressable
                      style={{flex: 1}}
                      onPress={() => {
                      
                       
                        if (item?.product_id !== null) {
                          navigation.navigate('WineDetail', {
                            item: item?.product_id,
                          });
                        } else {
                         
                          navigation.navigate('VendorDetail', {
                            item: item,
                            userCoordinates: {
                              latitude: userData?.latitude,
                              longitude: userData?.longitude,
                            },
                          });
                        }
                      }}>
                      <ImageBackground
                        source={{uri: item.image}}
                        style={styles.carouselImageBackground}
                        imageStyle={{borderRadius: 10}}>
                        <View style={styles.carouselOverlay}>
                          <View>
                            {item.discount_value && (
                              <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>
                                  {item.discount_type === 'percentage'
                                    ? `${item.discount_value}% OFF`
                                    : `£${item.discount_value} OFF`}
                                </Text>
                              </View>
                            )}
                          </View>
                          <View>
                            {item.name ? (
                              <Text style={styles.offerName}>{item.name}</Text>
                            ) : null}
                            <Text style={styles.offerDesc} numberOfLines={2}>
                              {item.offer_desc}
                            </Text>
                            <View style={styles.offerFooter}>
                              <Text style={styles.offerValidity}>
                                Valid until: {formattedToDate}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </ImageBackground>
                    </Pressable>
                  );
                }}
              />
            )}
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.quizInfo}>
            <Text style={styles.title} allowFontScaling={false}>
              Play Quiz
            </Text>

            <Text style={styles.milestoneText} allowFontScaling={false}>
              Quiz Points: {userData?.milestone || 0} / 40
            </Text>

            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, {width: `${quizProgress}%`}]} />
            </View>

            <View style={styles.quizButtonsContainer}>
              {(userData?.milestone || 0) >= 40 && (
                <Pressable
                  style={styles.convertButton}
                  onPress={handleConvertQuizPoints}>
                  <Text
                    style={styles.convertButtonText}
                    allowFontScaling={false}>
                    Convert 40 Quiz Points to 1 Milestone
                  </Text>
                </Pressable>
              )}

              <Pressable
                style={styles.button}
                onPress={() => navigation.navigate('Quiz')}>
                <Text style={styles.buttonText} allowFontScaling={false}>
                  Start
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View
          style={[styles.card, {marginTop: 0, backgroundColor: Colors.blue}]}>
          <View style={styles.quizInfo}>
            <Text
              style={[styles.title, {textAlign: 'center'}]}
              allowFontScaling={false}>
              Milestone Point Score
            </Text>
            <Text style={styles.milestoneText} allowFontScaling={false}>
              Milestone: {userData?.milestone || 0} / 10 Points
            </Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBar, {width: `${milestoneProgress}%`}]}
              />
            </View>

            {(userData?.milestone || 0) >= 10 && (
              <View style={styles.rewardContainer}>
                <Text style={styles.rewardTitle} allowFontScaling={false}>
                  🎉 Choose Your Reward:
                </Text>

                <Pressable
                  style={styles.rewardOption}
                  onPress={() =>
                    handleRewardSelection('20% Discount on Wine Products')
                  }>
                  <Text style={styles.rewardText} allowFontScaling={false}>
                    📦 20% Discount on Wine Products
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.rewardOption}
                  onPress={() =>
                    handleRewardSelection('£10 Voucher (Min Order £50)')
                  }>
                  <Text style={styles.rewardText} allowFontScaling={false}>
                    🎫 £10 Voucher (Min Order £50)
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <View style={styles.contentContainer}>
          <MultiSwitch
            allStates={['Wine types', 'Popular countries', 'Popular grapes']}
            currentState={type}
            changeState={setType}
            mode="white"
            styleRoot={styles.multiSwitchRoot}
            styleAllStatesContainer={styles.multiSwitchContainer}
            styleActiveState={styles.activeState}
            styleActiveStateText={styles.activeStateText}
            styleInactiveStateText={styles.inactiveStateText}
          />
          <View style={styles.listContainer}>
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({index, item}) => (
                <Pressable
                  style={styles.listItem}
                  key={index}
                  onPress={() =>
                    navigation.navigate('WineList', {
                      item: item,
                    })
                  }>
                  <Image
                    source={{uri: item.image}}
                    style={styles.listItemImage}
                  />
                  <Text style={styles.listItemText} allowFontScaling={false}>
                    {item?.name}
                  </Text>
                </Pressable>
              )}
              keyExtractor={(item, index) => `category-${item?.id || index}`}
            />
          </View>
          {homeData?.vendors?.length > 0 && (
            <>
              <HeadingWithLink
                title="Near Vendors for you"
                onPress={() =>
                  navigation.navigate('Vendors', {data: homeData?.vendors})
                }
              />

              <FlatList
                data={homeData?.vendors?.slice(0, 5)}
                scrollEnabled={false}
                contentContainerStyle={styles.verticalList}
                renderItem={({item}) => (
                  <NearVendorCards
                    item={item}
                    navigation={navigation}
                    userCoordinates={{
                      latitude: userData?.latitude,
                      longitude: userData?.longitude,
                    }}
                  />
                )}
                keyExtractor={(item, index) => `vendor-${item?.id || index}`}
              />
            </>
          )}

          {homeData?.product?.length > 0 && (
            <>
              <HeadingWithLink
                title="Featured Wine"
                onPress={() =>
                  navigation.navigate('FeatureWine', {data: homeData?.product})
                }
              />
              <FlatList
                data={homeData?.product}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  styles.horizontalList,
                  {marginVertical: 20},
                ]}
                renderItem={({item}) => (
                  <FeatureWindeCard
                    item={item}
                    onPress={() =>
                      navigation.navigate('WineDetail', {item: item?.id})
                    }
                  />
                )}
                keyExtractor={(item, index) => `featured-${item?.id || index}`}
              />
            </>
          )}

          {homeData?.newArrivals?.length > 0 && (
            <>
              <HeadingWithLink
                title="New Arrival"
                onPress={() =>
                  navigation.navigate('NewArrival', {
                    data: homeData?.newArrivals,
                  })
                }
              />

              <FlatList
                data={homeData?.newArrivals?.slice(0, 5)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  styles.horizontalList,
                  {marginVertical: 20},
                ]}
                renderItem={({item}) => (
                  <NewArrivalCard
                    item={item}
                    onPress={() =>
                      navigation.navigate('WineDetail', {item: item?.id})
                    }
                  />
                )}
                keyExtractor={(item, index) =>
                  `newarrival-${item?.id || index}`
                }
              />
            </>
          )}
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
          setIsCartVisible={setIsCartVisible}
          cartData={cartData}
          onClose={() => setIsCartVisible(false)}
          navigation={navigation}
          onRemoveItem={handleRemoveItem}
        />
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: Colors.gray5,
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  userInfo: {
    flex: 1,
    marginHorizontal: 10,
  },
  userName: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
  },
  userLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationIcon: {
    height: 15,
    width: 15,
  },
  userLocationText: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    height: 40,
    width: 40,
  },
  scrollContent: {
    paddingBottom: 70,
  },
  carouselContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  carouselImageBackground: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  carouselOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 15,
  },
  offerName: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Fonts.InterRegular,
    marginBottom: 4,
  },
  offerDesc: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.InterRegular,
    marginBottom: 10,
  },
  offerValidity: {
    color: '#f0f0f0',
    fontSize: 12,
    fontFamily: Fonts.InterRegular,
    fontStyle: 'italic',
  },
  discountBadge: {
    backgroundColor: Colors.red,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  discountText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  multiSwitchRoot: {
    borderRadius: 10,
    padding: 0,
  },
  multiSwitchContainer: {
    backgroundColor: Colors.gray6,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#E6EBF1',
    paddingHorizontal: 10,
  },
  activeState: {
    backgroundColor: Colors.red,
    borderRadius: 5,
  },
  activeStateText: {
    fontFamily: Fonts.InterRegular,
    color: Colors.white,
    fontWeight: '500',
    fontSize: 12,
  },
  inactiveStateText: {
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
    fontSize: 12,
  },
  listContainer: {
    paddingVertical: 20,
  },
  horizontalList: {
    gap: 10,
  },
  listItem: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
  },
  listItemImage: {
    height: 60,
    width: 60,
    borderRadius: 100,
  },
  listItemText: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
  },
  verticalList: {
    gap: 10,
    marginVertical: 15,
  },
  card: {
    backgroundColor: Colors.red2,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 5,
    margin: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    flex: 1,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  quizInfo: {
    flex: 1,
    marginRight: 10,
  },
  milestoneText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: Fonts.InterRegular,
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  convertButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  convertButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  quizButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  rewardContainer: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  rewardOption: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginVertical: 6,
    width: '100%',
  },
  rewardText: {
    textAlign: 'center',
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: Colors.red,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.red,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
