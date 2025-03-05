import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts} from '../constant/Styles';
import WineHuntButton from '../common/WineHuntButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

const PreferenceModal = ({
  showModal,
  setShowModal,
  sizeList,
  setSize,
  size,
  AddonList,
  setAddOn,
  addOn,
  quantity,
  setQuantity,
  onAdd,
}) => {
  const increaseQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <Modal
      animationIn="fadeInUp"
      animationInTiming={500}
      backdropOpacity={0.5}
      animationOutTiming={500}
      animationOut="fadeOutDown"
      isVisible={showModal}
      style={styles.modal}
      onBackdropPress={() => setShowModal(false)}>
      <View style={styles.container}>
        {/* <Text style={styles.title}>Customise as your preference</Text> */}
        {/* <Text style={styles.sectionTitle}>Choose Size</Text> */}
        {/* <FlatList
          data={sizeList}
          contentContainerStyle={styles.listContainer}
          renderItem={({item}) => (
            <Pressable style={styles.itemRow} onPress={() => setSize(item?.id)}>
              <Ionicons
                name={size == item?.id ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={size == item?.id ? Colors.red : Colors.gray}
              />
              <Text style={styles.itemText}>{item?.name}</Text>
              <Text style={styles.itemPrice}>${item?.price}</Text>
            </Pressable>
          )}
        /> */}
        {/* <Text style={styles.sectionTitle}>Choose Add on</Text> */}
        {/* <FlatList
          data={AddonList}
          contentContainerStyle={styles.listContainer}
          renderItem={({item}) => (
            <Pressable
              style={styles.itemRow}
              onPress={() => setAddOn(item?.id)}>
              <Ionicons
                name={
                  addOn == item?.id ? 'radio-button-on' : 'radio-button-off'
                }
                size={20}
                color={addOn == item?.id ? Colors.red : Colors.gray}
              />
              <Text style={styles.itemText}>{item?.name}</Text>
              <Text style={styles.itemPrice}>${item?.price}</Text>
            </Pressable>
          )}
        /> */}
        <View style={styles.footerRow}>
          <View style={styles.quantityContainer}>
            <Pressable onPress={decreaseQuantity}>
              <AntDesign name="minussquare" size={25} color={Colors.gray15} />
            </Pressable>
            <Text style={styles.quantityText}>{quantity}</Text>
            <Pressable onPress={increaseQuantity}>
              <AntDesign name="plussquare" size={25} color={Colors.gray15} />
            </Pressable>
          </View>
          <WineHuntButton
            text="Add Items"
            extraButtonStyle={styles.addButton}
            onPress={onAdd}
          />
        </View>
      </View>
    </Modal>
  );
};

export default PreferenceModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  container: {
    padding: 20,
    backgroundColor: Colors.white,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.PhilosopherBold,
    color: Colors.black,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: Fonts.InterBold,
    color: Colors.red,
  },
  listContainer: {
    gap: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemText: {
    fontSize: 13,
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    flex: 1,
  },
  itemPrice: {
    fontSize: 13,
    fontFamily: Fonts.InterBold,
    color: Colors.black,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityContainer: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.gray5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 0.3,
    borderRadius: 10,
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 13,
    fontFamily: Fonts.InterBold,
    color: Colors.black,
  },
  addButton: {
    padding: 11,
    flex: 0.7,
  },
});
