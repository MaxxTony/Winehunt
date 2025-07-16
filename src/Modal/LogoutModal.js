import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {Colors, Fonts} from '../constant/Styles';
import WineHuntButton from '../common/WineHuntButton';

const LogoutModal = ({isVisible, onLogout, onCancel}) => {
  return (
    <Modal
      isVisible={isVisible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.5}
      useNativeDriver
      onBackdropPress={onCancel}
      style={styles.modal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.dragIndicator} />
        <Text style={styles.title} allowFontScaling={false}>
          Logout ?
        </Text>
        <Image
          source={require('../screens/Profile/images/map3.png')}
          style={styles.image}
        />
        <Text style={styles.message} allowFontScaling={false}>
          Are you sure you want to Logout?
        </Text>
        <View style={styles.actionItem}>
          <WineHuntButton
            text="Cancel"
            extraButtonStyle={[styles.cancelButton]}
            extraTextStyle={styles.cancelText}
            onPress={onCancel}
          />
          <WineHuntButton
            text="Logout"
            extraButtonStyle={styles.deleteButton}
            onPress={onLogout}
          />
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#790e32',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
    gap: 18,
  },
  dragIndicator: {
    height: 5,
    width: 50,
    backgroundColor: Colors.gray10,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    color: '#790e32',
    fontFamily: Fonts.InterBold,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  image: {
    height: 80,
    width: 80,
    alignSelf: 'center',
    marginVertical: 6,
  },
  message: {
    fontSize: 15,
    color: '#790e32',
    fontFamily: Fonts.InterMedium,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 2,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 10,
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#fff',
    flex: 1,
    borderWidth: 1,
    borderColor: '#E6EBF1',
    borderRadius: 10,
    marginRight: 0,
    paddingVertical: 10,
  },
  cancelText: {
    color: '#790e32',
    fontWeight: '700',
  },
  deleteButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#790e32',
    backgroundColor: '#790e32',
    borderRadius: 10,
    marginLeft: 0,
    paddingVertical: 10,
  },
});
