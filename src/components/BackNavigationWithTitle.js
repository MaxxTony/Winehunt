import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../constant/Styles';
import Fontisto from 'react-native-vector-icons/Fontisto';

const BackNavigationWithTitle = props => {
  return (
    <View style={[styles.container, props?.extraStyle]}>
      <Pressable style={styles.backButton} onPress={props?.onPress}>
        <Fontisto name="angle-left" size={20} color={Colors.black} />
        <View>
          <Text style={styles.titleText} allowFontScaling={false}>
            {props?.title}
          </Text>
          {props?.subtitle && (
            <Text style={styles.subtitleText} allowFontScaling={false}>
              {props?.subtitleText || "Write what kind things you like and don’t like ..."}
            </Text>
          )}
        </View>
      </Pressable>

      <View style={styles.rightButtonsContainer}>
        {props?.rightIcon && (
          <Pressable
            onPress={props?.onPressRightIcon}
            style={styles.rightTextButton}>
            <Text style={styles.rightText} allowFontScaling={false}>
              {props?.rightText}
            </Text>
          </Pressable>
        )}

        {props?.review && (
          <Pressable onPress={props?.onPressReview} style={styles.reviewButton}>
            <Text style={styles.reviewText} allowFontScaling={false}>
              {props?.reviewText || 'Add Review'}
            </Text>
          </Pressable>
        )}

        {props?.refund && (
          <Pressable onPress={props?.onPressRefund} style={styles.refundButton}>
            <Text style={styles.refundText} allowFontScaling={false}>
              {props?.refundText || 'Refund'}
            </Text>
          </Pressable>
        )}
      </View>
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
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    borderColor: Colors.gray2,
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  titleText: {
    fontSize: 20,
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
    fontWeight: '500',
  },
  subtitleText: {
    fontSize: 12,
    color: Colors.gray15,
    fontFamily: Fonts.InterMedium,
    fontWeight: '500',
  },
  rightButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  rightTextButton: {
    paddingHorizontal: 10,
  },
  rightText: {
    fontSize: 16,
    color: Colors.red2,
    fontFamily: Fonts.InterMedium,
    fontWeight: '500',
  },
  refundButton: {
    backgroundColor: '#326EFF',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 5,
  },
  refundText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Fonts.InterMedium,
  },
  reviewButton: {
    backgroundColor: Colors.green, // or any color you want
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 5,
  },
  reviewText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Fonts.InterMedium,
  },
});
