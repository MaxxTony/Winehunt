import {
  Image,
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
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors, Fonts} from '../../constant/Styles';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import CountryPicker from 'react-native-country-picker-modal';
import WineHuntButton from '../../common/WineHuntButton';
import * as ImagePicker from 'react-native-image-picker';
import ImageUploadModal from '../../Modal/ImageUploadModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import axios from 'axios';
import {showSucess, showWarning} from '../../helper/Toastify';
import Loader from '../../helper/Loader';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProfile} from '../../redux/slices/profileSlice';

const EditProfile = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.profile);

  const [firstName, setFirstName] = useState(
    userData ? userData?.first_name : '',
  );
  const [lastName, setLastName] = useState(userData ? userData?.last_name : '');
  const [email, setEmail] = useState(userData ? userData?.email : '');

  const [phoneCountryCode, setPhoneCountryCode] = useState(
    userData ? userData?.country_code : '+91',
  );
  const [showPhoneCountryPicker, setShowPhoneCountryPicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(
    userData ? userData?.phone : '',
  );

  const [isImageModal, setIsImageModal] = useState(false);

  const [filePath, setFilePath] = useState(null);
  const [fileUri, setFileUri] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, []);

  const handleCountrySelect = country => {
    const newPhoneNumber = `+${country.callingCode[0]}`;
    setPhoneCountryCode(newPhoneNumber);
    setShowPhoneCountryPicker(false);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

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
        console.log(options, response);
        if (!response.errorCode && !response.didCancel) {
          setFilePath(response.assets[0]);
          setFileUri(response.assets[0]?.uri);
          setIsImageModal(false);
        } else if (response.errorCode) {
          console.log('Error:', response.errorMessage);
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
    if (!firstName) {
      showWarning('First Name can not be empty');
    }
    if (!lastName) {
      showWarning('Last Name can not be empty');
    }
    if (!email) {
      showWarning('Email can not be empty');
    }
    if (!phoneNumber) {
      showWarning('Phone Number can not be empty');
    }
    const data = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(data)?.token;

    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('phone', phoneNumber);
    formData.append('country_code', phoneCountryCode);
    if (filePath) {
      formData.append('image', {
        uri: filePath.uri,
        type: filePath.type,
        name: 'index.jpg',
      });
    }

    setLoading(true);
    const url = Constants.baseUrl3 + Constants.editProfile;
    try {
      const res = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res?.status == 200) {
        showSucess(res?.data?.message);
        navigation.goBack();
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
        <View style={[styles.container, {paddingTop: inset.top}]}>
          <Loader modalVisible={loading} setModalVisible={setLoading} />

          <BackNavigationWithTitle
            title="Edit Profile"
            onPress={() => navigation.goBack()}
          />
          <View style={styles.profileImageContainer}>
            <Image
              source={
                fileUri ? {uri: fileUri} : require('./images/profile.png')
              }
              style={styles.profileImage}
            />
            <Pressable
              style={styles.editIconContainer}
              onPress={() => setIsImageModal(true)}>
              <Image
                source={require('./images/editIcon.png')}
                style={styles.editIcon}
              />
            </Pressable>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <FontAwesome6 name="user-large" size={16} color={Colors.red} />
              <TextInput
                value={firstName}
                onChangeText={e => setFirstName(e)}
                style={styles.textInput}
                placeholder="User First Name"
                placeholderTextColor={Colors.gray4}
              />
            </View>
            <View style={styles.inputContainer}>
              <FontAwesome6 name="user-large" size={16} color={Colors.red} />
              <TextInput
                value={lastName}
                onChangeText={e => setLastName(e)}
                style={styles.textInput}
                placeholder="User Last Name"
                placeholderTextColor={Colors.gray4}
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="email"
                size={18}
                color={Colors.red}
              />
              <TextInput
                value={email}
                onChangeText={e => setEmail(e)}
                style={styles.textInput}
                placeholder="User Email"
                placeholderTextColor={Colors.gray4}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.phoneInputContainer}>
              <Pressable
                style={styles.phoneCountryCodeContainer}
                onPress={() => setShowPhoneCountryPicker(true)}>
                <Text style={styles.phoneCountryCodeText}>
                  {phoneCountryCode}
                </Text>
                <Entypo name="chevron-down" size={15} color={Colors.red} />
              </Pressable>
              <TextInput
                value={phoneNumber}
                onChangeText={e => setPhoneNumber(e)}
                placeholder="Enter Mobile Number"
                placeholderTextColor={Colors.gray4}
                keyboardType="number-pad"
                maxLength={14}
                style={styles.phoneInput}
              />
            </View>

            <View style={styles.updateButtonContainer}>
              <WineHuntButton text="Update" onPress={() => onSubmit()} />
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
        </View>

        <ImageUploadModal
          isImageModal={isImageModal}
          setIsImageModal={setIsImageModal}
          onCameraPress={launchCamera}
          onGalleryPress={launchImageLibrary}
          heading="Upload a Photo"
          desc="Would you like to take a new photo or choose one from your gallery"
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  profileImageContainer: {
    margin: 20,
    alignSelf: 'center',
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 100,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  editIcon: {
    height: 28,
    width: 28,
  },
  formContainer: {
    padding: 20,
    gap: 10,
    flex: 1,
  },
  inputContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray2,
    borderRadius: 10,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 5 : 0,
  },
  phoneInputContainer: {
    padding: 5,
    borderWidth: 1,
    borderColor: Colors.gray2,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },
  phoneCountryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    padding: 10,
    borderColor: Colors.gray2,
  },
  phoneCountryCodeText: {
    fontSize: 14,
    color: Colors.red,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  updateButtonContainer: {
    marginTop: 'auto',
    marginBottom: 30,
  },
});
