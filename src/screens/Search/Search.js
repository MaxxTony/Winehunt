import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Colors, Fonts} from '../../constant/Styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {MultiSwitch} from 'react-native-multiswitch-selector';
import WineCard from './components/WineCard';
import MapView, {
  Callout,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Polygon,
} from 'react-native-maps';
import VendorLocationFilter from './Modal/VendorLocationFilter';
import FilterModal from './Modal/FilterModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import axios from 'axios';
import {showWarning} from '../../helper/Toastify';
import Geolocation from '@react-native-community/geolocation';
import AnimatedCartModal from '../Home/components/AnimatedCartModal';

const Search = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const mapViewRef = useRef(null);
  const isFocused = useIsFocused();
  const [region, setRegion] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [type, setType] = useState('Popular');
  const [showMapType, setShowMapType] = useState(false);
  const bottomSheetModalRef2 = useRef(null);
  const snapPoints2 = useMemo(
    () => (Platform.OS === 'ios' ? ['80%'] : ['100%']),
    [],
  );
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [allMarkers, setAllMarkers] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  useEffect(() => {
    getProducts();
  }, [searchText, type]);

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
    getCurrentPosition();
  }, []);

  const getCurrentPosition = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: Platform.OS === 'ios' ? true : true,
          timeout: 10000,
        });
      });
      const {latitude, longitude} = position.coords;

      const currentRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.003,
      };
      setRegion(currentRegion);
      mapViewRef.current?.animateToRegion(currentRegion, 1000);
    } catch (error) {
      console.error('Error getting current position:', error);
    }
  };

  const getProducts = async () => {
    const data = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(data)?.token;
    const url = Constants.baseUrl4 + Constants.searchProducts;
    setLoading(true);

    const info = {
      search_name: searchText,
      shop_type: '',
      product_type: '',
      categories: '',
      price_range: 'high_to_low',
      latest: true,
      filter_by: type === 'Popular' ? 'popular' : 'top_rated',
    };

    try {
      const res = await axios.post(url, info, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res?.status === 200) {
        setProducts(res?.data?.products);

        const uniqueMarkers = {};
        res?.data?.products.forEach(item => {
          const userId = item?.user?.id;
          if (!uniqueMarkers[userId]) {
            let latitude = parseFloat(item?.user?.latitude);
            let longitude = parseFloat(item?.user?.longitude);
            const shopName = item?.user?.shop_name || 'Unknown Shop';
            if (
              !latitude ||
              !longitude ||
              isNaN(latitude) ||
              isNaN(longitude)
            ) {
              latitude = 28.625986666666666;
              longitude = 77.38616833333333;
            }
            uniqueMarkers[userId] = {latitude, longitude, shopName};
          }
        });

        const markers = Object.values(uniqueMarkers);

        setAllMarkers(markers);
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

  useEffect(() => {
    if (allMarkers.length > 0 && mapViewRef.current) {
      mapViewRef.current.fitToCoordinates(
        allMarkers.map(marker => ({
          latitude: marker.latitude,
          longitude: marker.longitude,
        })),
        {
          edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
          animated: true,
        },
      );
    }
  }, [allMarkers]);

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
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Search"
        onPress={() => navigation.goBack()}
        extraStyle={styles.backNavigationExtraStyle}
      />
      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, styles.flex1]}>
          <TextInput
            value={searchText}
            onChangeText={e => setSearchText(e)}
            style={styles.searchInput}
            placeholder="Search by cultivars/wines/vendors"
            placeholderTextColor={Colors.gray9}
          />
          {searchText.length > 0 && (
            <AntDesign
              name="closecircle"
              size={20}
              color={Colors.gray4}
              onPress={() => setSearchText('')}
            />
          )}
          <Image
            source={require('./images/searchIcon.png')}
            style={styles.iconSmall}
          />
        </View>
        <Pressable
          style={styles.iconBox}
          onPress={() => setShowMapType(!showMapType)}>
          {showMapType ? (
            <Feather name="map" size={25} color={Colors.black} />
          ) : (
            <Feather name="list" size={25} color={Colors.black} />
          )}
        </Pressable>
        <Pressable
          style={styles.iconBox}
          onPress={() => bottomSheetModalRef2.current?.snapToIndex(0)}>
          <Image
            source={require('./images/filter.png')}
            style={styles.iconLarge}
            resizeMode="contain"
          />
        </Pressable>
      </View>
      <View style={styles.switchContainer}>
        <MultiSwitch
          allStates={['Top Rated', 'Popular']}
          currentState={type}
          changeState={setType}
          mode="white"
          styleRoot={styles.multiSwitchRoot}
          styleAllStatesContainer={styles.multiSwitchContainer}
          styleActiveState={styles.activeState}
          styleActiveStateText={styles.activeStateText}
          styleInactiveStateText={styles.inactiveStateText}
        />
      </View>

      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={'large'} color={Colors.red2} />
        </View>
      ) : products.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.noProductText} allowFontScaling={false}>
            No products found
          </Text>
        </View>
      ) : showMapType ? (
        <MapView
          ref={mapViewRef}
          scrollEnabled
          showsCompass
          followsUserLocation
          mapType="standard"
          showsScale
          zoomControlEnabled={true}
          initialRegion={region}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={{height: '75%', width: '100%'}}>
          {allMarkers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}>
              {/* Custom Tooltip */}
              <Callout tooltip>
                <View style={styles.calloutContainer}>
                  <Text style={styles.shopName} allowFontScaling={false}>
                    {marker.shopName}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          refreshing={loading}
          onRefresh={getProducts}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{columnGap: 10}}
          contentContainerStyle={{
            padding: 20,
            gap: 10,
            columnGap: 10,
          }}
          renderItem={({item}) => (
            <WineCard
              item={item}
              onPress={() =>
                navigation.navigate('WineDetail', {item: item?.id})
              }
            />
          )}
        />
      )}

      <FilterModal
        bottomSheetModalRef2={bottomSheetModalRef2}
        snapPoints2={snapPoints2}
      />

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
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backNavigationExtraStyle: {
    borderBottomWidth: 0,
  },
  searchContainer: {
    paddingHorizontal: 20,
    gap: 10,
    flexDirection: 'row',
  },
  searchBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray2,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
    elevation: 5,
  },
  flex1: {
    flex: 1,
  },
  searchInput: {
    paddingVertical: Platform.OS === 'ios' ? 5 : 0,
    flex: 1,
    paddingRight: 10,
    color: Colors.black,
  },
  iconSmall: {
    height: 16,
    width: 16,
  },
  iconBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray2,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
    elevation: 5,
  },
  iconLarge: {
    height: 23,
    width: 23,
  },
  switchContainer: {
    padding: 20,
    borderBottomWidth: 2,
    borderColor: Colors.gray2,
  },
  multiSwitchRoot: {
    borderRadius: 50,
    padding: 0,
    height: 50,
  },
  multiSwitchContainer: {
    backgroundColor: Colors.gray6,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#E6EBF1',
  },
  activeState: {
    backgroundColor: Colors.blue,
    borderRadius: 50,
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
  calloutContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 5, // Shadow for Android
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});
