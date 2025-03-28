import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {Colors, Fonts} from '../constant/Styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ActionModal = ({
  showActionModal,
  setShowActionModal,
  onDelete,
  onEdit,
}) => {
  const inset = useSafeAreaInsets();

  return (
    <Modal
      animationIn="fadeInUp"
      animationInTiming={500}
      backdropOpacity={0.5}
      animationOutTiming={500}
      animationOut="fadeOutDown"
      isVisible={showActionModal}
      style={styles.modal}
      onBackdropPress={() => setShowActionModal(false)}>
      <View style={[styles.modalContent, {paddingBottom: inset.bottom}]}>
        <View style={styles.dragIndicator} />
        <Pressable style={styles.actionItem} onPress={onEdit}>
          <Image
            source={require('../screens/Profile/images/editIcon2.png')}
            style={styles.icon}
          />
          <Text style={styles.actionText} allowFontScaling={false}>
            Edit
          </Text>
        </Pressable>
        <Pressable style={styles.actionItem} onPress={onDelete}>
          <Image
            source={require('../screens/Profile/images/trash.png')}
            style={styles.icon}
          />
          <Text style={styles.actionText} allowFontScaling={false}>
            Delete
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default ActionModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalContent: {
    padding: 20,
    backgroundColor: Colors.white,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    gap: 10,
  },
  dragIndicator: {
    height: 5,
    width: 50,
    backgroundColor: Colors.gray10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  actionItem: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    height: 20,
    width: 20,
  },
  actionText: {
    fontSize: 14,
    color: Colors.red,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
  },
});
