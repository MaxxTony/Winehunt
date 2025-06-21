import {FlatList, StyleSheet, Text, View, RefreshControl} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../../components/BackNavigationWithTitle';
import {Colors} from '../../../constant/Styles';
import NewArrivalCard2 from '../components/NewArrivalCard2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../../helper/Constant';
import {showWarning} from '../../../helper/Toastify';
import axios from 'axios';

const WineList = props => {
  const data = props?.route?.params?.item;

  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [wineList, setWineList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (data) {
      getWineById();
    }
  }, [data]);

  const getWineById = useCallback(async () => {
    const datas = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(datas)?.token;
    const url = `${Constants.baseUrl4}${Constants.CategoryProduct}`;

    setLoading(true);
    setRefreshing(true);

    try {
      const res = await axios.post(
        url,
        {category_id: data?.id},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (res?.status === 200) {
        setWineList(res?.data?.data || []);
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
      setRefreshing(false);
    }
  }, [data]);

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title={`${data?.name} Wine List`}
        onPress={() => navigation.goBack()}
      />

      {loading && wineList.length === 0 ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : wineList.length === 0 ? (
        <Text style={styles.emptyListText}>No wines available.</Text>
      ) : (
        <FlatList
          data={wineList}
      
          keyExtractor={item => item?.id?.toString()}
          showsVerticalScrollIndicator={false}
       
          contentContainerStyle={{
            padding: 20,
            gap: 10,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getWineById} />
          }
          renderItem={({item}) => (
            <NewArrivalCard2
              onPress={() =>
                navigation.navigate('WineDetail', {item: item?.id})
              }
              item={item}
            />
          )}
        />
      )}
    </View>
  );
};

export default WineList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: Colors.gray,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: Colors.red,
  },
});
