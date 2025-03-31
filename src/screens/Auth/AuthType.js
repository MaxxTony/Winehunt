import {
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
  View,
  useWindowDimensions,
  Platform,
  StyleSheet
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
      <Text style={styles.logoText} allowFontScaling={false}>WineHunt</Text>
      <View style={{marginLeft:32,marginBottom:-15}}>
      <Text style={{color:'black',justifyContent:'flex-start',fontSize:14}} allowFontScaling={false}>Continue With Phone</Text>
      </View>
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
            onPress={googleLogin}
            icon={require('../../../assets/images/LoginPage/googles.png')}
            text="Continue with Google"
            backgroundColor="#EA4335"
            textColor="#fff"
            allowFontScaling={false}
          />
          <SocialLoginButton
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