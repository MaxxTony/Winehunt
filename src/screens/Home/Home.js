import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts} from '../../constant/Styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import {MultiSwitch} from 'react-native-multiswitch-selector';
import HeadingWithLink from '../../components/HeadingWithLink';
import NearVendorCards from './components/NearVendorCards';
import FeatureWindeCard from './components/FeatureWindeCard';
import NewArrivalCard from './components/NewArrivalCard';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const width = Dimensions.get('window').width;
  const [type, setType] = useState('Wine types');

  const data = [
    {id: 1, image: require('./images/slider.png')},
    {id: 2, image: require('./images/slider2.png')},
    {id: 3, image: require('./images/slider3.png')},
  ];

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('./images/profile.png')}
            style={styles.profileImage}
          />
        </Pressable>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>William Anderson</Text>
          <View style={styles.userLocationContainer}>
            <Image
              source={require('./images/location.png')}
              style={styles.locationIcon}
            />
            <Text style={styles.userLocationText}>Sector 7 HSR, Ohio USA</Text>
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
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.carouselContainer}>
          <Carousel
            loop
            width={width - 40}
            height={width / 2}
            autoPlay={true}
            data={data}
            scrollAnimationDuration={1000}
            pagingEnabled={true}
            renderItem={({item}) => (
              <Image source={item.image} style={styles.carouselImage} />
            )}
          />
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
              data={Array.from({length: 10})}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({index}) => (
                <Pressable
                  style={styles.listItem}
                  key={index}
                  onPress={() => Alert.alert('Coming Soon')}>
                  <Image
                    source={require('./images/wine.png')}
                    style={styles.listItemImage}
                  />
                  <Text style={styles.listItemText}>Red</Text>
                </Pressable>
              )}
            />
          </View>
          <HeadingWithLink title="Near Vendors for you" />
          <FlatList
            data={Array.from({length: 10})}
            scrollEnabled={false}
            contentContainerStyle={styles.verticalList}
            renderItem={() => <NearVendorCards />}
          />
          <HeadingWithLink title="Featured Wine" />
          <FlatList
            data={Array.from({length: 10})}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.horizontalList,
              {marginVertical: 20},
            ]}
            renderItem={() => <FeatureWindeCard />}
          />
          <HeadingWithLink title="New Arrival" />
          <FlatList
            data={Array.from({length: 10})}
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
    paddingHorizontal: 20,
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
