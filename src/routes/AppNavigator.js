import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import FeatureWine from '../screens/Home/screens/FeatureWine';
import Vendors from '../screens/Home/screens/Vendors';
import VendorDetail from '../screens/Home/screens/VendorDetail';
import WineDetail from '../screens/Home/screens/WineDetail';
import WineList from '../screens/Home/screens/WineList';
import Payment from '../screens/Order/Payment';
import Checkout from '../screens/Order/Checkout';
import ThankYou from '../screens/Order/ThankYou';
import TrackOrder from '../screens/Order/TrackOrder';
import ScanWineCode from '../screens/ScanCode/ScanWineCode';
import EditAddress from '../screens/Profile/EditAddress';
import AddAddres from '../screens/Profile/AddAddres';
import Quiz from '../screens/Profile/Quiz';
import Quizquestion from '../screens/Profile/Quizquestion';
import Subscription from '../screens/Profile/Subscription';
import WishList from '../screens/WishList/WishList';
import OrderDetail from '../screens/Order/OrderDetail';
import ReviewList from '../screens/Home/screens/ReviewList';
import Review from '../screens/Home/screens/Review';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [firstScreen, setFirstScreen] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await AsyncStorage.getItem('userDetail');
        const data = JSON.parse(user);
        if (data) {
          setFirstScreen('TabNavigator');
        } else {
          setFirstScreen('Onboarding');
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        setFirstScreen('Onboarding');
      }
    };
    fetchUserDetails();
  }, []);

  if (!firstScreen) {
    return;
  }

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={firstScreen}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="AuthType" component={AuthType} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="ScanCode" component={ScanCode} />
      <Stack.Screen name="ScanWineCode" component={ScanWineCode} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="AddressList" component={AddressList} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="HelpSupport" component={HelpSupport} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsCondition" component={TermsCondition} />
      <Stack.Screen name="MileStone" component={MileStone} />
      <Stack.Screen name="NewArrival" component={NewArrival} />
      <Stack.Screen name="FeatureWine" component={FeatureWine} />
      <Stack.Screen name="Vendors" component={Vendors} />
      <Stack.Screen name="VendorDetail" component={VendorDetail} />
      <Stack.Screen name="WineDetail" component={WineDetail} />
      <Stack.Screen name="WineList" component={WineList} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="ThankYou" component={ThankYou} />
      <Stack.Screen name="TrackOrder" component={TrackOrder} />
      <Stack.Screen name="EditAddress" component={EditAddress} />
      <Stack.Screen name="AddAddres" component={AddAddres} />
      <Stack.Screen name="Quiz" component={Quiz} />
      <Stack.Screen name="Quizquestion" component={Quizquestion} />
      <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen name="Favorite" component={WishList} />
      <Stack.Screen name="OrderDetail" component={OrderDetail} />
      <Stack.Screen name="ReviewList" component={ReviewList} />
      <Stack.Screen name="Review" component={Review} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
