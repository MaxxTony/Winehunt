import React from 'react';
import {View, Text, Image, StyleSheet, useColorScheme} from 'react-native';
import {Colors, Fonts} from '../../constant/Styles';

const ReceiptSummary = ({submittedData}) => {
  const colorScheme = useColorScheme();
  const valueTextColor = colorScheme === 'dark' ? Colors.black : Colors.black;
  if (!submittedData) return null;
  return (
    <View style={styles.summaryContainer}>
      <Text style={styles.modalTitlePro} allowFontScaling={false}>
        🎉 Receipt Sent!
      </Text>
      <Text style={[styles.modalDescriptionPro, {marginBottom: 12}]}>
        Your receipt has been sent. The admin or vendor will review and add your
        milestone for this product soon.
      </Text>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Summary:</Text>
        <Text style={{color: valueTextColor}}>Vendor: {submittedData.vendor}</Text>
        <Text style={{color: valueTextColor}}>Date: {submittedData.date}</Text>
        <Text style={{color: valueTextColor}}>Time: {submittedData.time}</Text>
        <Text style={{color: valueTextColor}}>Amount: {submittedData.amount}</Text>
        <Text style={{color: valueTextColor}}>Email: {submittedData.email}</Text>
        {submittedData.receipt && (
          <Image
            source={{uri: submittedData.receipt.uri}}
            style={{
              width: 80,
              height: 80,
              borderRadius: 8,
              marginTop: 8,
              alignSelf: 'center',
            }}
          />
        )}
      </View>
      <Text style={styles.notifyText}>
        You will be notified once your milestone is added.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    alignItems: 'center',
    width: '100%',
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#f7f7fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  summaryTitle: {
    fontWeight: 'bold',
    color: Colors.red,
  },
  notifyText: {
    color: Colors.gray15,
    fontSize: 13,
    marginTop: 8,
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
});

export default ReceiptSummary;
