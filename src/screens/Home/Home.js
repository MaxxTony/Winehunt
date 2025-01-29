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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Constants from '../../helper/Constant';
import {showWarning} from '../../helper/Toastify';
import axios from 'axios';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProfile} from '../../redux/slices/profileSlice';

const Home = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();

  const width = Dimensions.get('window').width;

  const [type, setType] = useState('Wine types');
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [homeData, setHomeData] = useState([]);
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.profile);

  useEffect(() => {
    getHomePageData();
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
          <Text style={styles.userName}>
            {userData?.first_name} {userData?.last_name}
          </Text>
          <View style={styles.userLocationContainer}>
            <Image
              source={require('./images/location.png')}
              style={styles.locationIcon}
            />
            <Text style={styles.userLocationText} numberOfLines={1}>
              {userData?.address.length > 20
                ? userData?.address.slice(0, 25)
                : userData?.address}
            </Text>
          </View>
        </View>
        <View style={styles.actionIcons}>
          <Pressable onPress={() => navigation.navigate('ScanCode')}>
            <Image
              source={require('./images/scanner.png')}
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
              data={homeData?.banners}
              scrollAnimationDuration={1000}
              pagingEnabled={true}
              renderItem={({item}) => (
                <Image
                  source={{uri: item.image}}
                  style={styles.carouselImage}
                />
              )}
            />
          )}
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
                  onPress={() => Alert.alert('Coming Soon')}>
                  <Image
                    source={{uri: item.image}}
                    style={styles.listItemImage}
                  />
                  <Text style={styles.listItemText}>{item?.name}</Text>
                </Pressable>
              )}
            />
          </View>
          <HeadingWithLink
            title="Near Vendors for you"
            onPress={() =>
              navigation.navigate('Vendors', {data: homeData?.vendors})
            }
          />
          <FlatList
            data={homeData?.vendors}
            scrollEnabled={false}
            contentContainerStyle={styles.verticalList}
            renderItem={({item}) => <NearVendorCards item={item} />}
          />
          <HeadingWithLink
            title="Featured Wine"
            onPress={() => navigation.navigate('FeatureWine')}
          />
          <FlatList
            data={homeData?.product}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.horizontalList,
              {marginVertical: 20},
            ]}
            renderItem={({item}) => <FeatureWindeCard item={item} />}
          />
          <HeadingWithLink
            title="New Arrival"
            onPress={() => navigation.navigate('NewArrival')}
          />
          <FlatList
            data={homeData?.newArrivals}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.horizontalList,
              {marginVertical: 20},
            ]}
            renderItem={() => <NewArrivalCard />}
          />
        </View>
      </ScrollView>
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
    gap: 5,
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
    gap: 5,
  },
  locationIcon: {
    height: 16,
    width: 16,
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
    fontSize: 14,
  },
  inactiveStateText: {
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
    fontSize: 14,
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
});
