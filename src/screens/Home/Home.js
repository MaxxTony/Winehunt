import {
  Alert,
  Dimensions,
  FlatList,
  Image,
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
import OffersCarousel from './components/OffersCarousel';
import HomeHeader from './components/HomeHeader';
import QuizMilestoneCard from './components/QuizMilestoneCard';
import CategorySection from './components/CategorySection';
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
    const quizPoints = userData?.milestone || 0;
    return Math.min((quizPoints / 40) * 100, 100);
  }, [userData?.milestone]);

  const milestoneProgress = useMemo(() => {
    const milestonePoints = userData?.milestonePoints || 0;
    return Math.min((milestonePoints / 10) * 100, 100);
  }, [userData?.milestonePoints]);

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
    loadInitialData();
  }, []);

  useEffect(() => {
    if (isFocused) {
      getCartData();
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
    }, [dispatch,isFocused]),
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
      await Promise.all([
        loadInitialData(),
        dispatch(fetchProfile()),
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [loadInitialData, dispatch]);

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
      <HomeHeader
        userData={userData}
        userFullName={userFullName}
        userAddress={userAddress}
        navigation={navigation}
      />
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
        <OffersCarousel
          offers={offers}
          loading={loading}
          navigation={navigation}
          userData={userData}
        />

        <QuizMilestoneCard
          userData={userData}
          navigation={navigation}
          quizProgress={quizProgress}
          milestoneProgress={milestoneProgress}
        />

        <View style={styles.contentContainer}>
          <CategorySection
            categories={categories}
            type={type}
            setType={setType}
            navigation={navigation}
          />
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
  scrollContent: {
    paddingBottom: 70,
  },
  contentContainer: {
    paddingHorizontal: 20,
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
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 8,
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
