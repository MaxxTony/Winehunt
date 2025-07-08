import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TextInput,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts} from '../../constant/Styles';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WineHuntButton from '../../common/WineHuntButton';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProfile} from '../../redux/slices/profileSlice';
import Clipboard from '@react-native-clipboard/clipboard';
import {launchImageLibrary} from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {showSucess, showWarning} from '../../helper/Toastify';
import Constants from '../../helper/Constant';
import ProfileHeader from './ProfileHeader';
import RedeemModal from './RedeemModal';
import VendorSelfAcceptanceModal from './VendorSelfAcceptanceModal';

const ScanCode = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();
  const isFoused = useIsFocused();

  const {userData} = useSelector(state => state.profile);

  console.log(userData)

  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showVendorSelfModal, setShowVendorSelfModal] = useState(false);
  const supportEmail = 'support@winehunt.com';

  useEffect(() => {
    dispatch(fetchProfile());
  }, [isFoused]);

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title=""
        onPress={() => navigation.goBack()}
        extraStyle={styles.backNavigationExtraStyle}
      />
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}>
        <ProfileHeader
          userData={userData}
          onRedeemPress={() => setShowRedeemModal(true)}
          onVendorSelfPress={() => setShowVendorSelfModal(true)}
          milestone={userData?.milestone || 0}
          inset={inset}
        />
      </ScrollView>
      <RedeemModal
        visible={showRedeemModal && (userData?.milestone < 10)}
        onClose={() => setShowRedeemModal(false)}
        userData={userData}
        supportEmail={supportEmail}
        styles={styles}
      />
      
      <VendorSelfAcceptanceModal
        visible={showVendorSelfModal && (userData?.milestone >= 10)}
        onClose={() => setShowVendorSelfModal(false)}
        userData={userData}
      />
    </View>
  );
};

export default ScanCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backNavigationExtraStyle: {
    borderBottomWidth: 0,
  },
  scrollViewContainer: {
    paddingBottom: 80,
    padding: 20,
    gap: 20,
  },
  redeemButton: {
    backgroundColor: Colors.red,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: Colors.red,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    alignSelf: 'center',
  },
  redeemButtonText: {
    fontSize: 15,
    fontFamily: Fonts.InterBold,
    color: Colors.white,
    letterSpacing: 1,
  },
});
