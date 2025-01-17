import {
  Image,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts} from '../../constant/Styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {MultiSwitch} from 'react-native-multiswitch-selector';

const Search = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState('');
  const [type, setType] = useState('Popular');

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.container, {paddingTop: inset.top}]}>
        <BackNavigationWithTitle
          title="Search"
          onPress={() => navigation.goBack()}
          extraStyle={{borderBottomWidth: 0}}
        />
        <View style={{paddingHorizontal: 20, gap: 10, flexDirection: 'row'}}>
          <View
            style={{
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
              flex: 1,
            }}>
            <TextInput
              value={searchText}
              onChangeText={e => setSearchText(e)}
              style={{
                paddingVertical: Platform.OS == 'ios' ? 5 : 0,
                flex: 1,
                paddingRight: 10,
                color: Colors.black,
              }}
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
              style={{height: 16, width: 16}}
            />
          </View>
          <View
            style={{
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
            }}>
            <Image
              source={require('./images/map.png')}
              style={{height: 23, width: 23}}
              resizeMode="contain"
            />
          </View>
          <View
            style={{
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
            }}>
            <Image
              source={require('./images/filter.png')}
              style={{height: 23, width: 23}}
              resizeMode="contain"
            />
          </View>
        </View>
        <View
          style={{
            padding: 20,
            borderBottomWidth: 2,
            borderColor: Colors.gray2,
          }}>
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
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
    // paddingHorizontal: 10,
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
