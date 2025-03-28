import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../constant/Styles';
import WineHuntButton from '../common/WineHuntButton';

const DeleteModal = ({onDelete, onCancel}) => {
  return (
    <View style={styles.container}>
      <View style={styles.dragIndicator} />
      <Text style={styles.title} allowFontScaling={false}>
        Delete Address
      </Text>
      <Image
        source={require('../screens/Profile/images/map3.png')}
        style={styles.image}
      />
      <Text style={styles.message} allowFontScaling={false}>
        Are you sure you want to delete this address?
      </Text>
      <View style={styles.actionItem}>
        <WineHuntButton
          text="Cancel"
          extraButtonStyle={[styles.cancelButton]}
          extraTextStyle={styles.cancelText}
          onPress={onCancel}
        />
        <WineHuntButton
          text="Delete"
          extraButtonStyle={styles.deleteButton}
          onPress={onDelete}
        />
      </View>
    </View>
  );
};

export default DeleteModal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: '#fff',
    elevation: 6,
  },
  dragIndicator: {
    height: 5,
    width: 50,
    backgroundColor: Colors.gray10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
    textAlign: 'center',
  },
  image: {
    height: 70,
    width: 70,
    alignSelf: 'center',
  },
  message: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  cancelButton: {
    backgroundColor: Colors.white,
    flex: 0.5,
    borderWidth: 1,
    borderColor: '#E6EBF1',
  },
  cancelText: {
    color: Colors.black,
  },
  deleteButton: {
    flex: 0.5,
    borderWidth: 1,
    borderColor: Colors.red,
  },
});
