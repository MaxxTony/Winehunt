import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../constant/Styles';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WineHuntButton from '../../common/WineHuntButton';

const ScanWineCode = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <View style={{padding: 20, flex: 1}}>
        <Image
          source={require('./Images/box2.png')}
          style={{height: 65, width: '100%'}}
          resizeMode="contain"
        />
        <View
          style={{flex: 1, alignItems: 'center', gap: 20, paddingVertical: 30}}>
          <Image
            source={require('./Images/code2.png')}
            style={{height: 265, width: 265}}
          />
          <Text
            style={{
              fontFamily: Fonts.InterRegular,
              color: Colors.red,
              fontWeight: '500',
              fontSize: 18,
            }}>
            Scan OR Code
          </Text>
          <Text
            style={{
              fontFamily: Fonts.InterMedium,
              color: Colors.black,
              fontSize: 15,
            }}>
            Book your table or room on the vendor’s website (link will be
            provided by the vendor). Show this QR code at reception to increase
            your Milestone score and apply the discount!
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

export default ScanWineCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
