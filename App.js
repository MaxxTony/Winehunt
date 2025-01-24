import './ignoreWarning';
import 'react-native-gesture-handler';
import {LogBox, StyleSheet} from 'react-native';
import React from 'react';
import AppNavigator from './src/routes/AppNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {AlertNotificationRoot} from 'react-native-alert-notification';

const App = () => {
  LogBox.ignoreAllLogs();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AlertNotificationRoot theme="dark">
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AlertNotificationRoot>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({});
