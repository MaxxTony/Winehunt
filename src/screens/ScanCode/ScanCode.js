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

const ScanCode = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const dispatch = useDispatch();
  const isFoused = useIsFocused();

  const {userData} = useSelector(state => state.profile);

  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showRedeemForm, setShowRedeemForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    vendor: '',
    date: new Date(),
    showDatePicker: false,
    time: new Date(),
    showTimePicker: false,
    amount: '',
    receipt: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const supportEmail = 'support@winehunt.com';
  const [modalAnim] = useState(new Animated.Value(0));
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [isFoused]);

  // Animate modal in/out
  useEffect(() => {
    if (showRedeemModal) {
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
  }, [showRedeemModal]);

  const handleCopyEmail = () => {
    Clipboard.setString(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handlePickImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (
        !response.didCancel &&
        !response.errorCode &&
        response.assets &&
        response.assets.length > 0
      ) {
        setForm(f => ({...f, receipt: response.assets[0]}));
      }
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setForm(f => ({
      ...f,
      showDatePicker: false,
      date: selectedDate || f.date,
    }));
  };

  const handleTimeChange = (event, selectedTime) => {
    setForm(f => ({
      ...f,
      showTimePicker: false,
      time: selectedTime || f.time,
    }));
  };

  const handleFormChange = (key, value) => {
    setForm(f => ({...f, [key]: value}));
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.vendor || form.vendor.trim().length < 2) {
      showWarning('Please enter a valid vendor name.');
      return;
    }
    if (!form.date) {
      showWarning('Please select a date.');
      return;
    }
    if (!form.time) {
      showWarning('Please select a time.');
      return;
    }
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      showWarning('Please enter a valid amount.');
      return;
    }
    if (!form.receipt) {
      showWarning('Please upload a receipt image.');
      return;
    }

    setSubmitting(true);
    try {
      const info = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(info)?.token;

      // Prepare FormData
      const formData = new FormData();
      formData.append('vendor_name', form.vendor);
      formData.append('date', form.date.toISOString().split('T')[0]);
      formData.append(
        'time',
        form.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      );
      formData.append('amount', form.amount);
      formData.append('user_email', userData?.email);

      if (form.receipt) {
        formData.append('receipt', {
          uri: form.receipt.uri,
          name: form.receipt.fileName || 'receipt.jpg',
          type: form.receipt.type || 'image/jpeg',
        });
      }
      const url = Constants.baseUrl10 + Constants.reedemPoints;
      try {
        const res = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        if (res?.status == 200) {
          showSucess(res?.data?.message);
          setSubmittedData({
            vendor: form.vendor,
            date: form.date.toISOString().split('T')[0],
            time: form.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            amount: form.amount,
            email: userData?.email,
            receipt: form.receipt,
          });
          setSuccess(true);
          setForm({
            vendor: '',
            date: new Date(),
            showDatePicker: false,
            time: new Date(),
            showTimePicker: false,
            amount: '',
            receipt: null,
          });
          setTimeout(() => {
            setSuccess(false);
            setShowRedeemForm(false);
            setShowRedeemModal(false);
            setSubmittedData(null);
          }, 3500);
        }
      } catch (error) {
        if (error.response) {
          console.log('Server Error:', error.response.data);
          showWarning(error.response.data?.message);
        } else if (error.request) {
          console.log('No Response:', error.request);
        } else {
          console.log('Request Error:', error.message);
        }
      }
    } catch (error) {
      showWarning(error.response?.data?.message || 'Error updating wishlist');
    } finally {
      setSubmitting(false);
    }
  };

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
          <WineHuntButton
            text="Redeem Points"
            extraButtonStyle={styles.redeemButton}
            extraTextStyle={styles.redeemButtonText}
            onPress={() => setShowRedeemModal(true)}
          />
        </View>
      </ScrollView>
      <Modal
        visible={showRedeemModal}
        transparent
        animationType="none"
        onRequestClose={() => {
          setShowRedeemModal(false);
          setShowRedeemForm(false);
          setSuccess(false);
        }}>
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
            ]}>
            <Pressable
              style={styles.closeIconWrapPro}
              onPress={() => {
                setShowRedeemModal(false);
                setShowRedeemForm(false);
                setSuccess(false);
              }}>
              <Text style={styles.closeIconPro}>×</Text>
            </Pressable>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{width: '100%'}}>
              <ScrollView
                contentContainerStyle={{
                  alignItems: 'center',
                  paddingBottom: 24,
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                {showRedeemForm ? (
                  success ? (
                    <View style={{ alignItems: 'center', width: '100%' }}>
                      <Text style={styles.modalTitlePro} allowFontScaling={false}>
                        🎉 Receipt Sent!
                      </Text>
                      <Text style={[styles.modalDescriptionPro, { marginBottom: 12 }]}>Your receipt has been sent. The admin or vendor will review and add your milestone for this product soon.</Text>
                      {submittedData && (
                        <View style={{ width: '100%', backgroundColor: '#f7f7fa', borderRadius: 12, padding: 12, marginBottom: 10 }}>
                          <Text style={{ fontWeight: 'bold', color: Colors.red }}>Summary:</Text>
                          <Text>Vendor: {submittedData.vendor}</Text>
                          <Text>Date: {submittedData.date}</Text>
                          <Text>Time: {submittedData.time}</Text>
                          <Text>Amount: {submittedData.amount}</Text>
                          <Text>Email: {submittedData.email}</Text>
                          {submittedData.receipt && (
                            <Image
                              source={{ uri: submittedData.receipt.uri }}
                              style={{ width: 80, height: 80, borderRadius: 8, marginTop: 8, alignSelf: 'center' }}
                            />
                          )}
                        </View>
                      )}
                      <Text style={{ color: Colors.gray15, fontSize: 13, marginTop: 8 }}>
                        You will be notified once your milestone is added.
                      </Text>
                    </View>
                  ) : (
                    <>
                      <Text
                        style={styles.modalTitlePro}
                        allowFontScaling={false}>
                        Submit Receipt
                      </Text>
                      <Pressable
                        style={styles.imagePickerPro}
                        onPress={handlePickImage}>
                        {form.receipt ? (
                          <>
                            <Image
                              source={{uri: form.receipt.uri}}
                              style={styles.imagePreviewPro}
                            />
                            <Pressable
                              style={styles.imageRemoveBtn}
                              onPress={() =>
                                setForm(f => ({...f, receipt: null}))
                              }>
                              <Text style={styles.imageRemoveIcon}>×</Text>
                            </Pressable>
                            <View
                              style={styles.imageOverlayBtn}
                              pointerEvents="box-none">
                              <Text style={styles.imageOverlayText}>
                                Change
                              </Text>
                            </View>
                          </>
                        ) : (
                          <>
                            <View style={styles.imageUploadIconWrap}>
                              <Text style={styles.imageUploadIcon}>＋</Text>
                            </View>
                            <Text style={styles.imageUploadText}>
                              Tap to upload receipt
                            </Text>
                          </>
                        )}
                      </Pressable>
                      <TextInput
                        style={styles.inputPro}
                        placeholder="Vendor Name"
                        value={form.vendor}
                        onChangeText={text => handleFormChange('vendor', text)}
                        placeholderTextColor={Colors.gray15}
                      />
                      <Pressable
                        style={styles.inputPro}
                        onPress={() =>
                          handleFormChange('showDatePicker', true)
                        }>
                        <Text style={{color: form.date ? '#000' : '#888'}}>
                          {form.date
                            ? form.date.toLocaleDateString()
                            : 'Select Date'}
                        </Text>
                      </Pressable>
                      {form.showDatePicker && (
                        <DateTimePicker
                          value={form.date}
                          mode="date"
                          display="default"
                          onChange={handleDateChange}
                        />
                      )}
                      <Pressable
                        style={styles.inputPro}
                        onPress={() =>
                          handleFormChange('showTimePicker', true)
                        }>
                        <Text style={{color: form.time ? '#000' : '#888'}}>
                          {form.time
                            ? form.time.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Select Time'}
                        </Text>
                      </Pressable>
                      {form.showTimePicker && (
                        <DateTimePicker
                          value={form.time}
                          mode="time"
                          display="default"
                          onChange={handleTimeChange}
                        />
                      )}
                      <TextInput
                        style={styles.inputPro}
                        placeholder="Amount"
                        value={form.amount}
                        keyboardType="numeric"
                        onChangeText={text => handleFormChange('amount', text)}
                        placeholderTextColor={Colors.gray15}
                      />
                      <WineHuntButton
                        text={submitting ? 'Submitting...' : 'Submit'}
                        extraButtonStyle={styles.submitButtonPro}
                        extraTextStyle={styles.submitButtonTextPro}
                        onPress={handleSubmit}
                        disabled={submitting}
                      />
                      <WineHuntButton
                        text="Cancel"
                        extraButtonStyle={styles.closeButtonPro}
                        onPress={() => setShowRedeemForm(false)}
                      />
                    </>
                  )
                ) : (
                  <>
                    <Text style={styles.modalTitlePro} allowFontScaling={false}>
                      Redeem Points
                    </Text>
                    <Text
                      style={styles.modalDescriptionPro}
                      allowFontScaling={false}>
                      {`If you forgot your phone or can't scan the QR code, you can still earn points!\nPlease send the following to our support team:`}
                    </Text>
                    <View style={styles.modalListPro}>
                      <Text style={styles.modalListItemPro}>
                        • Receipt photo
                      </Text>
                      <Text style={styles.modalListItemPro}>
                        • Vendor name, date, time, and amount
                      </Text>
                    </View>
                    <Text
                      style={styles.modalDescriptionPro}
                      allowFontScaling={false}>
                      Email:{' '}
                      <Text style={styles.emailTextPro}>{supportEmail}</Text>
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
                      onPress={() => setShowRedeemModal(false)}
                    />
                  </>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>
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
  redeemButton: {
    marginTop: 10,
    backgroundColor: Colors.red,
    borderRadius: 30,
    paddingHorizontal: 32,
    paddingVertical: 16,
    shadowColor: Colors.red,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  redeemButtonText: {
    fontSize: 18,
    fontFamily: Fonts.InterBold,
    color: Colors.white,
    letterSpacing: 1,
  },
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
    shadowOffset: {width: 0, height: 12},
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
    shadowOffset: {width: 0, height: 2},
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
    shadowOffset: {width: 0, height: 4},
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
  imagePickerPro: {
    width: 130,
    height: 130,
    backgroundColor: '#f7f7fa',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  imagePreviewPro: {
    width: 130,
    height: 130,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  imageOverlayBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingVertical: 6,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  imageOverlayText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: Fonts.InterBold,
    letterSpacing: 0.2,
  },
  imageRemoveBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageRemoveIcon: {
    fontSize: 20,
    color: Colors.red,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  imageUploadIconWrap: {
    backgroundColor: Colors.red,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: Colors.red,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  imageUploadIcon: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  imageUploadText: {
    color: '#888',
    fontSize: 15,
    fontFamily: Fonts.InterMedium,
    textAlign: 'center',
  },
  inputPro: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    fontSize: 17,
    backgroundColor: '#f9f9fb',
    color: '#000',
    fontFamily: Fonts.InterMedium,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  submitButtonPro: {
    backgroundColor: 'linear-gradient(90deg, #e52d27 0%, #b31217 100%)', // fallback for RN
    backgroundColor: Colors.red,
    borderRadius: 14,
    marginTop: 10,
    width: '100%',
    shadowColor: Colors.red,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonTextPro: {
    color: Colors.white,
    fontFamily: Fonts.InterBold,
    fontSize: 19,
    letterSpacing: 0.5,
  },
});
