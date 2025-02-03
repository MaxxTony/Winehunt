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
import React, {useEffect, useState} from 'react';
import {Colors, Fonts} from '../../../constant/Styles';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';
import WineHuntButton from '../../../common/WineHuntButton';
import PreferenceModal from '../../../Modal/PreferenceModal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../../helper/Constant';
import axios from 'axios';
import {showWarning} from '../../../helper/Toastify';

const {width} = Dimensions.get('window');

const WineDetail = props => {
  const id = props?.route?.params.item;

  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState([]);
  const [detail, setDetail] = useState([]);

  useEffect(() => {
    getProductDetail();
  }, []);

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
        setDetail(res?.data?.data);
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
    },
    {
      id: 2,
      name: 'Regular',
    },
    {
      id: 3,
      name: 'Large',
    },
  ];
  const [size, setSize] = useState(sizeList[0]?.id);

  const AddonList = [
    {
      id: 1,
      name: 'Black olives',
    },
    {
      id: 2,
      name: 'Fruits',
    },
    {
      id: 3,
      name: 'Snacks',
    },
  ];

  const [addOn, setAddOn] = useState(AddonList[0]?.id);

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
          <Pressable style={styles.iconButton}>
            <AntDesign name="hearto" size={25} color={Colors.white} />
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
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.vendorName}>{detail?.user?.shop_name}</Text>
              <Pressable
                style={{
                  padding: 3,
                  paddingHorizontal: 5,
                  backgroundColor: Colors.green,
                  alignItems: 'center',
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: Fonts.InterMedium,
                    fontWeight: '600',
                    color: Colors.white,
                  }}>
                  View Detail
                </Text>
              </Pressable>
            </View>
            <Text style={styles.wineName}>
              {detail?.name} ({detail?.title})
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>
                Price <Text style={styles.priceValue}>£12.00</Text>
              </Text>
              <View style={styles.ratingContainer}>
                <AntDesign name="star" size={18} color={Colors.yellow} />
                <Text style={styles.ratingText}>4.3</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Add To Cart</Text>
              </Pressable>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Try Me</Text>
              </Pressable>
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
                    }}>
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
                }}>
                {detail?.product_desc}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Fonts.PhilosopherBold,
                  color: Colors.black,
                }}>
                Suggested for you
              </Text>
              <FlatList
                data={detail?.suggestions}
                contentContainerStyle={{gap: 10}}
                scrollEnabled={false}
                renderItem={({item, index}) => {
                  return (
                    <View
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
                      }}>
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
                            fontSize: 15,
                            fontFamily: Fonts.InterMedium,
                            color: Colors.black,
                            fontWeight: '700',
                          }}>
                          {item?.name} ({item?.title})
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: Fonts.InterMedium,
                            color: Colors.gray,
                          }}>
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
                            }}>
                            $12.00
                          </Text>
                        </View>
                      </View>
                      <View style={{justifyContent: 'space-between'}}>
                        <Pressable>
                          <AntDesign
                            name="hearto"
                            size={25}
                            color={Colors.gray}
                          />
                        </Pressable>
                        <Pressable onPress={() => setShowModal(true)}>
                          <Ionicons
                            name="add-circle"
                            size={25}
                            color={Colors.black}
                          />
                        </Pressable>
                      </View>
                    </View>
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
                }}>
                No Review Found yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <PreferenceModal
        AddonList={AddonList}
        addOn={addOn}
        setAddOn={setAddOn}
        setShowModal={setShowModal}
        setSize={setSize}
        showModal={showModal}
        size={size}
        sizeList={sizeList}
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
    paddingTop: 20,
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
    fontSize: 18,
    fontFamily: Fonts.InterMedium,
    fontWeight: '800',
    color: Colors.black,
    flex: 1,
  },
  wineName: {
    fontSize: 16,
    fontFamily: Fonts.InterMedium,
    fontWeight: '800',
    color: Colors.black,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 18,
    fontFamily: Fonts.InterMedium,
    fontWeight: '800',
    color: Colors.black,
  },
  priceValue: {
    color: Colors.red,
    fontSize: 25,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingText: {
    fontSize: 16,
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
    flex: 0.43,
  },
  buttonText: {
    fontSize: 12,
    fontFamily: Fonts.InterMedium,
    fontWeight: '800',
    color: Colors.white,
  },
});
