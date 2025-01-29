import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {Colors} from '../../constant/Styles';
import messaging from '@react-native-firebase/messaging';
import Geolocation from 'react-native-geolocation-service';

const data = [
  {
    id: 1,
    image: require('../../../assets/images/OnBoardingScreenImages/01.png'),
    title: 'Find Your Interest Just a Swipe Away.',
    subTitle:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's!!",
  },
  {
    id: 2,
    image: require('../../../assets/images/OnBoardingScreenImages/02.png'),
    title: 'Milestone Rewards and Discounts!',
    subTitle:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's!!",
  },
  {
    id: 3,
    image: require('../../../assets/images/OnBoardingScreenImages/03.png'),
    title:
      'Or simply add to the cart your favourite wines and try them at home!',
    subTitle: 'Because chilled drinks are always better!!',
  },
];

const Onboarding = () => {
  const {width, height} = useWindowDimensions();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const permissionsToRequest = [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        ];
        const granted = await PermissionsAndroid.requestMultiple(
          permissionsToRequest,
        );

        if (
          granted['android.permission.ACCESS_FINE_LOCATION'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.POST_NOTIFICATIONS'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted for both');
        } else {
          console.log('Permissions denied for one or both of them');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      requestIOSPermissions();
    }
  };

  const requestIOSPermissions = async () => {
    try {
      const notificationAuthStatus = await messaging().requestPermission();
      const isNotificationAuthorized =
        notificationAuthStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        notificationAuthStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (isNotificationAuthorized) {
        console.log('Notification permissions granted');
      } else {
        console.log('Notification permissions denied');
      }
      const locationAuthStatus = await Geolocation.requestAuthorization(
        'whenInUse',
      );
      if (locationAuthStatus === 'granted') {
        console.log('Location permissions granted');
      } else {
        console.log('Location permissions denied');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const goToNextSlide = () => {
    const nextIndex = currentSlideIndex + 1;
    if (nextIndex < data.length) {
      flatListRef.current.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
      setCurrentSlideIndex(nextIndex); // Manually update index
    }
  };

  const skipToLastSlide = () => {
    flatListRef.current.scrollToOffset({
      offset: (data.length - 1) * width,
      animated: true,
    });
    setCurrentSlideIndex(data.length - 1); // Manually update the index
  };

  const Indicator = () => {
    return (
      <View style={styles.indicatorContainer}>
        {data.map((_, index) => {
          const scale = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.indicator,
                {transform: [{scale}]},
                currentSlideIndex === index && {backgroundColor: Colors.white},
              ]}
            />
          );
        })}
      </View>
    );
  };

  const Footer = () => {
    return (
      <View style={styles.footer}>
        <Indicator />
        <View style={styles.footerButtons}>
          {currentSlideIndex === data.length - 1 ? (
            <TouchableOpacity
              style={styles.btn}
              onPress={() => navigation.navigate('AuthType')}>
              <Text style={styles.btnText}>GET STARTED</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.btn, styles.transparentBtn]}
                onPress={skipToLastSlide}>
                <Text style={styles.transparentBtnText}>SKIP</Text>
              </TouchableOpacity>
              <View style={styles.buttonSpacing} />
              <TouchableOpacity style={styles.btn} onPress={goToNextSlide}>
                <Text style={styles.btnText}>NEXT</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        onMomentumScrollEnd={e =>
          setCurrentSlideIndex(
            Math.round(e.nativeEvent.contentOffset.x / width),
          )
        }
        renderItem={({item}) => (
          <View style={[styles.slide, {width}]}>
            <Image source={item.image} style={[styles.image, {height}]} />
          </View>
        )}
      />
      <Footer />
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    resizeMode: 'cover',
  },
  footer: {
    position: 'absolute',
    bottom: Platform.OS == 'ios' ? 40 : 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  indicator: {
    width: 10,
    height: 10,
    backgroundColor: Colors.gray,
    marginHorizontal: 5,
    borderRadius: 5,
  },

  buttonRow: {
    flexDirection: 'row',
  },
  buttonSpacing: {
    width: 15,
  },
  btn: {
    flex: 1,
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.black,
  },
  transparentBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.white,
  },
  transparentBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.white,
  },
});
