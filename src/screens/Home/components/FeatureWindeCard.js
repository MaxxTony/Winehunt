import {Alert, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../../constant/Styles';

const FeatureWindeCard = ({item, onPress}) => {
  return (
    <View style={styles.cardContainer}>
      <Image
        source={require('../images/curve.png')}
        style={styles.backgroundImage}
      />
      <View style={styles.contentRow}>
        <Image
          source={{uri: item?.product_images[0]?.image}}
          style={styles.bottleImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} allowFontScaling={false}>
            {item?.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1} allowFontScaling={false}>
            {item?.user?.shop_name}
          </Text>
          <Text style={styles.description} numberOfLines={1} allowFontScaling={false}>
            {item?.name}{' '}
            <Text style={styles.highlightedText} allowFontScaling={false}>{item?.type?.name}</Text>
          </Text>
          <Text style={styles.price} numberOfLines={1} allowFontScaling={false}>
            $ {item?.price_mappings[0]?.price}
          </Text>
          <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText} allowFontScaling={false}>View More</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default FeatureWindeCard;

const styles = StyleSheet.create({
  cardContainer: {
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    backgroundColor: Colors.white,
    elevation: 2,
    borderRadius: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    gap: 10,
    minHeight: 140,
    width: 250,
    margin: 5,
  },
  backgroundImage: {
    height: 90,
    width: 60,
    position: 'absolute',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flex: 1,
  },
  bottleImage: {
    width: 40,
    height: 120,
    backgroundColor: 'transparent',
  },
  textContainer: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 13,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '600',
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.gray8,
    fontFamily: Fonts.InterRegular,
    fontWeight: '600',
    flexShrink: 1,
  },
  description: {
    fontSize: 12,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '600',
    flexShrink: 1,
  },
  highlightedText: {
    color: Colors.red,
  },
  price: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
    fontWeight: '600',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.red,
    alignItems: 'center',
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
  },
});
