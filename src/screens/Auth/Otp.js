import React, {useState} from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {Colors, Fonts} from '../../constant/Styles';
import WineHuntButton from '../../common/WineHuntButton';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 4;

const Otp = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

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
            <Text style={styles.title}>Verify Your Phone</Text>
            <Text style={styles.subtitle}>
              We have sent a text message with a one time code to verify your
              phone number. Enter the code below
            </Text>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => (
                <View
                  onLayout={getCellOnLayoutHandler(index)}
                  key={index}
                  style={[styles.cellRoot, isFocused && styles.focusCell]}>
                  <Text style={styles.cellText}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />
            <Text style={styles.otptimer}>0:10</Text>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Didn't receive the OTP?{' '}
              <Text style={{color: Colors.red}}>Resend OTP</Text>
            </Text>
            <WineHuntButton
              text="Send OTP"
              onPress={() => navigation.navigate('Register')}
            />
            <WineHuntButton
              text="Use a different number"
              onPress={() => navigation.goBack()}
              extraButtonStyle={{
                backgroundColor: Colors.white,
                borderWidth: 1,
                borderColor: Colors.gray2,
              }}
              extraTextStyle={{color: Colors.black}}
            />
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Otp;

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

  footer: {
    padding: 20,
    marginTop: 'auto',
    marginBottom: 20,
    gap: 20,
  },
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: Colors.gray3,
    borderBottomWidth: 1,
  },
  cellText: {
    color: Colors.black,
    fontSize: 36,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: Colors.red2,
    borderBottomWidth: 2,
  },
  otptimer: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: Colors.gray,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    textAlign: 'center',
  },
});
