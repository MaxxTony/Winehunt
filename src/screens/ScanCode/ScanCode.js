import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../constant/Styles';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WineHuntButton from '../../common/WineHuntButton';

const ScanCode = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <View style={{padding: 20, flex: 1}}>
        <Image
          source={require('./Images/codebox.png')}
          style={{height: 65, width: '100%'}}
          resizeMode="contain"
        />
        <View
          style={{flex: 1, alignItems: 'center', gap: 20, paddingVertical: 30}}>
          <Image
            source={require('./Images/qrCode.png')}
            style={{height: 265, width: 265}}
          />
          <Text
            style={{
              fontFamily: Fonts.InterRegular,
              color: Colors.red,
              fontWeight: '500',
              fontSize: 18,
            }} allowFontScaling={false}>
            Use this one-time promo code
          </Text>
          <Text
            style={{
              fontFamily: Fonts.InterMedium,
              color: Colors.black,
              fontWeight: '700',
              fontSize: 25,
            }} allowFontScaling={false}>
            45@#12389
          </Text>
          <WineHuntButton
            text="Go Back"
            extraButtonStyle={{paddingHorizontal: 50}}
            onPress={() => navigation.goBack()}
            allowFontScaling={false}
          />
        </View>
      </View>
    </View>
  );
};

export default ScanCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
