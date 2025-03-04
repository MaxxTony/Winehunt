import './ignoreWarning';
import 'react-native-gesture-handler';
import {LogBox, StyleSheet} from 'react-native';
import React from 'react';
import AppNavigator from './src/routes/AppNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {AlertNotificationRoot} from 'react-native-alert-notification';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import {StripeProvider} from '@stripe/stripe-react-native';
import Key from './src/utils/Key';

const App = () => {
  LogBox.ignoreAllLogs();
  //console.log('keeeeyyyyyyy', Key.stripeKey);
  return (
    <StripeProvider
      publishableKey={Key.stripeKey}
      merchantIdentifier="merchant.com.winehunt"
      urlScheme="your-url-scheme">
      <GestureHandlerRootView style={{flex: 1}}>
        <AlertNotificationRoot theme="dark">
          <Provider store={store}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </Provider>
        </AlertNotificationRoot>
      </GestureHandlerRootView>
    </StripeProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
