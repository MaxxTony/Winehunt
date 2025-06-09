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
        // Set main product wishlist status
        setLikedItems(prev => ({
          ...prev,
          [product?.id]: product?.is_wishlist,
        }));
        // Set suggested products wishlist status
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

  const tab = [
    {
      id: 1,
      name: 'Descriptions',
    },
    {
      id: 2,
      name: 'Reviews',
    },
  ];

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

  const AddonList = [
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

  const [addOn, setAddOn] = useState(AddonList[0]?.id);

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
        // navigation.navigate('Cart');
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

  const onsubmit = async () => {
    navigation.navigate('ScanCode');
    // const info = await AsyncStorage.getItem('userDetail');
    // const token = JSON.parse(info)?.token;

    // const url = Constants.baseUrl4 + Constants.tryProduct;

    // const body = {
    //   product_id: detail?.id,
    // };

    // try {
    //   const res = await axios.post(url, body, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       'Content-Type': 'application/json',
    //     },
    //   });
    // } catch (error) {
    //   if (error.response) {
    //     console.log('Server Error:', error.response.data);
    //     showWarning(error.response.data?.error);
    //   } else if (error.request) {
    //     console.log('No Response:', error.request);
    //   } else {
    //     console.log('Request Error:', error.message);
    //   }
    // }
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

  return (
    <View
      style={[
        styles.container,
        {paddingTop: Platform.OS == 'ios' ? inset.top : 0},
      ]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.semiCircleContainer}>
          <Image
            source={require('../images/bg.png')}
            style={styles.semiCircleImage}
          />
        </View>
        <View style={styles.headerContainer}>
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.goBack()}>
            <Fontisto name="angle-left" size={20} color={Colors.white} />
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
              size={25}
              name={likedItems[detail?.id] ? 'heart' : 'hearto'}
              color={likedItems[detail?.id] ? Colors.red : Colors.white}
            />
          </Pressable>
        </View>

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
              resizeMode="contain"
            />
          )}
          <View style={styles.infoContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={styles.vendorName} allowFontScaling={false}>
                {detail?.user?.shop_name}
              </Text>
              <Pressable
                style={{
                  padding: 3,
                  paddingHorizontal: 5,
                  backgroundColor: Colors.green,
                  alignItems: 'center',
                  borderRadius: 5,
                }}
                onPress={() => {
                  navigation.navigate('VendorDetail', {
                    item: detail?.user,
                    userCoordinates: {
                      latitude: userData?.latitude,
                      longitude: userData?.longitude,
                    },
                  });
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: Fonts.InterMedium,
                    fontWeight: '600',
                    color: Colors.white,
                  }}
                  allowFontScaling={false}>
                  View Detail
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
              <Text style={styles.wineName} allowFontScaling={false}>
                ({detail?.title})
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceText} allowFontScaling={false}>
                Price{' '}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  flex: 1,
                }}>
                {detail?.has_discount && (
                  <Text
                    style={[
                      styles.priceValue,
                      {
                        textDecorationLine: 'line-through',
                        color: Colors.gray,
                      },
                    ]}
                    allowFontScaling={false}>
                    £{detail?.actual_price ?? '0.00'} /
                  </Text>
                )}
                <Text style={styles.priceValue} allowFontScaling={false}>
                  £{detail?.price ?? '0.00'}
                </Text>
              </View>
            </View>
            <View style={styles.ratingContainer}>
              <AntDesign name="star" size={14} color={Colors.yellow} />
              <Text style={styles.ratingText} allowFontScaling={false}>
                {detail?.average_rating}
              </Text>
            </View>
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
                    <Pressable
                      style={styles.button}
                      onPress={() => setShowModal(true)}>
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
                  onPress={() => {
                    // navigation.navigate('ScanWineCode')
                    onsubmit();
                  }}>
                  <Text style={styles.buttonText} allowFontScaling={false}>
                    Try Me
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
        <View style={{padding: 20}}>
          <FlatList
            data={tab}
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            renderItem={({item, index}) => {
              const isActive = item.id === activeTab;
              return (
                <Pressable
                  onPress={() => setActiveTab(item.id)}
                  style={{
                    width: width / 2,
                    paddingVertical: 12,
                    alignItems: 'center',
                    borderBottomWidth: isActive ? 2 : 2,
                    borderBottomColor: isActive ? Colors.red : Colors.gray,
                    backgroundColor: '#FFF',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: isActive ? 'bold' : 'normal',
                      color: isActive ? Colors.black : 'black',
                    }}
                    allowFontScaling={false}>
                    {item.name}
                  </Text>
                </Pressable>
              );
            }}
          />
          {activeTab === 1 ? (
            <View style={{paddingVertical: 20, gap: 20}}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: Fonts.InterMedium,
                  color: Colors.black,
                }}
                allowFontScaling={false}>
                {detail?.product_desc}
              </Text>

              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Fonts.PhilosopherBold,
                  color: Colors.black,
                }}
                allowFontScaling={false}>
                Suggested for you
              </Text>

              <FlatList
                data={detail?.suggestions}
                contentContainerStyle={{gap: 10}}
                scrollEnabled={false}
                renderItem={({item, index}) => {
                  console.log(item);
                  return (
                    <Pressable
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        flexDirection: 'row',
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        backgroundColor: Colors.white,
                        elevation: 5,
                        gap: 10,
                        margin: 5,
                      }}
                      onPress={() =>
                        navigation.replace('WineDetail', {item: item?.id})
                      }>
                      <Image
                        source={
                          item?.image
                            ? {uri: item?.image}
                            : require('../images/bottle.png')
                        }
                        style={{height: 75, width: 38}}
                        resizeMode="contain"
                      />
                      <View style={{gap: 5, flex: 1}}>
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: Fonts.InterMedium,
                            color: Colors.black,
                            fontWeight: '700',
                          }}
                          allowFontScaling={false}
                          numberOfLines={1}>
                          {item?.name} ({item?.title})
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: Fonts.InterMedium,
                            color: Colors.gray,
                          }}
                          allowFontScaling={false}>
                          Best Rated this Month
                        </Text>
                        <View
                          style={{
                            padding: 5,
                            borderRadius: 5,
                            backgroundColor: Colors.red,
                            alignItems: 'center',
                            alignSelf: 'flex-start',
                          }}>
                          <Text
                            style={{
                              fontSize: 13,
                              fontFamily: Fonts.InterMedium,
                              color: Colors.white,
                              fontWeight: '700',
                            }}
                            allowFontScaling={false}>
                            £{item.price ?? '0.00'}
                          </Text>
                        </View>
                      </View>
                      <View style={{justifyContent: 'space-between',alignItems:"flex-end"}}>
                        <Pressable
                          onPress={() => {
                            if (!suggestionLikes[item?.id]) {
                              onLike(item?.id, true);
                            } else {
                              onDisLike(item?.id, true);
                            }
                          }}>
                          <AntDesign
                            size={25}
                            name={
                              suggestionLikes[item?.id] ? 'heart' : 'hearto'
                            }
                            color={
                              suggestionLikes[item?.id]
                                ? Colors.red
                                : Colors.black
                            }
                          />
                        </Pressable>
                        {item?.is_cart ? (
                          <Pressable
                            style={styles.button}
                            onPress={() => navigation.navigate('Cart')}>
                            <Text
                              style={styles.buttonText}
                              allowFontScaling={false}>
                              Go To Cart
                            </Text>
                          </Pressable>
                        ) : (
                          <Pressable onPress={() => setShowModal(true)}>
                            <Ionicons
                              name="add-circle"
                              size={25}
                              color={Colors.black}
                            />
                          </Pressable>
                        )}
                      </View>
                    </Pressable>
                  );
                }}
              />
            </View>
          ) : (
            <View style={{paddingVertical: 20, gap: 20}}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Fonts.PhilosopherBold,
                  color: Colors.black,
                }}
                allowFontScaling={false}>
                Image Gallery
              </Text>
              <FlatList
                data={detail?.product_images || []}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{
                  gap: 10,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <View
                    style={{
                      padding: 10,
                      borderWidth: 1,
                      borderColor: Colors.gray10,
                      borderRadius: 10,
                    }}>
                    <Image
                      source={{uri: item?.image}}
                      style={{height: 100, width: 100}}
                      resizeMode="contain"
                    />
                  </View>
                )}
                ListEmptyComponent={() => (
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors.black,
                      fontFamily: Fonts.InterBold,
                      fontWeight: '400',
                      textAlign: 'center',
                    }}
                    allowFontScaling={false}>
                    No images at this time{' '}
                  </Text>
                )}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: Fonts.PhilosopherBold,
                    color: Colors.black,
                  }}
                  allowFontScaling={false}>
                  Review
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: Fonts.InterRegular,
                    color: Colors.black,
                  }}
                  onPress={() =>
                    navigation.navigate('ReviewList', {
                      reviews: detail,
                      type: 'wines',
                      wineId: id,
                    })
                  }>
                  View All
                </Text>
              </View>
              <FlatList
                data={detail?.product_reviews || []}
                keyExtractor={(item, index) =>
                  item?.id?.toString() || index.toString()
                }
                contentContainerStyle={{gap: 15}}
                renderItem={({item}) => (
                  <View style={styles.card}>
                    <View style={styles.header}>
                      <Image
                        source={{uri: item?.user?.image}}
                        style={styles.avatar}
                      />
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>
                          {item?.user?.first_name} {item?.user?.last_name}
                        </Text>
                        <Text style={styles.dateText}>
                          {' '}
                          {dayjs(item?.created_at).fromNow()}
                        </Text>
                      </View>
                      <View style={styles.ratingContainer}>
                        <AntDesign
                          name="star"
                          size={16}
                          color={Colors.yellow}
                        />
                        <Text style={styles.ratingText}>{item?.rating}</Text>
                      </View>
                    </View>
                    <Text style={styles.reviewText}>{item?.review}</Text>
                  </View>
                )}
                ListEmptyComponent={() => (
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors.black,
                      fontFamily: Fonts.InterBold,
                      fontWeight: '400',
                      textAlign: 'center',
                    }}
                    allowFontScaling={false}>
                    No review at this time{' '}
                  </Text>
                )}
              />
            </View>
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
          setIsCartVisible={setIsCartVisible}
          cartData={cartData}
          onClose={() => setIsCartVisible(false)}
          navigation={navigation}
          onRemoveItem={handleRemoveItem}
        />
      )}

      <PreferenceModal
        AddonList={AddonList}
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
    height: 200,
    width: '100%',
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
  semiCircleImage: {
    height: 400,
    width: '100%',
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    resizeMode: 'cover',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    padding: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 40,
    gap: 10,
  },
  bottleImage: {
    height: 245,
    width: 100,
  },
  infoContainer: {
    flex: 1,
    gap: 5,
  },
  vendorName: {
    fontSize: 16,
    fontFamily: Fonts.InterMedium,
    fontWeight: '800',
    color: Colors.black,
    flex: 1,
  },
  wineName: {
    fontSize: 12,
    fontFamily: Fonts.InterMedium,
    fontWeight: '800',
    color: Colors.black,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priceText: {
    fontSize: 15,
    fontFamily: Fonts.InterMedium,
    fontWeight: '800',
    color: Colors.black,
  },
  priceValue: {
    color: Colors.red,
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
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
    gap: 10,
  },
  button: {
    padding: 8,
    paddingHorizontal: 15,
    backgroundColor: Colors.red,
    alignItems: 'center',
    borderRadius: 5,
    // flex: 0.43,
  },
  buttonText: {
    fontSize: 12,
    fontFamily: Fonts.InterMedium,
    fontWeight: '800',
    color: Colors.white,
  },

  card: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray14,
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray10,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontFamily: Fonts.InterSemiBold,
    color: Colors.black,
  },
  dateText: {
    fontSize: 13,
    color: Colors.gray15,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '600',
  },
  reviewText: {
    fontSize: 15,
    color: Colors.gray8,
    lineHeight: 20,
    fontFamily: Fonts.InterRegular,
  },
});
