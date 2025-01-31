import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../../components/BackNavigationWithTitle';
import {Colors} from '../../../constant/Styles';
import NearVendorCards from '../components/NearVendorCards';

const Vendors = props => {
  const data = props?.route?.params?.data;

  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Vendors near By You"
        onPress={() => navigation.goBack()}
      />
      <FlatList
        data={data}
        contentContainerStyle={styles.verticalList}
        renderItem={({item}) => (
          <NearVendorCards item={item} navigation={navigation} />
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
  },
});
