import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  useRef as useAnimatedRef,
} from 'react';
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
import {Colors, Fonts} from '../../constant/Styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {MultiSwitch} from 'react-native-multiswitch-selector';
import WineCard from './components/WineCard';
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import FilterModal from './Modal/FilterModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import axios from 'axios';
import {showWarning} from '../../helper/Toastify';
import Geolocation from '@react-native-community/geolocation';
import AnimatedCartModal from '../Home/components/AnimatedCartModal';
import AnimatedCartButton from '../../components/AnimatedCartButton';
import {fetchProfile} from '../../redux/slices/profileSlice';
import {useDispatch, useSelector} from 'react-redux';

// --- Debounce Hook ---
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- SearchBar Component ---
const rotatingPlaceholders = [
  'Search by wine',
  'Search by vendor',
  'Search by cultivar',
];

const SearchBar = React.memo(
  ({searchText, setSearchText, onFilterPress, onMapToggle, showMapType}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    useEffect(() => {
      if (!isFocused && !searchText) {
        const interval = setInterval(() => {
          setPlaceholderIndex(prev => (prev + 1) % rotatingPlaceholders.length);
        }, 2000);
        return () => clearInterval(interval);
      }
    }, [isFocused, searchText]);

    // Reset to first placeholder when user focuses or types
    useEffect(() => {
      if (isFocused || searchText) {
        setPlaceholderIndex(0);
      }
    }, [isFocused, searchText]);

    return (
      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, styles.flex1]}>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
            placeholder={rotatingPlaceholders[placeholderIndex]}
            placeholderTextColor={Colors.gray9}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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
        <Pressable style={styles.iconBox} onPress={onMapToggle}>
          {showMapType ? (
            <Feather name="map" size={25} color={Colors.black} />
          ) : (
            <Feather name="list" size={25} color={Colors.black} />
          )}
        </Pressable>
        <Pressable style={styles.iconBox} onPress={onFilterPress}>
          <Image
            source={require('./images/filter.png')}
            style={styles.iconLarge}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    );
  },
);

// --- SwitchSelector Component ---
const SwitchSelector = React.memo(({type, setType}) => (
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
));

// --- ProductList Component ---
const ProductList = React.memo(({products, loading, onRefresh, navigation}) =>
  loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} color={Colors.red2} />
    </View>
  ) : products.length === 0 ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={styles.noProductText} allowFontScaling={false}>
        No products found
      </Text>
    </View>
  ) : (
    <FlatList
      data={products}
      refreshing={loading}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{padding: 20, gap: 10}}
      keyExtractor={item => String(item.id)}
      renderItem={({item}) => (
        <WineCard
          item={item}
          onPress={() => navigation.navigate('WineDetail', {item: item?.id})}
        />
      )}
    />
  ),
);

// --- MapProductMarkers Component ---
const MapProductMarkers = React.memo(
  ({region, allMarkers, mapViewRef, onMarkerPress}) => {
    // Custom marker component
    const CustomMarker = ({marker}) => (
      <Marker
        coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
        title={marker.shopName}
        tracksViewChanges={false}
        description={marker.address}
        onPress={() => onMarkerPress(marker)}>
        <View style={styles.customMarkerContainer}>
          <View style={styles.customMarker}>
            <Text style={styles.markerText} allowFontScaling={false}>
              {marker.shopName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        <Callout tooltip>
          <View style={styles.calloutContainer}>
            <Text style={styles.shopName} allowFontScaling={false}>
              {marker.shopName}
            </Text>
            {marker.address && (
              <Text style={styles.shopAddress} allowFontScaling={false}>
                {marker.address}
              </Text>
            )}
            {marker.shopType && (
              <Text style={styles.shopType} allowFontScaling={false}>
                {marker.shopType}
              </Text>
            )}
          </View>
        </Callout>
      </Marker>
    );

    return (
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
          <CustomMarker key={`${marker.userId}-${index}`} marker={marker} />
        ))}
      </MapView>
    );
  },
);

// --- CartButton Component ---
const CartButton = React.memo(({count, onPress}) => (
  <AnimatedCartButton count={count} onPress={onPress} label="View Cart" />
));

// --- CartModal Component ---
const CartModal = React.memo(
  ({
    visible,
    setIsCartVisible,
    cartData,
    onClose,
    navigation,
    onRemoveItem,
  }) => (
    <AnimatedCartModal
      visible={visible}
      setIsCartVisible={setIsCartVisible}
      cartData={cartData}
      onClose={onClose}
      navigation={navigation}
      onRemoveItem={onRemoveItem}
    />
  ),
);

const Search = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const mapViewRef = useRef(null);
  const isFocused = useIsFocused();
  const [region, setRegion] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [type, setType] = useState('Popular');
  const [showMapType, setShowMapType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [allMarkers, setAllMarkers] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [homeData, setHomeData] = useState([]);
  const [filterModal, setFilterModal] = useState(false);

  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.profile);

  // Debounced search text for API call
  const debouncedSearchText = useDebounce(searchText, 400);

  // console.log(allMarkers)
  // --- Fetch Cart Data ---
  const getCartData = useCallback(async () => {
    try {
      const info = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(info)?.token;
      const url = Constants.baseUrl8 + Constants.getCart;
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
  }, []);

  // --- Fetch Products ---
  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(data)?.token;
      const url = Constants.baseUrl4 + Constants.searchProducts;
      const info = {
        search_name: debouncedSearchText,
        shop_type: '',
        product_type: '',
        categories: '',
        price_range: 'high_to_low',
        latest: true,
        filter_by: type === 'Popular' ? 'popular' : 'top_rated',
      };
    
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
            const address = item?.user?.address || '';
            const shopType = item?.user?.vendor_shop_type?.name || '';
            const shopEmail = item?.user?.shop_email || '';

            if (
              !latitude ||
              !longitude ||
              isNaN(latitude) ||
              isNaN(longitude)
            ) {
              latitude = 28.625986666666666;
              longitude = 77.38616833333333;
            }
            uniqueMarkers[userId] = {
              userId,
              latitude,
              longitude,
              shopName,
              address,
              shopType,
              shopEmail,
            };
          }
        });
        setAllMarkers(Object.values(uniqueMarkers));
      }
    } catch (error) {
      if (error.response) {
        showWarning(error.response.data?.message);
      } else if (error.request) {
        showWarning('No response from server');
      } else {
        showWarning(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, type]);

  // --- Get Current Position (debounced) ---
  const getCurrentPosition = useCallback(() => {
    setLocationError(null);
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const currentRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.003,
        };
        setRegion(currentRegion);
        mapViewRef.current?.animateToRegion(currentRegion, 1000);
      },
      error => {
        setLocationError(error.message || 'Location error');
      },
      {
        enableHighAccuracy: Platform.OS == 'ios' ? true : false,
        timeout: 10000,
      },
    );
  }, []);

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
        setHomeData(res?.data?.categories);
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

  // --- Effects ---
  useEffect(() => {
    getProducts();
  }, [isFocused, type]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfile());
    }, [dispatch]),
  );

  useEffect(() => {
    getCartData();
    getCurrentPosition();
    getHomePageData();
  }, [isFocused]);

  // Fit map to markers when markers change AND map is visible
  useEffect(() => {
    if (allMarkers.length > 0 && mapViewRef.current && showMapType) {
      const coordinates = allMarkers.map(marker => ({
        latitude: marker.latitude,
        longitude: marker.longitude,
      }));

      // Calculate bounds for better fitting
      const latitudes = coordinates.map(coord => coord.latitude);
      const longitudes = coordinates.map(coord => coord.longitude);

      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);

      const latDelta = (maxLat - minLat) * 1.5; // Add 50% padding
      const lngDelta = (maxLng - minLng) * 1.5;

      // Ensure minimum zoom level
      const minDelta = 0.01;
      const finalLatDelta = Math.max(latDelta, minDelta);
      const finalLngDelta = Math.max(lngDelta, minDelta);

      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;

      const newRegion = {
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: finalLatDelta,
        longitudeDelta: finalLngDelta,
      };

      mapViewRef.current.animateToRegion(newRegion, 1000);
    }
  }, [allMarkers, showMapType]);

  // --- Handle Marker Press ---
  const handleMarkerPress = useCallback(marker => {
    const userCoords = {
      latitude: parseFloat(userData?.latitude),
      longitude: parseFloat(userData?.longitude),
    };

    console.log('Marker pressed:', marker);
    navigation.navigate('VendorDetail', {
      item: marker,
      userCoordinates: userCoords,
    });
    // You can add navigation logic here to show vendor details
    // navigation.navigate('VendorDetail', { vendorId: marker.userId });
  }, []);

  // --- Remove Item from Cart ---
  const handleRemoveItem = useCallback(
    async itemId => {
      try {
        const info = await AsyncStorage.getItem('userDetail');
        const token = JSON.parse(info)?.token;
        const url = Constants.baseUrl8 + Constants.deleteCart;
        const data = {id: itemId};
        const res = await axios.post(url, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (res?.data?.status == 200) {
          getCartData();
        }
      } catch (error) {
        showWarning(error.response?.data?.message || 'Error updating cart');
      }
    },
    [getCartData],
  );

  // --- Render ---
  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Search"
        onPress={() => navigation.goBack()}
        extraStyle={styles.backNavigationExtraStyle}
      />
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        onFilterPress={() => setFilterModal(true)}
        onMapToggle={() => setShowMapType(v => !v)}
        showMapType={showMapType}
      />
      <SwitchSelector type={type} setType={setType} />
      {locationError && (
        <View
          style={{
            padding: 10,
            backgroundColor: '#fee',
            borderRadius: 8,
            margin: 10,
          }}>
          <Text style={{color: '#c00', textAlign: 'center'}}>
            Location error: {locationError}
          </Text>
        </View>
      )}
      {showMapType ? (
        allMarkers.length === 0 ? (
          <View style={styles.noMarkersContainer}>
            <Text style={styles.noMarkersText} allowFontScaling={false}>
              No vendors found in this area
            </Text>
          </View>
        ) : (
          <MapProductMarkers
            region={region}
            allMarkers={allMarkers}
            mapViewRef={mapViewRef}
            onMarkerPress={handleMarkerPress}
          />
        )
      ) : (
        <ProductList
          products={products}
          loading={loading}
          onRefresh={getProducts}
          navigation={navigation}
        />
      )}
      <FilterModal
        visible={filterModal}
        data={homeData}
        onClose={() => setFilterModal(false)}
        onApplyFilters={filters => {
          console.log(filters, 'lolo');
          setFilterModal(false);
          getProducts();
        }}
      />
      {cartData?.length > 0 && (
        <CartButton
          count={cartData.length}
          onPress={() => setIsCartVisible(true)}
        />
      )}
      {cartData?.length > 0 && (
        <CartModal
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
    padding: 15,
    borderRadius: 12,
    elevation: 8, // Shadow for Android
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    minWidth: 200,
    maxWidth: 250,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: Fonts.InterRegular,
  },
  customMarkerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  customMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.blue,
  },
  markerText: {
    fontFamily: Fonts.InterRegular,
    color: Colors.blue,
    fontWeight: 'bold',
    fontSize: 16,
  },
  shopAddress: {
    fontSize: 12,
    color: Colors.gray4,
    textAlign: 'center',
    marginBottom: 2,
    fontFamily: Fonts.InterRegular,
  },
  shopType: {
    fontSize: 12,
    color: Colors.blue,
    textAlign: 'center',
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
  },
  noMarkersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  noMarkersText: {
    fontSize: 16,
    color: Colors.gray4,
    textAlign: 'center',
    fontFamily: Fonts.InterRegular,
  },
});
