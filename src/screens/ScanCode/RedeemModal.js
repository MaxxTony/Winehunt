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
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFormSuccess = (data) => {
    setSubmittedData(data);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowRedeemForm(false);
      setSubmittedData(null);
      onClose();
    }, 8500);
  };

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
                  <ReceiptSummary submittedData={submittedData} styles={styles} />
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
                  <View style={styles.modalListPro}>
                    <Text style={styles.modalListItemPro}>• Receipt photo</Text>
                    <Text style={styles.modalListItemPro}>• Vendor name, date, time, and amount</Text>
                  </View>
                  <Text style={styles.modalDescriptionPro} allowFontScaling={false}>
                    Email: <Text style={styles.emailTextPro}>{supportEmail}</Text>
                  </Text>
                  <WineHuntButton
                    text={copied ? 'Copied!' : 'Copy Email'}
                    extraButtonStyle={styles.copyButtonPro}
                    extraTextStyle={styles.copyButtonTextPro}
                    onPress={handleCopyEmail}
                  />
                  <WineHuntButton
                    text="Submit via App"
                    extraButtonStyle={styles.copyButtonPro}
                    extraTextStyle={styles.copyButtonTextPro}
                    onPress={() => setShowRedeemForm(true)}
                  />
                  <WineHuntButton
                    text="Close"
                    extraButtonStyle={styles.closeButtonPro}
                    onPress={onClose}
                  />
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
    backgroundColor: 'rgba(30,30,40,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  redeemModalContainerPro: {
    width: '90%',
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 16,
    gap: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
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
    fontSize: 26,
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
    borderRadius: 14,
    marginTop: 10,
    width: '100%',
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  copyButtonTextPro: {
    color: Colors.white,
    fontFamily: Fonts.InterBold,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  closeButtonPro: {
    backgroundColor: Colors.gray15,
    borderRadius: 14,
    marginTop: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
  },
});

export default RedeemModal; 