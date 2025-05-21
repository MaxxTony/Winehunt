import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

const CancelOrderModal = ({isVisible, onClose, onConfirm}) => {
  return (
    <Modal
      animationIn="fadeInUp"
      animationInTiming={500}
      backdropOpacity={0.5}
      animationOutTiming={500}
      animationOut="fadeOutDown"
      isVisible={isVisible}
      style={{margin: 0}}
      onBackdropPress={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Cancel Order</Text>
        <Text style={styles.message}>Are you want cancel this order?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onClose} style={styles.noButton}>
            <Text style={styles.noText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onConfirm} style={styles.yesButton}>
            <Text style={styles.yesText}>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CancelOrderModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  noButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  yesButton: {
    backgroundColor: '#B71C1C',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  noText: {
    color: '#000',
    fontWeight: '500',
  },
  yesText: {
    color: '#fff',
    fontWeight: '500',
  },
});
