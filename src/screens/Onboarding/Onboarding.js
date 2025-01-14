import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

const COLORS = {primary: '#282534', white: '#fff', gray: '#aaa'};

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

  const goToNextSlide = () => {
    if (currentSlideIndex < data.length - 1) {
      flatListRef.current.scrollToOffset({
        offset: (currentSlideIndex + 1) * width,
        animated: true,
      });
    }
  };

  const skipToLastSlide = () => {
    flatListRef.current.scrollToOffset({
      offset: (data.length - 1) * width,
      animated: true,
    });
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
                currentSlideIndex === index && {backgroundColor: COLORS.white},
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
              onPress={() => navigation.navigate('Login')}>
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
    backgroundColor: COLORS.primary,
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
    bottom: 40,
    width: '100%',
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  indicator: {
    width: 10,
    height: 10,
    backgroundColor: COLORS.gray,
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
    backgroundColor: COLORS.white,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  transparentBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  transparentBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});
