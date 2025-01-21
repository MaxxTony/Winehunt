import {Image, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../constant/Styles';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WineHuntButton from '../../common/WineHuntButton';

const MileStone = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <View style={{padding: 20, flex: 1}}>
        <Image
          source={require('./images/NewBarcode.png')}
          style={{height: 65, width: width - 40, borderRadius: 10}}
        />
        <View
          style={{flex: 1, alignItems: 'center', gap: 20, paddingVertical: 30}}>
          <Image
            source={require('./images/boy.png')}
            style={{height: 265, width: 265}}
          />
          <Text
            style={{
              fontFamily: Fonts.InterRegular,
              color: Colors.black,
              fontWeight: '500',
              fontSize: 18,
              textAlign: 'center',
            }}>
            Almost there! Come back when you reach the full score to get awesome
            deals!
          </Text>

          <WineHuntButton
            text="Go Back"
            extraButtonStyle={{paddingHorizontal: 50}}
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </View>
  );
};

export default MileStone;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
