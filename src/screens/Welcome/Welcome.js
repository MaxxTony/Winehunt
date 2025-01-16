import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../constant/Styles';
import WineHuntButton from '../../common/WineHuntButton';
import {useNavigation} from '@react-navigation/native';

const Welcome = () => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          gap: 20,
        }}>
        <Image
          source={require('../../../assets/images/OnBoardingScreenImages/Welcome.png')}
          style={{height: 280, width: 290}}
          resizeMode="contain"
        />
        <Text
          style={{
            fontSize: 34,
            fontFamily: Fonts.PhilosopherBold,
            color: Colors.black,
          }}>
          Congratulations
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: Fonts.InterBold,
            color: Colors.black,
          }}>
          Your account has been successfully created !!!
        </Text>
      </View>
      <View style={{padding: 20, marginBottom: 30}}>
        <WineHuntButton
          text="Continue"
          onPress={() => navigation.navigate('TabNavigator')}
        />
      </View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({});
