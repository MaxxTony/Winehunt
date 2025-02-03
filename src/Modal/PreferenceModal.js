import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
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
}) => {
  return (
    <Modal
      animationIn="fadeInUp"
      animationInTiming={500}
      backdropOpacity={0.5}
      animationOutTiming={500}
      animationOut="fadeOutDown"
      isVisible={showModal}
      style={{margin: 0}}
      onBackdropPress={() => setShowModal(false)}>
      <View
        style={{
          padding: 20,
          backgroundColor: Colors.white,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          gap: 10,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontFamily: Fonts.PhilosopherBold,
            color: Colors.black,
          }}>
          Customise as your preference
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontFamily: Fonts.InterBold,
            color: Colors.red,
          }}>
          Choose Size
        </Text>
        <FlatList
          data={sizeList}
          contentContainerStyle={{gap: 10}}
          renderItem={({item, index}) => {
            return (
              <Pressable
                key={index}
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}
                onPress={() => setSize(item?.id)}>
                <Ionicons
                  name={
                    size == item?.id ? 'radio-button-on' : 'radio-button-off'
                  }
                  size={20}
                  color={size == item?.id ? Colors.red : Colors.gray}
                />
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: Fonts.InterBold,
                    color: Colors.black,
                    flex: 1,
                  }}>
                  {item?.name}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: Fonts.InterBold,
                    color: Colors.black,
                  }}>
                  $10
                </Text>
              </Pressable>
            );
          }}
        />
        <Text
          style={{
            fontSize: 13,
            fontFamily: Fonts.InterBold,
            color: Colors.red,
          }}>
          Choose Add on
        </Text>
        <FlatList
          data={AddonList}
          contentContainerStyle={{gap: 10}}
          renderItem={({item, index}) => {
            return (
              <Pressable
                key={index}
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}
                onPress={() => setAddOn(item?.id)}>
                <Ionicons
                  name={
                    addOn == item?.id ? 'radio-button-on' : 'radio-button-off'
                  }
                  size={20}
                  color={addOn == item?.id ? Colors.red : Colors.gray}
                />
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: Fonts.InterBold,
                    color: Colors.black,
                    flex: 1,
                  }}>
                  {item?.name}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: Fonts.InterBold,
                    color: Colors.black,
                  }}>
                  $10
                </Text>
              </Pressable>
            );
          }}
        />
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <View
            style={{
              padding: 8,
              borderWidth: 1,
              borderColor: Colors.gray5,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              flex: 0.3,
              borderRadius: 10,
              justifyContent: 'center',
            }}>
            <AntDesign name="minussquare" size={25} color={Colors.gray15} />
            <Text
              style={{
                fontSize: 13,
                fontFamily: Fonts.InterBold,
                color: Colors.black,
              }}>
              1
            </Text>
            <AntDesign name="plussquare" size={25} color={Colors.gray15} />
          </View>
          <WineHuntButton
            text="Add Items"
            extraButtonStyle={{padding: 11, flex: 0.7}}
            onPress={() => setShowModal(false)}
          />
        </View>
      </View>
    </Modal>
  );
};

export default PreferenceModal;

const styles = StyleSheet.create({});
