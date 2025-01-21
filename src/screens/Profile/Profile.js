import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors, Fonts} from '../../constant/Styles';
import Entypo from 'react-native-vector-icons/Entypo';
import LogoutModal from '../../Modal/LogoutModal';

const Profile = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const data = [
    {
      id: 1,
      name: 'Edit Profile',
      image: require('./images/userIcon.png'),
      screen: 'EditProfile',
    },
    {
      id: 2,
      name: 'Favorite',
      image: require('./images/heart.png'),
      screen: 'Favorite',
    },
    {
      id: 3,
      name: 'My Address List',
      image: require('./images/file.png'),
      screen: 'AddressList',
    },
    {
      id: 4,
      name: 'Change Password',
      image: require('./images/password.png'),
      screen: 'ChangePassword',
    },
    {
      id: 5,
      name: 'Notification',
      image: require('./images/notification.png'),
      screen: 'Notifications',
    },
    {
      id: 6,
      name: 'Help & Support',
      image: require('./images/help.png'),
      screen: 'HelpSupport',
    },
    {
      id: 7,
      name: 'Privacy Policy',
      image: require('./images/privacy.png'),
      screen: 'PrivacyPolicy',
    },
    {
      id: 8,
      name: 'Terms & Conditions',
      image: require('./images/Terms.png'),
      screen: 'TermsCondition',
    },
    {
      id: 9,
      name: 'Logout',
      image: require('./images/Logout.png'),
      screen: null,
    },
  ];

  return (
    <ImageBackground
      source={require('../../../assets/images/LoginPage/ImgBg.png')}
      style={[styles.imageBackground, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Profile"
        onPress={() => navigation.goBack()}
        extraStyle={styles.backNavigationExtraStyle}
      />
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image
            source={require('./images/profile.png')}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>William Anderson</Text>
        </View>
        <Pressable
          style={styles.milestoneContainer}
          onPress={() => navigation.navigate('MileStone')}>
          <Image
            source={require('./images/barcode.png')}
            style={styles.barcodeImage}
          />
          <View style={styles.milestoneTextContainer}>
            <Text style={styles.milestoneTitle}>
              Receive Your Milestone score
            </Text>
            <Text style={styles.milestoneUserId}>User Id: WA@1234</Text>
          </View>
          <Entypo name="chevron-thin-right" size={20} color={Colors.black} />
        </Pressable>
        <View style={styles.optionsContainer}>
          <FlatList
            data={data}
            scrollEnabled={false}
            contentContainerStyle={styles.flatListContainer}
            renderItem={({item, index}) => {
              return (
                <Pressable
                  style={styles.optionItem}
                  onPress={() => {
                    if (item?.screen !== null) {
                      navigation.navigate(item.screen);
                    } else {
                      setShowLogoutModal(true);
                    }
                  }}>
                  <Image
                    source={item?.image}
                    style={styles.optionImage}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          index == data.length - 1 ? Colors.red : Colors.black,
                      },
                    ]}>
                    {item?.name}
                  </Text>
                  {index !== data.length - 1 && (
                    <Entypo
                      name="chevron-thin-right"
                      size={20}
                      color={Colors.black}
                    />
                  )}
                </Pressable>
              );
            }}
          />
        </View>
      </ScrollView>
      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onLogout={() => {
            setShowLogoutModal(false);
            navigation.navigate('Onboarding');
          }}
        />
      )}
    </ImageBackground>
  );
};

export default Profile;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  backNavigationExtraStyle: {
    borderBottomWidth: 0,
  },
  scrollViewContainer: {
    paddingBottom: 80,
    padding: 20,
    gap: 20,
  },
  profileHeader: {
    alignItems: 'center',
    gap: 20,
  },
  profileImage: {
    height: 90,
    width: 90,
  },
  profileName: {
    fontSize: 18,
    color: Colors.red,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
  },
  milestoneContainer: {
    padding: 10,
    backgroundColor: Colors.lightPink,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  barcodeImage: {
    height: 40,
    width: 40,
  },
  milestoneTextContainer: {
    gap: 5,
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
  },
  milestoneUserId: {
    fontSize: 12,
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontWeight: '600',
  },
  optionsContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
    elevation: 5,
    padding: 10,
    borderRadius: 10,
  },
  flatListContainer: {
    gap: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 10,
  },
  optionImage: {
    height: 25,
    width: 25,
    marginLeft: 5,
  },
  optionText: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '600',
    flex: 1,
  },
});
