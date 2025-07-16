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
  Svg,
  Path,
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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
      colors={["#790e32ff", "#ed8377ff", "#fff"]}
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
        {/* Profile Header */}
        <Animated.View style={[styles.profileHeaderContainer, {opacity: fadeAnim, zIndex: 1}]}> 
          <View style={styles.profileImageContainer}>
            <Image
              source={userData && userData?.image !== null ? {uri: userData?.image} : require('./images/profile.png')}
              style={styles.profileImage}
            />
            
          </View>
          <Text style={styles.profileNameWine} allowFontScaling={false}>
            {userData?.first_name || '-'} {userData?.last_name || ''}
          </Text>
          <View style={styles.roleBadgeWine}>
            <Text style={styles.roleBadgeTextWine} allowFontScaling={false}>
              {userData?.role_id === 2 ? 'Customer' : userData?.role_id === 1 ? 'Admin' : 'User'}
            </Text>
          </View>
        </Animated.View>

        {/* QR Code - Prominent Placement */}
        <View style={styles.qrCodeContainerProminent}>
          {userData?.qr_code ? (
            <Image source={{ uri: userData.qr_code }} style={styles.qrImageProminent} />
          ) : (
            <FontAwesome5 name="glass-cheers" size={60} color="#790e32" />
          )}
          <Text style={styles.qrLabelProminent}>Scan Me</Text>
          <Text style={styles.qrHintProminent}>Show this code to vendors to earn points!</Text>
        </View>

        {/* Stats Row - Modern Card Style */}
        <View style={styles.statsRowProModern}>
          <View style={styles.statCardWine}>
            <FontAwesome5 name="wine-bottle" size={22} color="#790e32" style={{marginBottom: 4}} />
            <Text style={styles.statLabelWine}>Milestone Points</Text>
            <Text style={styles.statValueWine}>{userData?.points ?? 0}</Text>
          </View>
          <View style={styles.statCardWine}>
            <FontAwesome5 name="user-alt" size={22} color="#790e32" style={{marginBottom: 4}} />
            <Text style={styles.statLabelWine}>User ID</Text>
            <Text style={styles.statValueWine}>{userData?.id ? `WA@${userData.id}` : '-'}</Text>
          </View>
        </View>

        {/* Contact Info Card */}
        <View style={styles.infoCardProModernWine}>
          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={18} color="#790e32" style={styles.infoIcon} />
            <Text style={styles.infoTextWine} allowFontScaling={false}>{userData?.email || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome5 name="phone-alt" size={16} color="#790e32" style={styles.infoIcon} />
            <Text style={styles.infoTextWine} allowFontScaling={false}>{userData?.country_code ? userData.country_code + ' ' : ''}{userData?.phone || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Entypo name="location-pin" size={20} color="#790e32" style={styles.infoIcon} />
            <Text style={styles.infoTextWine} numberOfLines={2} allowFontScaling={false}>{userData?.address || '-'}</Text>
          </View>
        </View>

        {/* Options List */}
        <Animated.View style={{opacity: fadeAnim}}>
          <View style={styles.optionsContainerProModernWine}>
            <FlatList
              data={data}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContainer}
              renderItem={({item, index}) => {
                const isLogout = item?.name === 'Logout';
                return (
                  <Pressable
                    style={[styles.optionItemProModernWine, isLogout && styles.logoutItemWine]}
                    onPress={() => {
                      if (item?.screen !== null) {
                        navigation.navigate(item.screen);
                      } else {
                        setShowLogoutModal(true);
                      }
                    }}
                  >
                    <View style={[styles.optionIconCircleModernWine, isLogout && styles.logoutIconCircleWine]}>
                      <Image
                        source={item?.image}
                        style={styles.optionImage}
                        resizeMode="contain"
                      />
                    </View>
                    <Text
                      style={[
                        styles.optionTextModernWine,
                        isLogout && styles.logoutTextWine,
                      ]}
                      allowFontScaling={false}
                    >
                      {item?.name}
                    </Text>
                    {!isLogout && (
                      <Entypo
                        name="chevron-thin-right"
                        size={20}
                        color="#790e32"
                      />
                    )}
                  </Pressable>
                );
              }}
            />
          </View>
        </Animated.View>
      </ScrollView>
      <LogoutModal
        isVisible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onLogout={async () => {
          setShowLogoutModal(false);
          await AsyncStorage.removeItem('userDetail');
          navigation.navigate('Onboarding');
        }}
      />
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
    height: 20,
    width: 20,
    // marginLeft: 5,
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
  // Modern Redesign Styles
  profileHeaderContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: Colors.red,
    backgroundColor: '#fff',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.red,
    borderRadius: 16,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 4,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.red,
    marginBottom: 4,
  },
  roleBadge: {
    backgroundColor: '#ffe4e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 4,
  },
  roleBadgeText: {
    color: Colors.red,
    fontWeight: '600',
    fontSize: 14,
  },
  milestoneContainerPro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    marginHorizontal: 2,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 4,
  },
  milestoneTitlePro: {
    fontSize: 15,
    color: Colors.red,
    fontFamily: Fonts.InterMedium,
    fontWeight: '700',
    marginBottom: 2,
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#ffe4e1',
    borderRadius: 8,
    marginVertical: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: Colors.red,
    borderRadius: 8,
  },
  milestoneValuePro: {
    fontSize: 13,
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
  },
  statsRowProModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    color: Colors.gray7,
    fontSize: 13,
    marginBottom: 2,
  },
  statValue: {
    color: Colors.red,
    fontWeight: 'bold',
    fontSize: 20,
  },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  qrImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginBottom: 4,
  },
  qrLabel: {
    fontSize: 10,
    color: Colors.gray7,
  },
  infoCardProModern: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 2,
    marginBottom: 16,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    flex: 1,
  },
  optionsContainerProModern: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 0,
    marginTop: 10,
    padding: 8,
    shadowColor: '#e75480',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 4,
  },
  optionItemProModern: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    borderRadius: 12,
  },
  optionIconCircleModern: {
    height: 40,
    width: 40,
    borderRadius: 20,
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
  optionTextModern: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '600',
    flex: 1,
  },
  logoutItem: {
    backgroundColor: '#fff0f0',
    borderBottomWidth: 0,
    marginTop: 8,
    borderRadius: 16,
  },
  logoutIconCircle: {
    backgroundColor: '#ffe4e1',
  },
  logoutText: {
    color: Colors.red,
  },
  profileNameWine: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#790e32',
    marginBottom: 4,
    fontFamily: Fonts.InterBold,
  },
  roleBadgeWine: {
    backgroundColor: '#ed8377',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginTop: 4,
    alignSelf: 'center',
  },
  roleBadgeTextWine: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    fontFamily: Fonts.InterMedium,
  },
  statCardWine: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#790e32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  statLabelWine: {
    color: '#ed8377',
    fontSize: 14,
    marginBottom: 2,
    fontFamily: Fonts.InterMedium,
  },
  statValueWine: {
    color: '#790e32',
    fontWeight: 'bold',
    fontSize: 22,
    fontFamily: Fonts.InterBold,
  },
  qrCardWine: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#ed8377',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  qrLabelWine: {
    fontSize: 11,
    color: '#ed8377',
    fontFamily: Fonts.InterMedium,
  },
  infoCardProModernWine: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 2,
    marginBottom: 18,
    shadowColor: '#790e32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  infoTextWine: {
    fontSize: 16,
    color: '#790e32',
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
    flex: 1,
  },
  optionsContainerProModernWine: {
    backgroundColor: '#fff',
    borderRadius: 22,
    marginHorizontal: 0,
    marginTop: 12,
    padding: 10,
    shadowColor: '#ed8377',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 4,
  },
  optionItemProModernWine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8e6ec',
    borderRadius: 14,
  },
  optionIconCircleModernWine: {
    height: 35,
    width: 35,
    borderRadius: 22,
    backgroundColor: '#ed8377',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#790e32',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 2,
  },
  optionTextModernWine: {
    fontSize: 17,
    color: '#790e32',
    fontFamily: Fonts.InterMedium,
    fontWeight: '700',
    flex: 1,
  },
  logoutItemWine: {
    backgroundColor: '#790e32',
    borderBottomWidth: 0,
    marginTop: 5,
    borderRadius: 18,
  },
  logoutIconCircleWine: {
    backgroundColor: '#fff',
  },
  logoutTextWine: {
    color: '#fff',
    fontWeight: 'bold',
  },
  qrCodeContainerProminent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    marginTop: 0,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#790e32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  qrImageProminent: {
    width: 120,
    height: 120,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#ed8377',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  qrLabelProminent: {
    fontSize: 18,
    color: '#790e32',
    fontFamily: Fonts.InterBold,
    fontWeight: '700',
    marginBottom: 2,
  },
  qrHintProminent: {
    fontSize: 13,
    color: '#ed8377',
    fontFamily: Fonts.InterMedium,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
});
