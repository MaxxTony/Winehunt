import {
  Image,
  ImageBackground,
  Platform,
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
import {Settings, LoginManager, AccessToken} from 'react-native-fbsdk-next';
import Key from '../../utils/Key';
import Constants from '../../helper/Constant';
import {showWarning} from '../../helper/Toastify';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthType = () => {
  const {width} = useWindowDimensions();
  const navigation = useNavigation();

  GoogleSignin.configure({
    webClientId: Key.webClientId,
  });
  Settings.initializeSDK();

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();

      if (userInfo) {
        googleRegister(userInfo?.user);
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

  const googleRegister = async user => {
    const data = {
      google_id: user?.id,
      full_name: user?.name,
      email: user?.email,
      app_type: 'user',
    };
    const url = Constants.baseUrl + Constants.socialLogin + '/google';
    try {
      const res = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res?.status == 200) {
        await AsyncStorage.setItem('userDetail', JSON.stringify(res?.data));
        navigation.navigate('TabNavigator');
      }
    } catch (error) {
      if (error.response) {
        console.log('Server Error:', error.response.data);
        showWarning(error.response.data?.message);
      } else if (error.request) {
        console.log('No Response:', error.request);
      } else {
        console.log('Request Error:', error.message);
      }
    }
  };

  const faceBookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        console.log('Error in getting request from Facebook', result);
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        let token = data.accessToken.toString();
        const response = await fetch(
          'https://graph.facebook.com/v12.0/me?fields=email,name,id,picture&access_token=' +
            token,
        );
        if (!response.ok) {
          console.log(
            `Facebook API request failed with status ${response.status}`,
          );
        }
        const fbData = await response.json();
     
        fbRegister(fbData);
        return fbData;
      }
    } catch (error) {
      console.error('Facebook login failed:', error);
    }
  };

  const fbRegister = async user => {
    const data = {
      facebook_id: user?.id,
      full_name: user?.name,
      email: user?.email,
      app_type: 'user',
    };
    const url = Constants.baseUrl + Constants.socialLogin + '/facebook';
    try {
      const res = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res?.status == 200) {
        await AsyncStorage.setItem('userDetail', JSON.stringify(res?.data));
        navigation.navigate('TabNavigator');
      }
    } catch (error) {
      if (error.response) {
        console.log('Server Error:', error.response.data);
        showWarning(error.response.data?.message);
      } else if (error.request) {
        console.log('No Response:', error.request);
      } else {
        console.log('Request Error:', error.message);
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
        }}
        allowFontScaling={false}>
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
        <Pressable onPress={() => faceBookLogin()}>

        <Image
          source={require('../../../assets/images/LoginPage/Facebook.png')}
          style={{width: width - 40, height: 46, borderRadius: 5}}
          />
          </Pressable>
        {Platform.OS == 'ios' && (
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
        )}
      </View>
    </ImageBackground>
  );
};

export default AuthType;

const styles = StyleSheet.create({});
