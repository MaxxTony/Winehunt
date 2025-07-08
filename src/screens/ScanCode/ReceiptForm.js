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
    <View style={styles.cardContainer}>
      <Text style={styles.modalTitlePro} allowFontScaling={false}>
        Submit Receipt
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.imagePickerPro,
          styles.dashedBorder,
          pressed && styles.imagePickerProPressed,
        ]}
        onPress={handlePickReceipt}
      >
        {form.receipt ? (
          <>
            {form.receipt.type && form.receipt.type.startsWith('image') ? (
              <Image source={{ uri: form.receipt.uri }} style={styles.imagePreviewPro} />
            ) : (
              <View style={styles.pdfPreviewWrap}>
                <Text style={styles.pdfIcon}>📄</Text>
                <Text style={styles.pdfName} numberOfLines={2}>
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
        <Text style={{ color: form.date ? '#000' : '#888', fontSize: 16 }}>
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
        <Text style={{ color: form.time ? '#000' : '#888', fontSize: 16 }}>
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
    </View>
  );
};


const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    margin: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    alignSelf: 'center',
    width: '95%',
    maxWidth: 420,
  },
  dashedBorder: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: Colors.red,
    backgroundColor: '#f7f7fa',
  },
  imagePickerPro: {
    width: 140,
    height: 140,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    alignSelf: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f7f7fa',
  },
  imagePickerProPressed: {
    backgroundColor: '#f2eaea',
    borderColor: Colors.red,
    opacity: 0.92,
  },
  imagePreviewPro: {
    width: 140,
    height: 140,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  pdfPreviewWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
    width: 140,
  },
  pdfIcon: {
    fontSize: 54,
    color: Colors.red,
  },
  pdfName: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: Fonts.InterMedium,
  },
  imageOverlayBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingVertical: 7,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  imageOverlayText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.InterBold,
    letterSpacing: 0.2,
  },
  imageRemoveBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  imageRemoveIcon: {
    fontSize: 22,
    color: Colors.red,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  imageUploadIconWrap: {
    backgroundColor: Colors.red,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  imageUploadIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageUploadText: {
    color: '#888',
    fontSize: 16,
    fontFamily: Fonts.InterMedium,
    textAlign: 'center',
  },
  inputPro: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    fontSize: 18,
    backgroundColor: '#f9f9fb',
    color: '#000',
    fontFamily: Fonts.InterMedium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
  },
  submitButtonPro: {
    backgroundColor: Colors.red,
    borderRadius: 16,
    marginTop: 12,
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
    fontSize: 20,
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
  errorText: {
    color: Colors.red,
    fontSize: 14,
    marginBottom: 7,
    marginLeft: 2,
    fontFamily: Fonts.InterMedium,
  },
  modalTitlePro: {
    fontSize: 26,
    fontFamily: Fonts.InterBold,
    color: Colors.red,
    textAlign: 'center',
    marginBottom: 18,
    letterSpacing: 0.2,
  },
});


export default ReceiptForm; 