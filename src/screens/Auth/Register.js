import {
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Colors, Fonts} from '../../constant/Styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import WineHuntLabelInput from '../../common/WineHuntLabelInput';
import WineHuntButton from '../../common/WineHuntButton';
import * as ImagePicker from 'react-native-image-picker';
import ImageUploadModal from '../../Modal/ImageUploadModal';
import {showSucess, showWarning} from '../../helper/Toastify';
import Constants from '../../helper/Constant';
import axios from 'axios';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Loader from '../../helper/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geocoding from 'react-native-geocoding';
import Key from '../../utils/Key';

const Register = ({route}) => {
  const Info = route.params?.data;
  const isFocused = useIsFocused();

  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checked, setChecked] = useState(false);

  const [isImageModal, setIsImageModal] = useState(false);

  const [filePath, setFilePath] = useState(null);
  const [fileUri, setFileUri] = useState('');

  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [currentAddress, setCurrentAddress] = useState('');

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    Geocoding.init(Key.apiKey);
    const getLocation = async () => {
      try {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setCoordinates({latitude: latitude, longitude: longitude});
            Geocoding.from({latitude, longitude})
              .then(json => {
                const res = json.results;
                const filteredAddress = res
                  .filter(
                    component =>
                      component.types.includes('political') &&
                      component.types.includes('sublocality') &&
                      component.types.includes('sublocality_level_2'),
                  )
                  .map(comp => setCurrentAddress(comp?.formatted_address));
                return filteredAddress;
              })
              .catch(error => console.log(error));
          },
          error => {
            console.error('Error getting location:', error);
          },
          {
            enableHighAccuracy: Platform.OS === 'ios' ? true : false,
            timeout: 10000,
          },
        );
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };
    getLocation();
  }, [isFocused]);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const launchCamera = async () => {
    const hasCameraPermission = await requestCameraPermission();

    if (hasCameraPermission) {
      const options = {
        mediaType: 'photo',
        quality: 0.7,
        maxWidth: 500,
        maxHeight: 500,
        allowsEditing: true,
      };

      ImagePicker.launchCamera(options, response => {
        if (!response.errorCode && !response.didCancel) {
          setFilePath(response.assets[0]);
          setFileUri(response.assets[0]?.uri);
          setIsImageModal(false);
        } else if (response.errorCode) {
          console.log('Error:', response);
        }
      });
    } else {
      console.log('Camera permission denied');
    }
  };

  const launchImageLibrary = () => {
    const options = {
      mediaType: 'photo',
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (!response.errorCode && !response.didCancel) {
        setFilePath(response.assets[0]);
        setFileUri(response.assets[0]?.uri);
        setIsImageModal(false);
      }
    });
  };

  const onSubmit = async () => {
    const trimmedFirstName = firstName?.trim();
    const trimmedLastName = lastName?.trim();
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();
    const trimmedConfirmPassword = confirmPassword?.trim();

    if (!trimmedFirstName) {
      showWarning('First Name is required.');
      return;
    }
    if (!trimmedLastName) {
      showWarning('Last Name is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      showWarning('Email is required.');
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      showWarning('Please enter a valid email address.');
      return;
    }
    if (!trimmedPassword) {
      showWarning('Password is required.');
      return;
    }
    if (trimmedPassword.length < 8) {
      showWarning('Password must be at least 8 characters long.');
      return;
    }
    if (!trimmedConfirmPassword) {
      showWarning('Please confirm your password.');
      return;
    }
    if (trimmedPassword !== trimmedConfirmPassword) {
      showWarning('Passwords do not match.');
      return;
    }
    if (!checked) {
      showWarning('You must agree to the terms and conditions.');
      return;
    }

    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phone', Info?.user?.phone);
    formData.append('country_code', Info?.user?.country_code);
    formData.append('latitude', coordinates?.latitude.toString());
    formData.append('longitude', coordinates?.longitude.toString());
    formData.append('address', currentAddress);
    if (filePath) {
      formData.append('image', {
        uri: filePath.uri,
        type: filePath.type,
        name: 'index.jpg',
      });
    }

    setLoading(true);
    const url = Constants.baseUrl + Constants.register;
    try {
      const res = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res?.status == 200) {
        await AsyncStorage.setItem('userDetail', JSON.stringify(res?.data));
        showSucess(res?.data?.message);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView style={styles.container}>
        <ImageBackground
          source={require('../../../assets/images/LoginPage/ImgBg.png')}
          style={[styles.imageBackground, {paddingTop: inset.top}]}>
          <Loader modalVisible={loading} setModalVisible={setLoading} />

          <Pressable
            style={{
              padding: 20,
              alignSelf: 'flex-start',
            }}
            onPress={() => navigation.goBack()}>
            <Fontisto name="angle-left" size={20} color={Colors.black} />
          </Pressable>
          <Pressable onPress={() => setIsImageModal(true)}>
            <Image
              source={
                filePath && fileUri
                  ? {uri: fileUri}
                  : require('../../../assets/images/LoginPage/defaultProfile.png')
              }
              style={{
                height: 128,
                width: 128,
                alignSelf: 'center',
                borderRadius: 100,
              }}
            />
          </Pressable>
          <View style={{padding: 20, flex: 1, gap: 20}}>
            <WineHuntLabelInput
              value={firstName}
              onChangeText={e => setFirstName(e)}
              placeholder="Enter Your First Name"
              label="First Name"
            />
            <WineHuntLabelInput
              value={lastName}
              onChangeText={e => setLastName(e)}
              placeholder="Enter Your Last Name"
              label="Last Name"
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
              <WineHuntButton text="Continue" onPress={() => onSubmit()} />
            </View>
          </View>
          <ImageUploadModal
            isImageModal={isImageModal}
            setIsImageModal={setIsImageModal}
            onCameraPress={launchCamera}
            onGalleryPress={launchImageLibrary}
            heading="Upload a Photo"
            desc="Would you like to take a new photo or choose one from your gallery"
          />
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
    // padding: 20,
    gap: 20,
  },
});
