import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors, Fonts} from '../../constant/Styles';
import {MultiSwitch} from 'react-native-multiswitch-selector';
import FavouriteCard from './components/FavouriteCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import axios from 'axios';
import {showSucess} from '../../helper/Toastify';

const WishList = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const [type, setType] = useState('Vendors');
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [wines, setWines] = useState([]);

  useEffect(() => {
    getWishList();
  }, []);

  const getWishList = async () => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl7 + Constants.getWishList;
    setLoading(true);
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res?.data?.status === 200) {
        setVendors(res?.data?.data?.vendors || []);
        setWines(res?.data?.data?.wines || []);
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


  const onDelete = async item => {
   
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl7 + Constants.removeToWishList;
    setLoading(true);
    const body = {
      id: type === 'Vendors' ? item?.vendor_id : item?.product_id,
      type: type === 'Vendors' ? 'vendors' : 'wines',
    };
    try {
      const res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res?.data?.status === 200) {
        showSucess(res?.data?.message);
        getWishList();
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

  const onClearAll = async () => {
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;
    const url = Constants.baseUrl7 + Constants.clearWishList;
    setLoading(true);
    const body = {
      type: type === 'Vendors' ? 'vendors' : 'wines',
    };
    try {
      const res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res?.data?.status === 200) {
        showSucess(res?.data?.message);
        getWishList();
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
        title="Favorite"
        onPress={() => navigation.goBack()}
        rightIcon={true}
        rightText="Clear All"
        onPressRightIcon={() => onClearAll()}
        extraStyle={styles.backNavigationExtraStyle}
      />
      <View style={styles.switchContainer}>
        <MultiSwitch
          allStates={['Vendors', 'Wines']}
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
      <FlatList
        data={type === 'Vendors' ? vendors : wines}
        refreshing={loading}
        onRefresh={getWishList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          gap: 10,
          flexGrow: 1,
        }}
        renderItem={({item, index}) => (
          <FavouriteCard
            item={item}
            type={type}
            onPress={() => onDelete(item)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.noDataText} allowFontScaling={false}>
              {type === 'Vendors' ? 'No vendors found' : 'No wines found'}
            </Text>
          ) : null
        }
      />
    </View>
  );
};

export default WishList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backNavigationExtraStyle: {
    borderBottomWidth: 0,
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
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.black,
    marginTop: 20,
    fontFamily: Fonts.InterRegular,
    flex: 1,
  },
});
