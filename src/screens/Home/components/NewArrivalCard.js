import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../../constant/Styles';

const NewArrivalCard = ({onPress, item}) => {
  return (
    <View style={{alignItems: 'center', gap: 5}}>
      <View
        style={{
          padding: 10,
          backgroundColor: '#ddcbce',
          height: 100,
          width: 100,
          alignItems: 'center',
          borderRadius: 100,
        }}>
        {item?.product_images && (
          <Image
            source={
              item?.product_images[0]?.image
                ? {uri: item?.product_images[0]?.image}
                : require('../images/bottle2.png')
            }
            style={{height: 85, width: 24}}
          />
        )}
      </View>
      <Text
        style={{
          fontSize: 14,
          color: Colors.black,
          fontFamily: Fonts.InterRegular,
          fontWeight: '600',
        }}
        numberOfLines={1} allowFontScaling={false}>
        {item?.title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: Colors.red,
          fontFamily: Fonts.InterRegular,
          fontWeight: '600',
        }}
        onPress={onPress} allowFontScaling={false}>
        View More
      </Text>
    </View>
  );
};

export default NewArrivalCard;

const styles = StyleSheet.create({});
