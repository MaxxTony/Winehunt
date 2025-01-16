import {
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {Colors, Fonts} from '../../constant/Styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import WineHuntLabelInput from '../../common/WineHuntLabelInput';
import WineHuntButton from '../../common/WineHuntButton';

const Register = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checked, setChecked] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView style={styles.container}>
        <ImageBackground
          source={require('../../../assets/images/LoginPage/ImgBg.png')}
          style={[styles.imageBackground, {paddingTop: inset.top + 50}]}>
          <Pressable>
            <Image
              source={require('../../../assets/images/LoginPage/defaultProfile.png')}
              style={{
                height: 128,
                width: 128,
                alignSelf: 'center',
              }}
            />
          </Pressable>
          <WineHuntLabelInput
            value={name}
            onChangeText={e => setName(e)}
            placeholder="Enter Your Name"
            label="Full Name"
          />
          <WineHuntLabelInput
            value={email}
            onChangeText={e => setEmail(e)}
            placeholder="Enter Your Email"
            label="Email"
            keyboardType="email-address"
          />
          <WineHuntLabelInput
            value={password}
            onChangeText={e => setPassword(e)}
            placeholder="Enter Your Password"
            label="Password"
            isPassword={true}
          />
          <WineHuntLabelInput
            value={confirmPassword}
            onChangeText={e => setConfirmPassword(e)}
            placeholder="Confirm Password"
            label="Confirm Password"
            isPassword={true}
          />
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <MaterialCommunityIcons
              name={checked ? 'checkbox-outline' : 'checkbox-blank-outline'}
              size={20}
              color={Colors.black}
              onPress={() => setChecked(!checked)}
            />
            <Text
              style={{
                fontSize: 14,
                color: Colors.black,
                fontFamily: Fonts.InterRegular,
                fontWeight: '500',
              }}>
              I agree to the Terms & Conditions
            </Text>
          </View>
          <View style={{marginTop: 'auto'}}>
            <WineHuntButton
              text="Continue"
              onPress={() => navigation.navigate('Welcome')}
            />
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
});
