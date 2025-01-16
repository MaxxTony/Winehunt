import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Auth/Login';
import Onboarding from '../screens/Onboarding/Onboarding';
import AuthType from '../screens/Auth/AuthType';
import Otp from '../screens/Auth/Otp';
import Register from '../screens/Auth/Register';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Onboarding">
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="AuthType" component={AuthType} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
