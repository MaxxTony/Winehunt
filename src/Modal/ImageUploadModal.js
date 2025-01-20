import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {Colors, Fonts} from '../constant/Styles';

const ImageUploadModal = ({
  isImageModal,
  setIsImageModal,
  onCameraPress,
  onGalleryPress,
  heading,
  desc,
}) => {
  return (
    <Modal
      animationIn="fadeInRight"
      animationInTiming={500}
      backdropOpacity={0.5}
      animationOutTiming={500}
      animationOut="fadeOutRight"
      isVisible={isImageModal}
      onBackdropPress={() => setIsImageModal(false)}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{heading}</Text>
        <Text style={styles.modalDescription}>{desc}</Text>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={onGalleryPress}>
            <Text style={styles.buttonText}>Choose Photo</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={onCameraPress}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ImageUploadModal;

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    gap: 10,
  },
  modalTitle: {
    ...Fonts.InterBold,
    fontSize: 15,
    color: Colors.black,
    fontWeight: 'bold',
  },
  modalDescription: {
    ...Fonts.InterMedium,
    fontSize: 15,
    color: Colors.gray9,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'flex-end',
  },
  button: {
    padding: 10,
    backgroundColor: Colors.red,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    ...Fonts.InterMedium,
    fontSize: 14,
    color: Colors.white,
    textTransform: 'uppercase',
  },
});
