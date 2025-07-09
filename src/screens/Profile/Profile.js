import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors, Fonts} from '../../constant/Styles';
import Entypo from 'react-native-vector-icons/Entypo';
import LogoutModal from '../../Modal/LogoutModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import axios from 'axios';
import {showWarning} from '../../helper/Toastify';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProfile} from '../../redux/slices/profileSlice';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Profile = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const isFoused = useIsFocused();

  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.profile);
 

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
      id: 9,
      name: 'Privacy Policy',
      image: require('./images/privacy.png'),
      screen: 'PrivacyPolicy',
    },
    {
      id: 10,
      name: 'Terms & Conditions',
      image: require('./images/Terms.png'),
      screen: 'TermsCondition',
    },
    {
      id: 11,
      name: 'Logout',
      image: require('./images/Logout.png'),
      screen: null,
    },
  ];

  useEffect(() => {
    dispatch(fetchProfile());
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [isFoused]);

  return (
    <LinearGradient
      colors={['#fff0f5', '#ffe4e1', '#fff']}
      style={[styles.gradientBackground, {paddingTop: inset.top}]}
    >
      <BackNavigationWithTitle
        title="Profile"
        onPress={() => navigation.goBack()}
        extraStyle={styles.backNavigationExtraStyle}
      />
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.profileHeaderPro, {opacity: fadeAnim}]}> 
          <View style={styles.profileImageWrapper}>
            <Image
              source={
                userData && userData?.image !== null
                  ? {uri: userData?.image}
                  : require('./images/profile.png')
              }
              style={styles.profileImagePro}
            />
            <Pressable
              style={styles.editIconOverlay}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <MaterialIcons name="edit" size={22} color="#fff" />
            </Pressable>
          </View>
          <Text style={styles.profileNamePro} allowFontScaling={false}>
            {userData?.first_name || '-'} {userData?.last_name || ''}
          </Text>
          <Text style={styles.profileRolePro} allowFontScaling={false}>
            {userData?.role_id === 2 ? 'Customer' : userData?.role_id === 1 ? 'Admin' : 'User'}
          </Text>
        </Animated.View>
        <View style={styles.infoCardPro}>
          <Text style={styles.profileEmailPro} allowFontScaling={false}>
            {userData?.email || '-'}
          </Text>
          <Text style={styles.profilePhonePro} allowFontScaling={false}>
            {userData?.country_code ? userData.country_code + ' ' : ''}{userData?.phone || '-'}
          </Text>
          <Text style={styles.profileAddressPro} numberOfLines={2} allowFontScaling={false}>
            {userData?.address || '-'}
          </Text>
        </View>
        <View style={styles.statsRowPro}>
          <View style={styles.statBoxProPop}>
            <Text style={styles.statLabelProPop}>Points</Text>
            <Text style={styles.statValueProPop}>{userData?.points ?? 0}</Text>
          </View>
          <View style={styles.statBoxProPop}>
            <Text style={styles.statLabelProPop}>User ID</Text>
            <Text style={styles.statValueProPop}>{userData?.id ? `WA@${userData.id}` : '-'}</Text>
          </View>
        </View>
        <Animated.View style={{opacity: fadeAnim}}>
          <View style={styles.optionsContainerPro}>
            <FlatList
              data={data}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContainer}
              renderItem={({item, index}) => {
                return (
                  <Pressable
                    style={styles.optionItemPro}
                    onPress={() => {
                      if (item?.screen !== null) {
                        navigation.navigate(item.screen);
                      } else {
                        setShowLogoutModal(true);
                      }
                    }}
                  >
                    <View style={styles.optionIconCircle}>
                      <Image
                        source={item?.image}
                        style={styles.optionImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            index == data.length - 1 ? Colors.red : Colors.black,
                        },
                      ]}
                      allowFontScaling={false}
                    >
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
        </Animated.View>
      </ScrollView>
      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onLogout={async () => {
            setShowLogoutModal(false);
            await AsyncStorage.removeItem('userDetail');
            navigation.navigate('Onboarding');
          }}
        />
      )}
    </LinearGradient>
  );
};

export default Profile;

const styles = StyleSheet.create({
  gradientBackground: {
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
    borderRadius: 100,
  },
  profileName: {
    fontSize: 18,
    color: Colors.red,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
  },
  profilePhone: {
    fontSize: 14,
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
  },
  profileAddress: {
    fontSize: 13,
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  profileStatsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginTop: 10,
  },
  profileStatBox: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  profileStatLabel: {
    fontSize: 12,
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
  },
  profileStatValue: {
    fontSize: 15,
    color: Colors.black,
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
    marginVertical: 10,
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
  qrCodeImage: {
    height: 60,
    width: 60,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.gray7,
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
  // --- Pro Redesign ---
  profileHeaderPro: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  profileImagePro: {
    height: 90,
    width: 90,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.red,
    marginBottom: 8,
  },
  profileNamePro: {
    fontSize: 20,
    color: Colors.red,
    fontFamily: Fonts.InterMedium,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileRolePro: {
    fontSize: 14,
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoCardPro: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 2,
  },
  profileEmailPro: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    marginBottom: 2,
  },
  profilePhonePro: {
    fontSize: 14,
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    marginBottom: 2,
  },
  profileAddressPro: {
    fontSize: 13,
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  statsRowPro: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    marginBottom: 10,
  },
  statBoxPro: {
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabelPro: {
    fontSize: 12,
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
  },
  statValuePro: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
  },
  optionsContainerPro: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 0,
    marginTop: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 4,
  },
  optionItemPro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  profileImageWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIconOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: Colors.red,
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  statBoxProPop: {
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: '#fff0f5',
    borderRadius: 16,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    marginHorizontal: 6,
  },
  statLabelProPop: {
    fontSize: 13,
    color: Colors.red,
    fontFamily: Fonts.InterMedium,
    fontWeight: '700',
    marginBottom: 2,
  },
  statValueProPop: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
    fontWeight: '800',
  },
  optionIconCircle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: '#fff0f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 2,
  },
});
