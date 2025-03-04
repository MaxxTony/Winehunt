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
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {MultiSwitch} from 'react-native-multiswitch-selector';
import WineCard from './components/WineCard';

import VendorLocationFilter from './Modal/VendorLocationFilter';
import FilterModal from './Modal/FilterModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import axios from 'axios';
import {showWarning} from '../../helper/Toastify';

const Search = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(
    () => (Platform.OS === 'ios' ? ['45%'] : ['55%']),
    [],
  );

  const [searchText, setSearchText] = useState('');
  const [type, setType] = useState('Popular');
  const [selectedVendor, setSelectedVendor] = useState(null);

  const bottomSheetModalRef2 = useRef(null);
  const snapPoints2 = useMemo(
    () => (Platform.OS === 'ios' ? ['80%'] : ['100%']),
    [],
  );
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const vendorLocation = [
    {
      id: 1,
      name: 'Restaurant',
    },
    {
      id: 2,
      name: 'Hotel',
    },
    {
      id: 3,
      name: 'Winery',
    },
    {
      id: 4,
      name: 'Wine Bar',
    },
    {
      id: 5,
      name: 'Wine Shop',
    },
  ];

  useEffect(() => {
    getProducts();
  }, [searchText]);

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
      price_range: '',
      latest: true,
      filter_by: 'top_rated',
    };
    try {
      const res = await axios.post(url, info, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res?.status == 200) {
        setProducts(res?.data?.products);
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
        {/* <Pressable
          style={styles.iconBox}
          onPress={() => bottomSheetModalRef.current?.snapToIndex(0)}>
          <Image
            source={require('./images/map.png')}
            style={styles.iconLarge}
            resizeMode="contain"
          />
        </Pressable> */}
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

      <VendorLocationFilter
        bottomSheetModalRef={bottomSheetModalRef}
        snapPoints={snapPoints}
        vendorLocation={vendorLocation}
        selectedVendor={selectedVendor}
        setSelectedVendor={setSelectedVendor}
      />

      <FilterModal
        bottomSheetModalRef2={bottomSheetModalRef2}
        snapPoints2={snapPoints2}
      />
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
});
