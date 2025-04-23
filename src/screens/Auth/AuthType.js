import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
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

  const SocialLoginButton = ({
    icon,
    text,
    backgroundColor,
    textColor,
    onPress,
  }) => {
    return (
      <TouchableOpacity
        style={[styles.button, {backgroundColor}]}
        onPress={onPress}>
        <Image source={icon} style={styles.icon} />
        <Text style={[styles.text, {color: textColor}]}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/LoginPage/ImgBg.png')}
      style={{flex: 1, resizeMode: 'cover', justifyContent: 'center'}}>
      <Text style={styles.logoText} allowFontScaling={false}>
        WineHunt
      </Text>

      <View style={styles.overlay}>
        <View style={styles.container}>
          <SocialLoginButton
            onPress={() => navigation.navigate('Login')}
            icon={require('../../../assets/images/LoginPage/calls.png')}
            text="Continue with Mobile Number"
            backgroundColor="#111"
            textColor="#fff"
            allowFontScaling={false}
          />
          <SocialLoginButton
            onPress={() => googleLogin()}
            icon={require('../../../assets/images/LoginPage/googles.png')}
            text="Continue with Google"
            backgroundColor="#EA4335"
            textColor="#fff"
            allowFontScaling={false}
          />
          <SocialLoginButton
            onPress={() => faceBookLogin()}
            icon={require('../../../assets/images/LoginPage/facebooks.png')}
            text="Continue with Facebook"
            backgroundColor="#1877F2"
            textColor="#fff"
            allowFontScaling={false}
          />
          {Platform.OS === 'ios' && (
            <SocialLoginButton
              icon={require('../../../assets/images/LoginPage/apples.png')}
              text="Continue with Apple"
              backgroundColor="#fff"
              textColor="#000"
              allowFontScaling={false}
            />
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

export default AuthType;

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoText: {
    fontSize: 40,
    color: '#AC1C2B',
    fontFamily: 'Philosopher-Bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',

    width: '90%',
    height: 46,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 15,
    marginLeft: 20,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
