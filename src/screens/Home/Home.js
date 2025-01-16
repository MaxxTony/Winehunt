import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts} from '../../constant/Styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import {MultiSwitch} from 'react-native-multiswitch-selector';

const Home = () => {
  const inset = useSafeAreaInsets();
  const width = Dimensions.get('window').width;
  const [type, setType] = useState('Wine types');

  const data = [
    {
      id: 1,
      image: require('./images/slider.png'),
    },
    {
      id: 2,
      image: require('./images/slider2.png'),
    },
    {
      id: 3,
      image: require('./images/slider3.png'),
    },
  ];

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <View style={styles.header}>
        <Image
          source={require('./images/profile.png')}
          style={styles.profileImage}
        />
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
          <Image source={require('./images/scanner.png')} style={styles.icon} />
          <Image
            source={require('./images/notification.png')}
            style={styles.icon}
          />
        </View>
      </View>
      <View style={{padding: 20, flex: 0.5}}>
        <Carousel
          loop
          width={width - 40}
          height={width / 2}
          autoPlay={true}
          data={data}
          scrollAnimationDuration={1000}
          pagingEnabled={true}
          style={{borderRadius: 10}}
          renderItem={({item, index}) => (
            <Image
              source={item?.image}
              style={{height: '100%', width: width - 40, borderRadius: 10}}
            />
          )}
        />
      </View>
      <View style={{flex: 1, padding: 20}}>
        <MultiSwitch
          allStates={['Wine types', 'Popular countries', 'Popular grapes']}
          currentState={type}
          changeState={e => {
            setType(e);
          }}
          mode="white"
          styleRoot={{
            borderRadius: 10,
            padding: 0,
          }}
          styleAllStatesContainer={{
            backgroundColor: Colors.gray6,
            borderRadius: 5,
            borderWidth: 2,
            borderColor: '#E6EBF1',
            paddingHorizontal: 10,
          }}
          styleActiveState={{
            backgroundColor: Colors.red,
            borderRadius: 5,
          }}
          styleActiveStateText={{
            fontFamily: Fonts.InterRegular,
            color: Colors.white,
            fontWeight: '500',
            fontSize: 14,
          }}
          styleInactiveStateText={{
            color: Colors.black,
            fontFamily: Fonts.InterRegular,
            fontWeight: '500',
            fontSize: 14,
          }}
        />
        <View style={{paddingVertical: 20}}>
          <FlatList
            data={Array.from({length: 10})}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{columnGap: 10}}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    alignItems: 'center',
                    gap: 10,
                    minWidth: 80,
                  }}>
                  <Image
                    source={require('./images/wine.png')}
                    style={{height: 60, width: 60}}
                  />
                  <Text>Red</Text>
                </View>
              );
            }}
          />
        </View>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 2,
    borderColor: Colors.gray5,
  },
  profileImage: {
    height: 40,
    width: 40,
  },
  userInfo: {
    gap: 5,
    flex: 1,
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
});
