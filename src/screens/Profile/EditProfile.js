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
import React, {useState} from 'react';
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

const EditProfile = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
  const [showPhoneCountryPicker, setShowPhoneCountryPicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const [isImageModal, setIsImageModal] = useState(false);

  const [filePath, setFilePath] = useState(null);
  const [fileUri, setFileUri] = useState('');

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

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={[styles.container, {paddingTop: inset.top}]}>
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
                value={name}
                onChangeText={e => setName(e)}
                style={styles.textInput}
                placeholder="User Name"
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
              <WineHuntButton
                text="Update"
                onPress={() => navigation.goBack()}
              />
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
