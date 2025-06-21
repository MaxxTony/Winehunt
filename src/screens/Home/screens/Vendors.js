import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../../components/BackNavigationWithTitle';
import {Colors} from '../../../constant/Styles';
import NearVendorCards from '../components/NearVendorCards';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProfile} from '../../../redux/slices/profileSlice';

const Vendors = props => {
  const data = props?.route?.params?.data;
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.profile);
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfile());
    }, [dispatch]),
  );

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Vendors near By You"
        onPress={() => navigation.goBack()}
      />
      <FlatList
        data={data}
        contentContainerStyle={styles.verticalList}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <NearVendorCards
            item={item}
            navigation={navigation}
            userCoordinates={{
              latitude: userData?.latitude,
              longitude: userData?.longitude,
            }}
          />
        )}
      />
    </View>
  );
};

export default Vendors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  verticalList: {
    gap: 10,
    margin: 15,
    paddingBottom:50
  },
});
