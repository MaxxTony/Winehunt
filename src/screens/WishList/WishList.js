import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors, Fonts} from '../../constant/Styles';
import {MultiSwitch} from 'react-native-multiswitch-selector';
import WineHuntButton from '../../common/WineHuntButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FavouriteCard from './components/FavouriteCard';

const WishList = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const [type, setType] = useState('Vendors');

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Favorite"
        onPress={() => navigation.goBack()}
        rightIcon={true}
        rightText="Clear All"
        onPressRightIcon={() => Alert.alert('Clearing all done !!')}
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
        data={Array.from({length: 20})}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          gap: 10,
        }}
        renderItem={() => {
          return <FavouriteCard />;
        }}
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
});
