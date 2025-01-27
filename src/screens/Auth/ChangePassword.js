import {Platform, StyleSheet, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors} from '../../constant/Styles';
import Feather from 'react-native-vector-icons/Feather';
import WineHuntButton from '../../common/WineHuntButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import axios from 'axios';
import {showSucess, showWarning} from '../../helper/Toastify';

const ChangePassword = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async () => {
    if (!oldPassword) {
      showWarning('Please enter old password');
      return;
    }
    if (!newPassword) {
      showWarning('Please enter new password');
      return;
    }
    if (newPassword.length < 6) {
      showWarning('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showWarning('Password does not match');
      return;
    }
    try {
      const data = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(data)?.token;
      const url = Constants.baseUrl3 + Constants.changePassword;

      const Info = {
        oldPassword: oldPassword,
        newPassword: newPassword,
      };

      const response = await axios.post(url, Info, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        showSucess('Password changed successfully');
        navigation.goBack();
      }
    } catch (error) {
      if (error.response) {
        showWarning(error.response.data.message);
        console.log('Server error: ' + error.response.data);
      }
    }
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <BackNavigationWithTitle
        title="Change Password"
        onPress={() => navigation.goBack()}
      />
      <View style={styles.formContainer}>
        {/** Old Password */}
        <View style={styles.inputContainer}>
          <Feather name="lock" size={18} color={Colors.red} />
          <TextInput
            value={oldPassword}
            onChangeText={setOldPassword}
            style={styles.textInput}
            placeholder="Enter Old Password"
            placeholderTextColor={Colors.gray4}
            secureTextEntry={!showOldPassword}
          />
          <Feather
            name={showOldPassword ? 'eye' : 'eye-off'}
            size={18}
            color={Colors.gray4}
            onPress={() => setShowOldPassword(!showOldPassword)}
          />
        </View>

        {/** New Password */}
        <View style={styles.inputContainer}>
          <Feather name="lock" size={18} color={Colors.red} />
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.textInput}
            placeholder="Enter New Password"
            placeholderTextColor={Colors.gray4}
            secureTextEntry={!showNewPassword}
          />
          <Feather
            name={showNewPassword ? 'eye' : 'eye-off'}
            size={18}
            color={Colors.gray4}
            onPress={() => setShowNewPassword(!showNewPassword)}
          />
        </View>

        {/** Confirm New Password */}
        <View style={styles.inputContainer}>
          <Feather name="lock" size={18} color={Colors.red} />
          <TextInput
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            style={styles.textInput}
            placeholder="Enter Confirm Password"
            placeholderTextColor={Colors.gray4}
            secureTextEntry={!showConfirmPassword}
          />
          <Feather
            name={showConfirmPassword ? 'eye' : 'eye-off'}
            size={18}
            color={Colors.gray4}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </View>

        {/** Update Button */}
        <View style={styles.buttonContainer}>
          <WineHuntButton text="Update" onPress={() => onSubmit()} />
        </View>
      </View>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 5 : 0,
    color: Colors.black,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: 30,
  },
});
