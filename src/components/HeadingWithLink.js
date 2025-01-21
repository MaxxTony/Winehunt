import {Alert, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../constant/Styles';

const HeadingWithLink = props => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Text
        style={{
          color: Colors.black,
          fontFamily: Fonts.PhilosopherBold,
          fontWeight: '500',
          fontSize: 18,
        }}>
        {props?.title}
      </Text>
      <Text
        style={{
          color: Colors.red2,
          fontFamily: Fonts.InterRegular,
          fontWeight: '500',
          fontSize: 15,
        }}
        onPress={props?.onPress}>
        See all
      </Text>
    </View>
  );
};

export default HeadingWithLink;

const styles = StyleSheet.create({});
