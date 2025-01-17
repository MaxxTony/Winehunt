import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../constant/Styles';
import Fontisto from 'react-native-vector-icons/Fontisto';

const BackNavigationWithTitle = props => {
  return (
    <View style={[styles.container, props?.extraStyle]}>
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal: 20,
          paddingVertical: 5,
        }}
        onPress={props?.onPress}>
        <Fontisto name="angle-left" size={20} color={Colors.black} />
        <Text
          style={{
            fontSize: 20,
            color: Colors.black,
            fontFamily: Fonts.InterMedium,
            fontWeight: '500',
          }}>
          {props?.title}
        </Text>
      </Pressable>
    </View>
  );
};

export default BackNavigationWithTitle;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 2,
    paddingBottom: 10,
    borderColor: Colors.gray2,
  },
});
