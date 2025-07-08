import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Pressable, ScrollView, Animated, Easing, KeyboardAvoidingView, Platform, Image, StyleSheet } from 'react-native';
import WineHuntButton from '../../common/WineHuntButton';
import { Colors, Fonts } from '../../constant/Styles';
import ReceiptForm from './ReceiptForm';
import ReceiptSummary from './ReceiptSummary';

const RedeemModal = ({ visible, onClose, userData, supportEmail }) => {
  const [showRedeemForm, setShowRedeemForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [modalAnim] = useState(new Animated.Value(0));
  const [submittedData, setSubmittedData] = useState(null);
  const [showCopyAnim, setShowCopyAnim] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.timing(modalAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.exp),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleCopyEmail = () => {
    if (typeof Clipboard !== 'undefined') {
      Clipboard.setString(supportEmail);
    }
    setCopied(true);
    setShowCopyAnim(true);
    setTimeout(() => {
      setCopied(false);
      setShowCopyAnim(false);
    }, 1500);
  };

  const handleFormSuccess = (data) => {
    setSubmittedData(data);
    setSuccess(true);
    setShowSuccessAnim(true);
    setTimeout(() => setShowSuccessAnim(false), 1200);
    setTimeout(() => {
      setSuccess(false);
      setShowRedeemForm(false);
      setSubmittedData(null);
      onClose();
    }, 8500);
  };

  // Animated checkmark for success
  const SuccessCheckmark = () => (
    <Animated.View style={[styles.successAnimWrap, { opacity: showSuccessAnim ? 1 : 0, transform: [{ scale: showSuccessAnim ? 1 : 0.7 }] }]}> 
      <View style={styles.successCircle}>
        <Text style={styles.successCheck}>✓</Text>
      </View>
      <Text style={styles.successText}>Points Redeemed!</Text>
    </Animated.View>
  );

  // Animated feedback for copy
  const CopyAnim = () => (
    <Animated.View style={[styles.copyAnimWrap, { opacity: showCopyAnim ? 1 : 0, transform: [{ scale: showCopyAnim ? 1 : 0.7 }] }]}> 
      <Text style={styles.copyAnimText}>Copied!</Text>
    </Animated.View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => {
        setShowRedeemForm(false);
        setSuccess(false);
        onClose();
      }}
    >
      <View style={styles.modalBackdropGlass}>
        <Animated.View
          style={[
            styles.redeemModalContainerPro,
            {
              opacity: modalAnim,
              transform: [
                {
                  scale: modalAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
         
          <Pressable
            style={styles.closeIconWrapPro}
            onPress={() => {
              setShowRedeemForm(false);
              setSuccess(false);
              onClose();
            }}
            accessibilityLabel="Close modal"
          >
            <Text style={styles.closeIconPro}>×</Text>
          </Pressable>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%' }}
          >
            <ScrollView
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 24 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {showRedeemForm ? (
                success ? (
                  <>
                    <SuccessCheckmark />
                    <ReceiptSummary submittedData={submittedData} styles={styles} />
                  </>
                ) : (
                  <ReceiptForm
                    userData={userData}
                    styles={styles}
                    onSuccess={handleFormSuccess}
                    onCancel={() => setShowRedeemForm(false)}
                  />
                )
              ) : (
                <>
                  <Text style={styles.modalTitlePro} allowFontScaling={false}>
                    Redeem Points
                  </Text>
                  <Text style={styles.modalDescriptionPro} allowFontScaling={false}>
                    {`If you forgot your phone or can't scan the QR code, you can still earn points!\nPlease send the following to our support team:`}
                  </Text>
                  <View style={styles.divider} />
                  <View style={styles.modalListPro}>
                    <Text style={styles.modalListItemPro}>• Receipt photo</Text>
                    <Text style={styles.modalListItemPro}>• Vendor name, date, time, and amount</Text>
                  </View>
                  <View style={styles.divider} />
                  <Text style={styles.modalDescriptionPro} allowFontScaling={false}>
                    Email: <Text style={styles.emailTextPro}>{supportEmail}</Text>
                  </Text>
                  <View style={{ width: '100%', alignItems: 'center' }}>
                    <WineHuntButton
                      text={copied ? 'Copied!' : 'Copy Email'}
                      extraButtonStyle={styles.copyButtonPro}
                      extraTextStyle={styles.copyButtonTextPro}
                      onPress={handleCopyEmail}
                    />
                    <WineHuntButton
                      text="Submit via App"
                      extraButtonStyle={styles.submitButtonPro}
                      extraTextStyle={styles.copyButtonTextPro}
                      onPress={() => setShowRedeemForm(true)}
                    />
                    <WineHuntButton
                      text="Close"
                      extraButtonStyle={styles.closeButtonPro}
                      onPress={onClose}
                    />
                  </View>
                  <CopyAnim />
                </>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdropGlass: {
    flex: 1,
    backgroundColor: 'rgba(30,30,40,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    // Glassmorphism effect
    backdropFilter: 'blur(8px)', // Only works on web, but kept for design intent
  },
  redeemModalContainerPro: {
    width: '92%',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 36,
    elevation: 18,
    gap: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
  },
  headerIconWrap: {
    marginTop: -24,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 230, 230, 0.7)',
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    alignSelf: 'center',
  },
  headerIcon: {
    width: 56,
    height: 56,
  },
  closeIconWrapPro: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(30,30,40,0.12)',
    borderRadius: 20,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  closeIconPro: {
    fontSize: 26,
    color: Colors.red,
    fontWeight: 'bold',
    lineHeight: 30,
    textAlign: 'center',
  },
  modalTitlePro: {
    fontSize: 28,
    fontFamily: Fonts.PhilosopherBold,
    color: Colors.red,
    marginBottom: 10,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  modalDescriptionPro: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
    textAlign: 'center',
    marginBottom: 10,
    opacity: 0.85,
  },
  divider: {
    width: '80%',
    height: 1.5,
    backgroundColor: 'rgba(220, 0, 50, 0.08)',
    marginVertical: 10,
    alignSelf: 'center',
    borderRadius: 1,
  },
  modalListPro: {
    alignSelf: 'flex-start',
    marginLeft: 12,
    marginBottom: 10,
  },
  modalListItemPro: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    marginBottom: 3,
    opacity: 0.9,
  },
  emailTextPro: {
    color: Colors.red,
    fontFamily: Fonts.InterBold,
    fontSize: 16,
  },
  copyButtonPro: {
    backgroundColor: Colors.red,
    borderRadius: 16,
    marginTop: 10,
    width: '100%',
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonPro: {
    backgroundColor: Colors.red,
    borderRadius: 16,
    marginTop: 10,
    width: '100%',
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  copyButtonTextPro: {
    color: Colors.white,
    fontFamily: Fonts.InterBold,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  closeButtonPro: {
    backgroundColor: Colors.gray15,
    borderRadius: 16,
    marginTop: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
  },
  // Success animation styles
  successAnimWrap: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(220, 0, 50, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: Colors.red,
  },
  successCheck: {
    fontSize: 38,
    color: Colors.red,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 44,
  },
  successText: {
    fontSize: 20,
    color: Colors.red,
    fontFamily: Fonts.InterBold,
    marginTop: 2,
    marginBottom: 6,
    textAlign: 'center',
  },
  // Copy animation styles
  copyAnimWrap: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  copyAnimText: {
    backgroundColor: Colors.red,
    color: Colors.white,
    fontFamily: Fonts.InterBold,
    fontSize: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
});

export default RedeemModal; 