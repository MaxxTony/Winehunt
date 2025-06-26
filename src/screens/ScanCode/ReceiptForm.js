import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import WineHuntButton from '../../common/WineHuntButton';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { showSucess, showWarning } from '../../helper/Toastify';
import Constants from '../../helper/Constant';
import { Colors, Fonts } from '../../constant/Styles';

const ReceiptForm = ({ userData, onSuccess, onCancel }) => {
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
  const [formErrors, setFormErrors] = useState({});

  const handlePickReceipt = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        allowMultiSelection: false,
      });
      if (res && res[0]) {
        setForm(f => ({ ...f, receipt: res[0] }));
        setFormErrors(errors => ({ ...errors, receipt: undefined }));
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        showWarning('Failed to pick file');
      }
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setForm(f => ({
      ...f,
      showDatePicker: false,
      date: selectedDate || f.date,
    }));
    setFormErrors(errors => ({ ...errors, date: undefined }));
  };

  const handleTimeChange = (event, selectedTime) => {
    setForm(f => ({
      ...f,
      showTimePicker: false,
      time: selectedTime || f.time,
    }));
    setFormErrors(errors => ({ ...errors, time: undefined }));
  };

  const handleFormChange = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
    setFormErrors(errors => ({ ...errors, [key]: undefined }));
  };

  const handleSubmit = async () => {
    const errors = {};
    if (!form.vendor || form.vendor.trim().length < 2) {
      errors.vendor = 'Please enter a valid vendor name.';
    }
    if (!form.date) {
      errors.date = 'Please select a date.';
    }
    if (!form.time) {
      errors.time = 'Please select a time.';
    }
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      errors.amount = 'Please enter a valid amount.';
    }
    if (!form.receipt) {
      errors.receipt = 'Please upload a receipt file.';
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setSubmitting(true);
    try {
      const info = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(info)?.token;
      const formData = new FormData();
      formData.append('vendor_name', form.vendor);
      formData.append('date', form.date.toISOString().split('T')[0]);
      formData.append(
        'time',
        form.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      formData.append('amount', form.amount);
      formData.append('user_email', userData?.email);
      if (form.receipt) {
        formData.append('receipt', {
          uri: form.receipt.uri,
          name: form.receipt.name || form.receipt.fileName || (form.receipt.type && form.receipt.type.includes('pdf') ? 'receipt.pdf' : 'receipt.jpg'),
          type: form.receipt.type || (form.receipt.name && form.receipt.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
        });
      }
      const url = Constants.baseUrl10 + Constants.reedemPoints;
      const res = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.status === 200) {
        showSucess(res?.data?.message);
        onSuccess({
          vendor: form.vendor,
          date: form.date.toISOString().split('T')[0],
          time: form.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          amount: form.amount,
          email: userData?.email,
          receipt: form.receipt,
        });
        setForm({
          vendor: '',
          date: new Date(),
          showDatePicker: false,
          time: new Date(),
          showTimePicker: false,
          amount: '',
          receipt: null,
        });
        setFormErrors({});
      }
    } catch (error) {
      if (error.response) {
        showWarning(error.response.data?.message);
      } else {
        showWarning('Error updating wishlist');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Text style={styles.modalTitlePro} allowFontScaling={false}>
        Submit Receipt
      </Text>
      <Pressable style={styles.imagePickerPro} onPress={handlePickReceipt}>
        {form.receipt ? (
          <>
            {form.receipt.type && form.receipt.type.startsWith('image') ? (
              <Image source={{ uri: form.receipt.uri }} style={styles.imagePreviewPro} />
            ) : (
              <View style={{ alignItems: 'center', justifyContent: 'center', height: 130, width: 130 }}>
                <Text style={{ fontSize: 48, color: Colors.red }}>📄</Text>
                <Text style={{ fontSize: 13, color: '#333', textAlign: 'center', marginTop: 6 }} numberOfLines={2}>
                  {form.receipt.name || 'PDF File'}
                </Text>
              </View>
            )}
            <Pressable
              style={styles.imageRemoveBtn}
              onPress={() => { setForm(f => ({ ...f, receipt: null })); setFormErrors(errors => ({ ...errors, receipt: undefined })); }}
            >
              <Text style={styles.imageRemoveIcon}>×</Text>
            </Pressable>
            <View style={styles.imageOverlayBtn} pointerEvents="box-none">
              <Text style={styles.imageOverlayText}>Change</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.imageUploadIconWrap}>
              <Text style={styles.imageUploadIcon}>＋</Text>
            </View>
            <Text style={styles.imageUploadText}>Tap to upload receipt (image or PDF)</Text>
          </>
        )}
      </Pressable>
      {formErrors.receipt && <Text style={styles.errorText}>{formErrors.receipt}</Text>}
      <TextInput
        style={styles.inputPro}
        placeholder="Vendor Name"
        value={form.vendor}
        onChangeText={text => handleFormChange('vendor', text)}
        placeholderTextColor={Colors.gray15}
      />
      {formErrors.vendor && <Text style={styles.errorText}>{formErrors.vendor}</Text>}
      <Pressable style={styles.inputPro} onPress={() => handleFormChange('showDatePicker', true)}>
        <Text style={{ color: form.date ? '#000' : '#888' }}>
          {form.date ? form.date.toLocaleDateString() : 'Select Date'}
        </Text>
      </Pressable>
      {formErrors.date && <Text style={styles.errorText}>{formErrors.date}</Text>}
      {form.showDatePicker && (
        <DateTimePicker
          value={form.date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Pressable style={styles.inputPro} onPress={() => handleFormChange('showTimePicker', true)}>
        <Text style={{ color: form.time ? '#000' : '#888' }}>
          {form.time
            ? form.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Select Time'}
        </Text>
      </Pressable>
      {formErrors.time && <Text style={styles.errorText}>{formErrors.time}</Text>}
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
      {formErrors.amount && <Text style={styles.errorText}>{formErrors.amount}</Text>}
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
        onPress={onCancel}
      />
    </>
  );
};


const styles = StyleSheet.create({
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
     shadowOffset: { width: 0, height: 2 },
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
     shadowOffset: { width: 0, height: 1 },
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
     shadowOffset: { width: 0, height: 2 },
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
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.06,
     shadowRadius: 2,
   },
   submitButtonPro: {
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
   submitButtonTextPro: {
     color: Colors.white,
     fontFamily: Fonts.InterBold,
     fontSize: 19,
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
   errorText: {
     color: 'red',
     fontSize: 13,
     marginBottom: 6,
     marginLeft: 2,
     fontFamily: Fonts.InterMedium,
   },
});


export default ReceiptForm; 