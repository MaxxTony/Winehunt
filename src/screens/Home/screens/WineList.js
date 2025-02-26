import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../../components/BackNavigationWithTitle';
import {Colors} from '../../../constant/Styles';
import NewArrivalCard2 from '../components/NewArrivalCard2';

const WineList = props => {
  const data = props?.route?.params?.item;
  const List = props?.route?.params?.data;

  const inset = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title={`${data?.name} Wine List`}
        onPress={() => navigation.goBack()}
      />
      <FlatList
        data={List}
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
            item={item}
          />
        )}
      />
    </View>
  );
};

export default WineList;

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
