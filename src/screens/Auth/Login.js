import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React from 'react';

const Login = () => {
  const {width} = useWindowDimensions();

  return (
    <ImageBackground
      source={require('../../../assets/images/LoginPage/ImgBg.png')}
      style={{flex: 1, justifyContent: 'center'}}>
      <Text
        style={{
          fontSize: 45,
          color: '#AC1C2B',
          fontFamily: 'Philosopher-Bold',
          textAlign: 'center',
        }}>
        WineHunt
      </Text>
      <View style={{padding: 20, gap: 10}}>
        <Text
          style={{
            fontSize: 16,
            color: '#000',
            fontFamily: 'Inter_18pt-Medium',
            fontWeight: '600',
          }}>
          Continue With Phone
        </Text>
        <Image
          source={require('../../../assets/images/LoginPage/Mobile.png')}
          style={{width: width - 40, height: 46, borderRadius: 5}}
        />
        <Image
          source={require('../../../assets/images/LoginPage/Google.png')}
          style={{width: width - 40, height: 46, borderRadius: 5}}
        />
        <Image
          source={require('../../../assets/images/LoginPage/Facebook.png')}
          style={{width: width - 40, height: 46, borderRadius: 5}}
        />
        <Image
          source={require('../../../assets/images/LoginPage/Apple.png')}
          style={{
            width: width - 40,
            height: 46,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#E4E3E3',
          }}
        />
      </View>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({});
