import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../constant/Styles';

const WineHuntButton = props => {
  return (
    <Pressable
      style={[styles.submitButton, props?.extraButtonStyle]}
      onPress={props?.onPress}
      {...props}>
      <Text style={[styles.submitButtonText, props?.extraTextStyle]}>
        {props?.text}
      </Text>
    </Pressable>
  );
};

export default WineHuntButton;

const styles = StyleSheet.create({
  submitButton: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: Colors.red,
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
  },
});
