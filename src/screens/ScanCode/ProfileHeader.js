import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import WineHuntButton from '../../common/WineHuntButton';
import { Colors, Fonts } from '../../constant/Styles';

const ProfileHeader = ({ userData, onRedeemPress, onVendorSelfPress, milestone, inset }) => {
  const isMilestone10 = milestone >= 10;
  return (
    <View style={[styles.cardContainer, isMilestone10 ? styles.goldCardContainer : styles.blueCardContainer]}>
      <View style={styles.profileImageSection}>
        <View style={[styles.profileImageWrapper, isMilestone10 ? styles.goldBorder : styles.blueBorder]}>
          <Image
            source={
              userData && userData?.image !== null
                ? { uri: userData?.image }
                : require('./Images/profile.png')
            }
            style={styles.profileImage}
          />
       
        </View>
      </View>
      <Text style={styles.profileName} allowFontScaling={false}>
        {userData?.first_name} {userData?.last_name}
      </Text>
      <View style={styles.qrSection}>
        <View style={[styles.qrWrapper, isMilestone10 ? styles.goldQRBorder : styles.blueQRBorder]}>
          <Image
            source={
              userData && userData?.qr_code !== null
                ? { uri: userData?.qr_code }
                : require('./Images/qrCode.png')
            }
            style={styles.qrImage}
          />
        </View>
        <Text style={[styles.qrLabel, isMilestone10 ? styles.goldText : styles.blueText]}>
          {isMilestone10 ? 'Milestone Achiever' : 'Scanner'}
        </Text>
      </View>
      <Text style={styles.scannerIdLabel} allowFontScaling={false}>
        Official scanner ID
      </Text>
      <Text style={styles.descriptionText}>
        {isMilestone10
          ? 'Congratulations! You have reached a milestone. Enjoy exclusive self-acceptance rewards.'
          : 'Scan wines and earn points! Reach milestones for exclusive rewards.'}
      </Text>
      {isMilestone10 ? (
        <WineHuntButton
          text="Vendor Self Acceptance"
          extraButtonStyle={[styles.actionButton, styles.goldButton]}
          extraTextStyle={styles.actionButtonText}
          onPress={onVendorSelfPress}
        />
      ) : (
        <WineHuntButton
          text="Redeem Points"
          extraButtonStyle={[styles.actionButton, styles.blueButton]}
          extraTextStyle={styles.actionButtonText}
          onPress={onRedeemPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
    margin: 16,
  },
  goldCardContainer: {
    backgroundColor: '#FFF8DC', // light gold
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  blueCardContainer: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  profileImageSection: {
    marginBottom: 8,
  },
  profileImageWrapper: {
    position: 'relative',
    borderRadius: 100,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goldBorder: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  blueBorder: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 100,
    backgroundColor: '#f2f2f2',
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: -10,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 2,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldBadge: {
    backgroundColor: '#FFD700',
  },
  blueBadge: {
    backgroundColor: '#007AFF',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  profileName: {
    fontSize: 20,
    color: Colors.red,
    fontFamily: Fonts.InterBold,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 4,
    textAlign: 'center',
  },
  qrSection: {
    alignItems: 'center',
    marginVertical: 8,
  },
  qrWrapper: {
    borderRadius: 16,
    padding: 6,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldQRBorder: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  blueQRBorder: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  qrImage: {
    height: 160,
    width: 160,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
  },
  qrLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 8,
    fontFamily: Fonts.InterBold,
    letterSpacing: 1,
    textAlign: 'center',
  },
  goldText: {
    color: '#bfa100',
  },
  blueText: {
    color: '#007AFF',
  },
  scannerIdLabel: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 2,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 2,
    paddingHorizontal: 8,
  },
  actionButton: {
    borderRadius: 30,
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginTop: 8,
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  goldButton: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
  },
  blueButton: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: Fonts.InterBold,
    color: '#fff',
    letterSpacing: 1,
    textAlign: 'center',
  },
});

export default ProfileHeader; 