import React, {useState} from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import CountryPicker from 'react-native-country-picker-modal';
import {Colors, Fonts} from '../../constant/Styles';
import WineHuntButton from '../../common/WineHuntButton';

const Login = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();

  const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
  const [showPhoneCountryPicker, setShowPhoneCountryPicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCountrySelect = country => {
    const newPhoneNumber = `+${country.callingCode[0]}`;
    setPhoneCountryCode(newPhoneNumber);
    setShowPhoneCountryPicker(false);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView style={styles.container}>
        <ImageBackground
          source={require('../../../assets/images/LoginPage/ImgBg.png')}
          style={[styles.imageBackground, {paddingTop: inset.top}]}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Fontisto name="angle-left" size={20} color={Colors.black} />
          </Pressable>
          <View style={styles.content}>
            <Text style={styles.title}>Enter Mobile Number</Text>
            <Text style={styles.subtitle}>
              We have sent a text message with a one-time code to verify your
              phone number. Enter the code below
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View style={styles.inputWrapper}>
                <Pressable
                  style={styles.countryPicker}
                  onPress={() => setShowPhoneCountryPicker(true)}>
                  <Text style={styles.countryCode}>{phoneCountryCode}</Text>
                  <Entypo name="chevron-down" size={15} color={Colors.black} />
                </Pressable>
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Enter Mobile Number"
                  keyboardType="number-pad"
                  maxLength={14}
                  style={styles.textInput}
                />
              </View>
            </View>
          </View>
          <CountryPicker
            countryCode={phoneCountryCode}
            visible={showPhoneCountryPicker}
            onSelect={handleCountrySelect}
            onClose={() => setShowPhoneCountryPicker(false)}
            withFlagButton={false}
            withFilter={true}
            withAlphaFilter
          />
          <View style={styles.footer}>
            <WineHuntButton
              text="Send OTP"
              onPress={() => navigation.navigate('Otp')}
            />
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
  },
  backButton: {
    padding: 20,
    alignSelf: 'flex-start',
  },
  content: {
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: 30,
    gap: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
    fontWeight: '400',
  },
  inputWrapper: {
    padding: 5,
    borderWidth: 1,
    borderColor: Colors.gray2,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    padding: 10,
    borderColor: Colors.gray2,
  },
  countryCode: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
    fontWeight: '400',
    marginRight: 5,
  },
  textInput: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  footer: {
    padding: 20,
    marginTop: 'auto',
    marginBottom: 20,
  },
});
