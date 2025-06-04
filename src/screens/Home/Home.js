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
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
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
import {showWarning} from '../../helper/Toastify';
import axios from 'axios';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProfile} from '../../redux/slices/profileSlice';
import AnimatedCartModal from './components/AnimatedCartModal';

const Home = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const width = Dimensions.get('window').width;
  const [type, setType] = useState('Wine types');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [homeData, setHomeData] = useState([]);
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.profile);
  const [cartData, setCartData] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [offers, setOffers] = useState([]);

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

  useEffect(() => {
    getHomePageData();
    getOffers();
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

  const getHomePageData = async () => {
    const data = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(data)?.token;
    const url = Constants.baseUrl2 + Constants.home;
    setLoading(true);
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res?.status == 200) {
        setHomeData(res?.data);
        const firstType = res?.data?.categories?.[0]?.name || '';
        setType(firstType);
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
        // setCartData(prev => prev.filter(item => item.id !== itemId));
        getCartData();
      }
    } catch (error) {
      console.log(error);
      showWarning(error.response?.data?.message || 'Error updating cart');
    }
  };

  const getOffers = async () => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl10 + Constants.latestOffers;
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setOffers(res?.data?.data || []);
    } catch (error) {
      showWarning(error.response?.data?.message || 'Error fetching offers');
    }
  };

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
            {userData?.first_name} {userData?.last_name}
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
              {userData?.address
                ? userData.address.length > 20
                  ? userData.address.slice(0, 25).concat('...')
                  : userData.address
                : 'Default Address'}
            </Text>
          </View>
        </View>
        <View style={styles.actionIcons}>
          <Pressable onPress={() => navigation.navigate('ScanCode')}>
            {userData?.milestone == 40 ? (
              <Image
                source={require('./images/scanner.png')}
                style={styles.icon}
              />
            ) : (
              <Image
                source={require('./images/scanner2.png')}
                style={styles.icon}
              />
            )}
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => getHomePageData()}
            colors={['#ff6347']}
            tintColor={Colors.red}
          />
        }>
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
              autoPlay={true}
              data={offers}
              scrollAnimationDuration={1000}
              pagingEnabled={true}
              renderItem={({item}) => (
                <Pressable
                  style={{position: 'relative'}}
                  onPress={() =>
                    navigation.navigate('WineDetail', {item: item?.product_id})
                  }>
                  <Image
                    source={{uri: item.image}}
                    style={styles.carouselImage}
                  />
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 20,
                      position: 'absolute',
                      right: 10,
                      bottom: 20,
                      fontWeight: 'bold',
                    }}>
                    {item?.offer_desc}
                  </Text>
                </Pressable>
              )}
            />
          )}
        </View>
        <View style={styles.card}>
          <View style={styles.quizInfo}>
            <Text style={styles.title} allowFontScaling={false}>
              Play Quiz
            </Text>

            {/* Show Milestone Progress */}
            <Text style={styles.milestoneText} allowFontScaling={false}>
              Milestone: {userData?.milestone || 0} / 40 Points
            </Text>

            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {width: `${((userData?.milestone || 0) / 40) * 100}%`},
                ]}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                marginTop: 10,
                justifyContent: 'space-between',
              }}>
              {/* Convert Button */}
              {userData?.milestone > 0 && (
                <Pressable
                  style={styles.convertButton}
                  onPress={() => {
                    if ((userData?.coins || 0) <= 40) {
                      showWarning(
                        'You need more than 40 coins to convert into milestone.',
                      );
                      return;
                    }
                  }}>
                  <Text
                    style={styles.convertButtonText}
                    allowFontScaling={false}>
                    Convert Coins to Milestone
                  </Text>
                </Pressable>
              )}
              {/* Start Quiz Button */}
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
                style={[
                  styles.progressBar,
                  {width: `${((userData?.milestone || 0) / 10) * 100}%`}, // milestone max is 10 in this card
                ]}
              />
            </View>

            {/* 🎁 Reward Options when milestone >= 10 */}
            {userData?.milestone >= 1000 && (
              <View style={styles.rewardContainer}>
                <Text style={styles.rewardTitle} allowFontScaling={false}>
                  🎉 Choose Your Reward:
                </Text>

                <Pressable
                  style={styles.rewardOption}
                  onPress={() => navigation.navigate('ScanCode')}>
                  <Text style={styles.rewardText} allowFontScaling={false}>
                    📦 20% Discount on Wine Products
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.rewardOption}
                  onPress={() => navigation.navigate('ScanCode')}>
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
              />
            </>
          )}
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
    padding: 20,
  },
  carouselImage: {
    height: '100%',
    width: Dimensions.get('window').width - 40,
    borderRadius: 10,
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
    backgroundColor: '#FFD700', // Gold color for progress
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
});
