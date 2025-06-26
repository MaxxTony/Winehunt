import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, ActivityIndicator, FlatList, StyleSheet, Alert, TextInput } from 'react-native';
import WineHuntButton from '../../common/WineHuntButton';
import { Colors, Fonts } from '../../constant/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import axios from 'axios';

const VendorSelfAcceptanceModal = ({ visible, onClose, userData }) => {
  const [step, setStep] = useState(1);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [billOver70, setBillOver70] = useState(null); // null, true, or false

  useEffect(() => {
    if (visible) {
      setStep(1);
      setSelectedVendor(null);
      setSuccess(false);
      setSearch('');
      setBillOver70(null);
      fetchVendors();
    }
  }, [visible]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const data = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(data)?.token;
      const url = Constants.baseUrl2 + Constants.home;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res?.status === 200 && res?.data?.vendors) {
        setVendors(res.data.vendors);
      } else {
        setVendors([]);
      }
    } catch (e) {
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter vendors by search
  const filteredVendors = vendors.filter(v =>
    v.shop_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // TODO: Replace with actual API call for vendor self-acceptance
      // Example: await axios.post('API_URL', { vendor_id: selectedVendor.id, user_id: userData.id, billOver70 });
      await new Promise(resolve => setTimeout(resolve, 1200));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setStep(1);
        setSelectedVendor(null);
        setBillOver70(null);
        onClose();
      }, 2000);
    } catch (e) {
      Alert.alert('Error', 'Failed to submit acceptance.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeIcon}>×</Text>
          </Pressable>
          {step === 1 && (
            <>
              <Text style={styles.title}>Which vendor are you visiting?</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search vendor..."
                placeholderTextColor="#aaa"
                value={search}
                onChangeText={setSearch}
                autoFocus
              />
              {loading ? (
                <ActivityIndicator color={Colors.red} />
              ) : filteredVendors.length === 0 ? (
                <Text style={styles.emptyText}>No vendors found.</Text>
              ) : (
                <FlatList
                  data={filteredVendors}
                  keyExtractor={item => item.id?.toString()}
                  renderItem={({ item }) => (
                    <Pressable
                      style={[
                        styles.vendorItem,
                        selectedVendor?.id === item.id && styles.vendorItemSelected,
                      ]}
                      onPress={() => setSelectedVendor(item)}
                    >
                      <Text style={[
                        styles.vendorName,
                        { color: selectedVendor?.id === item.id ? Colors.white : Colors.black }
                      ]}>{item.shop_name}</Text>
                    </Pressable>
                  )}
                  style={{ maxHeight: 220, width: '100%' }}
                  keyboardShouldPersistTaps="handled"
                />
              )}
              <WineHuntButton
                text="Next"
                extraButtonStyle={styles.button}
                extraTextStyle={styles.buttonText}
                onPress={() => setStep(2)}
                disabled={!selectedVendor}
              />
            </>
          )}
          {step === 2 && (
            <View style={styles.billCardContainer}>
              <Text style={styles.billTitle}>Bill Amount Confirmation</Text>
              <View style={styles.billCard}>
                <Text style={styles.mandatoryLabel}>Mandatory Question:</Text>
                <Text style={styles.billQuestion}>Is the customer's bill over £70?</Text>
                <View style={{ marginVertical: 10 }}>
                  <Text style={styles.bulletText}>{'\u2022'} If Click Yes, Customer Achieve a +5 Points</Text>
                  <Text style={styles.bulletText}>{'\u2022'} If Click No, Customer Achieve a +3 Points</Text>
                </View>
                <View style={styles.optionsRow}>
                  <Pressable
                    style={[styles.optionBtn, billOver70 === true && styles.optionBtnSelected]}
                    onPress={() => setBillOver70(true)}
                  >
                    <Text style={[styles.optionCheck, billOver70 === true && styles.optionCheckSelected]}>✓</Text>
                    <Text style={styles.optionLabel}>Yes</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.optionBtn, billOver70 === false && styles.optionBtnSelected]}
                    onPress={() => setBillOver70(false)}
                  >
                    <Text style={[styles.optionCheck, billOver70 === false && styles.optionCheckSelected]}></Text>
                    <Text style={styles.optionLabel}>No</Text>
                  </Pressable>
                </View>
                <WineHuntButton
                  text={submitting ? 'Submitting...' : 'Submit'}
                  extraButtonStyle={styles.button}
                  extraTextStyle={styles.buttonText}
                  onPress={handleSubmit}
                  disabled={billOver70 === null || submitting}
                />
              </View>
              {success && (
                <Text style={styles.successText}>Reward accepted and applied!</Text>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(30,30,40,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
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
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: 'rgba(30,30,40,0.12)',
    borderRadius: 20,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  closeIcon: {
    fontSize: 26,
    color: Colors.red,
    fontWeight: 'bold',
    lineHeight: 30,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.PhilosopherBold,
    color: Colors.red,
    marginVertical: 20,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  vendorItem: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f7f7fa',
    marginVertical: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  vendorItemSelected: {
    backgroundColor: Colors.red,
    borderColor: Colors.red,
  },
  vendorName: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
  },
  button: {
    backgroundColor: Colors.red,
    borderRadius: 14,
    marginTop: 16,
    width: '100%',
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: Fonts.InterBold,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  successText: {
    color: Colors.green,
    fontSize: 18,
    fontFamily: Fonts.InterBold,
    marginTop: 16,
    textAlign: 'center',
  },
  searchInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    backgroundColor: '#fafafd',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  billCardContainer: {
    width: '100%',
    alignItems: 'center',
  },
  billCard: {
    width: '100%',
    backgroundColor: '#fbeeee',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  billTitle: {
    fontSize: 20,
    fontFamily: Fonts.PhilosopherBold,
    color: Colors.black,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  mandatoryLabel: {
    fontSize: 16,
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    marginBottom: 2,
  },
  billQuestion: {
    fontSize: 16,
    fontFamily: Fonts.InterMedium,
    color: Colors.red,
    marginBottom: 8,
  },
  bulletText: {
    fontSize: 15,
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    marginLeft: 8,
    marginBottom: 2,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 16,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginRight: 10,
    minWidth: 70,
  },
  optionBtnSelected: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  optionCheck: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginRight: 8,
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  optionCheckSelected: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
    color: '#fff',
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
  },
});

export default VendorSelfAcceptanceModal; 