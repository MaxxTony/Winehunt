import React from 'react';
import {View, Text, Image, Pressable, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../../constant/Styles';

const HomeHeader = ({
  userData,
  userFullName,
  userAddress,
  navigation,
  onProfilePress,
  onScanPress,
  onNotificationPress,
}) => {
  console.log(userData?.milestone);
  const getProfileImage = () => {
    if (userData && userData?.image !== null) {
      return {uri: userData?.image};
    }
    return require('../images/profile.png');
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Pressable
          onPress={onProfilePress || (() => navigation.navigate('Profile'))}>
          <View style={styles.profileImageContainer}>
            <Image
              source={getProfileImage()}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
        </Pressable>

        <View style={styles.userInfo}>
          <Text style={styles.userName} allowFontScaling={false}>
            {userFullName || 'Guest User'}
          </Text>
          <View style={styles.userLocationContainer}>
            <Image
              source={require('../images/location.png')}
              style={styles.locationIcon}
              resizeMode="contain"
            />
            <Text
              style={styles.userLocationText}
              numberOfLines={1}
              allowFontScaling={false}>
              {userAddress}
            </Text>
          </View>
        </View>

        <View style={styles.actionIcons}>
          <Pressable
            style={styles.iconContainer}
            onPress={onScanPress || (() => navigation.navigate('ScanCode'))}>
            <View style={styles.iconWrapper}>
              <Image
                source={
                  userData?.milestone < 10
                    ? require('../images/scanner2.png')
                    : require('../images/scanner.png')
                }
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
          </Pressable>

          <Pressable
            onPress={
              onNotificationPress ||
              (() => navigation.navigate('Notifications'))
            }>
            <View style={styles.iconWrapper}>
              <Image
                source={require('../images/notification.png')}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    padding: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    height: 48,
    width: 48,
    borderRadius: 24,
    borderWidth: 2,
  },
  userInfo: {
    flex: 1,
    marginHorizontal: 10,
  },
  userName: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
    fontWeight: '700',
    marginBottom: 3,
  },
  userLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationIcon: {
    height: 16,
    width: 16,
    tintColor: Colors.red,
  },
  userLocationText: {
    fontSize: 14,
    color: Colors.gray,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    flex: 1,
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  iconWrapper: {
    position: 'relative',
  },
  icon: {
    height: 35,
    width: 35,
  },
});

export default HomeHeader;
