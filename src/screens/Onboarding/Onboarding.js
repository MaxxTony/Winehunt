import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React from 'react';

const COLORS = {primary: '#282534', white: '#fff'};

const data = [
  {
    id: 1,
    image: require('../../../assets/images/OnBoardingScreenImages/01.png'),
    title: 'Find Your Interest Just a Swipe Away.',
    subTitle:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's!!",
  },
  {
    id: 2,
    image: require('../../../assets/images/OnBoardingScreenImages/02.png'),
    title: 'Milestone Rewards and Discounts!',
    subTitle:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's!!",
  },
  {
    id: 3,
    image: require('../../../assets/images/OnBoardingScreenImages/03.png'),
    title:
      'Or simply add to the cart your favourite wines and try them at home!"',
    subTitle: 'Because chilled drinks are always better!!',
  },
];

const Onboarding = () => {
  const {height, width} = useWindowDimensions();
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref = React.useRef();
  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != data.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({offset});
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const skip = () => {
    const lastSlideIndex = data.length - 1;
    const offset = lastSlideIndex * width;
    ref?.current.scrollToOffset({offset});
    setCurrentSlideIndex(lastSlideIndex);
  };

  const Slides = ({item}) => {
    return (
      <View style={{alignItems: 'center'}}>
        <Image source={item?.image} style={{width: width, height: height}} />
      </View>
    );
  };

  const Footer = () => {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          position: 'absolute',
          width: '100%',
          bottom: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex == index && {
                  backgroundColor: COLORS.white,
                  width: 25,
                },
              ]}
            />
          ))}
        </View>

        {/* Render buttons */}
        <View style={{marginBottom: 20}}>
          {currentSlideIndex == data.length - 1 ? (
            <View style={{height: 50}}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => Alert.alert('Vishal pandey ')}>
                <Text style={{fontWeight: 'bold', fontSize: 15}}>
                  GET STARTED
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.btn,
                  {
                    borderColor: COLORS.white,
                    borderWidth: 1,
                    backgroundColor: 'transparent',
                  },
                ]}
                onPress={skip}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: COLORS.white,
                  }}>
                  SKIP
                </Text>
              </TouchableOpacity>
              <View style={{width: 15}} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToNextSlide}
                style={styles.btn}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}>
                  NEXT
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        pagingEnabled
        data={data}
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        bounces={false}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => <Slides item={item} />}
      />
      <Footer />
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  indicator: {
    height: 2.5,
    width: 10,
    backgroundColor: 'grey',
    marginHorizontal: 3,
    borderRadius: 2,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
