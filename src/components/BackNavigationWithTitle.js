import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
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
          }}
          allowFontScaling={false}>
          {props?.title}
        </Text>
      </Pressable>
      {props?.rightIcon && (
        <Pressable
          onPress={props?.onPressRightIcon}
          style={{paddingHorizontal: 20}}>
          <Text
            style={{
              fontSize: 16,
              color: Colors.red2,
              fontFamily: Fonts.InterMedium,
              fontWeight: '500',
            }}
            allowFontScaling={false}>
            {props?.rightText}
          </Text>
        </Pressable>
      )}
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
    paddingTop: Platform.OS == 'android' ? 10 : 0,
    borderColor: Colors.gray2,
    justifyContent: 'space-between',
  },
});
