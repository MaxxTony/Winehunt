import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {Colors, Fonts} from '../../constant/Styles';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WineHuntButton from '../../common/WineHuntButton';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProfile} from '../../redux/slices/profileSlice';

const ScanCode = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();
  const isFoused = useIsFocused();

  const {userData} = useSelector(state => state.profile);

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
        <View style={styles.profileHeader}>
          <Image
            source={
              userData && userData?.image !== null
                ? {uri: userData?.image}
                : require('./Images/profile.png')
            }
            style={styles.profileImage}
          />
          <Text style={styles.profileName} allowFontScaling={false}>
            {' '}
            {userData?.first_name} {userData?.last_name}
          </Text>
          <Image
            source={
              userData && userData?.qr_code !== null
                ? {uri: userData?.qr_code}
                : require('./Images/qrCode.png')
            }
            style={{height: 200, width: 200}}
          />
          <Text
            style={[styles.profileName, {color: Colors.black}]}
            allowFontScaling={false}>
            Official scanner ID
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: Colors.black,
              fontFamily: Fonts.InterRegular,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum 
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ScanCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
});
