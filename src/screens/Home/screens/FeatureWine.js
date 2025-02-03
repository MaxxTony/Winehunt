import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackNavigationWithTitle from '../../../components/BackNavigationWithTitle';
import {Colors} from '../../../constant/Styles';
import NewArrivalCard2 from '../components/NewArrivalCard2';

const FeatureWine = props => {
  const data = props?.route?.params?.data;
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Feature Wine"
        onPress={() => navigation.goBack()}
      />
      <FlatList
        data={data}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{columnGap: 10}}
        contentContainerStyle={{
          padding: 20,
          gap: 10,
          columnGap: 10,
        }}
        renderItem={({item}) => (
          <NewArrivalCard2
            onPress={() => navigation.navigate('WineDetail', {item: item?.id})}
          />
        )}
      />
    </View>
  );
};

export default FeatureWine;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
