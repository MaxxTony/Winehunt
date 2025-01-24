import {
  View,
  Text,
  Modal,
  Pressable,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import Lottie from 'lottie-react-native';

const Loader = props => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        props.setModalVisible(!props.modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Lottie
            source={require('../../assets/json/loader.json')}
            autoPlay
            loop
            autoSize
            style={{width: 100, height: 100}}
          />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'transparent',
    borderRadius: 20,
    alignItems: 'center',
    // shadowColor: 'transparent',
    // elevation: 5,
  },
});
