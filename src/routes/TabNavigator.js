import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Colors} from '../constant/Styles';
import Home from '../screens/Home/Home';
import Search from '../screens/Search/Search';
import Cart from '../screens/Cart/Cart';
import WishList from '../screens/WishList/WishList';
import Profile from '../screens/Profile/Profile';
import Order from '../screens/Order/Order';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <Tab.Navigator
        initialRouteName="Dashboard"
        backBehavior="history"
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            ...(Platform.OS === 'android' && {height: 60}),
            elevation: 10,
            paddingHorizontal: 10,
            backgroundColor: Colors.white,
          },
          tabBarHideOnKeyboard: true,
          tabBarLabelPosition: 'below-icon',
        })}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={styles.tabBarIconContainer}>
                <Image
                  source={require('../../assets/images/TabNavigatorImages/Home.png')}
                  style={[
                    styles.tabBarIconImage,
                    {tintColor: focused ? Colors.red : Colors.black},
                  ]}
                />
                <Text
                  style={[
                    styles.tabBarIconText,
                    {color: focused ? Colors.red : Colors.black},
                  ]}>
                  Home
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={styles.tabBarIconContainer}>
                <Image
                  source={require('../../assets/images/TabNavigatorImages/Search.png')}
                  style={[
                    styles.tabBarIconImage,
                    {tintColor: focused ? Colors.red : Colors.black},
                  ]}
                />
                <Text
                  style={[
                    styles.tabBarIconText,
                    {color: focused ? Colors.red : Colors.black},
                  ]}>
                  Search
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Cart"
          component={Cart}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={styles.tabBarIconContainer}>
                <Image
                  source={require('../../assets/images/TabNavigatorImages/Cart.png')}
                  style={[
                    styles.tabBarIconImage,
                    {tintColor: focused ? Colors.red : Colors.black},
                  ]}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.tabBarIconText,
                    {color: focused ? Colors.red : Colors.black},
                  ]}>
                  Cart
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Order"
          component={Order}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={styles.tabBarIconContainer}>
                <Image
                  source={require('../../assets/images/TabNavigatorImages/shop.png')}
                  style={[
                    styles.tabBarIconImage,
                    {tintColor: focused ? Colors.red : Colors.black},
                  ]}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.tabBarIconText,
                    {color: focused ? Colors.red : Colors.black},
                  ]}>
                  Shop
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={styles.tabBarIconContainer}>
                <Image
                  source={require('../../assets/images/TabNavigatorImages/profile.png')}
                  style={[
                    styles.tabBarIconImage,
                    {tintColor: focused ? Colors.red : Colors.black},
                  ]}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.tabBarIconText,
                    {color: focused ? Colors.red : Colors.black},
                  ]}>
                  Profile
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  tabBarIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: Platform.OS == 'ios' ? 20 : 10,
  },
  tabBarIconImage: {
    height: Platform.OS == 'ios' ? 25 : 20,
    width: Platform.OS == 'ios' ? 25 : 20,
    marginBottom: Platform.OS == 'ios' ? 5 : 0,
  },
  tabBarIconText: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
    fontWeight: '500',
  },
});
