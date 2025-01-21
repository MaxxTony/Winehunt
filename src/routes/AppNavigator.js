import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Auth/Login';
import Onboarding from '../screens/Onboarding/Onboarding';
import AuthType from '../screens/Auth/AuthType';
import Otp from '../screens/Auth/Otp';
import Register from '../screens/Auth/Register';
import Welcome from '../screens/Welcome/Welcome';
import TabNavigator from './TabNavigator';
import ScanCode from '../screens/ScanCode/ScanCode';
import Notifications from '../screens/Notifications/Notifications';
import EditProfile from '../screens/Profile/EditProfile';
import AddressList from '../screens/Profile/AddressList';
import ChangePassword from '../screens/Auth/ChangePassword';
import HelpSupport from '../screens/Profile/HelpSupport';
import PrivacyPolicy from '../screens/Profile/PrivacyPolicy';
import TermsCondition from '../screens/Profile/TermsCondition';
import MileStone from '../screens/Profile/MileStone';
import NewArrival from '../screens/Home/screens/NewArrival';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="TabNavigator">
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="AuthType" component={AuthType} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="ScanCode" component={ScanCode} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="AddressList" component={AddressList} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="HelpSupport" component={HelpSupport} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsCondition" component={TermsCondition} />
      <Stack.Screen name="MileStone" component={MileStone} />
      <Stack.Screen name="NewArrival" component={NewArrival} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
