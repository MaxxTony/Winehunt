import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Key from '../../utils/Key';

const AuthType = () => {
  const {width} = useWindowDimensions();
  const navigation = useNavigation();

  GoogleSignin.configure({
    webClientId: Key.webClientId,
  });

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();

      if (userInfo) {
        // googleRegister(userInfo?.user);
      }
    } catch (error) {
      console.log(error, '===>');
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

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
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Image
            source={require('../../../assets/images/LoginPage/Mobile.png')}
            style={{width: width - 40, height: 46, borderRadius: 5}}
          />
        </Pressable>
        <Pressable onPress={() => googleLogin()}>
          <Image
            source={require('../../../assets/images/LoginPage/Google.png')}
            style={{width: width - 40, height: 46, borderRadius: 5}}
          />
        </Pressable>
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

export default AuthType;

const styles = StyleSheet.create({});
