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
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item?.title}</Text>
          <Text style={styles.subtitle}>{item?.user?.shop_name}</Text>
          <Text style={styles.description}>
            {item?.name}{' '}
            <Text style={styles.highlightedText}>{item?.type?.name}</Text>
          </Text>
          <Text style={styles.price}>$ {item?.price_mappings[0]?.price}</Text>
          <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>View More</Text>
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
    minHeight: 130,
  },
  backgroundImage: {
    height: 90,
    width: 60,
    position: 'absolute',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  bottleImage: {
    width: 30,
    height: 100,
  },
  textContainer: {
    gap: 10,
  },
  title: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray8,
    fontFamily: Fonts.InterRegular,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '600',
  },
  highlightedText: {
    color: Colors.red,
  },
  price: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
    fontWeight: '600',
  },
  button: {
    padding: 5,
    backgroundColor: Colors.red,
    alignItems: 'center',
    borderRadius: 20,
    borderBottomLeftRadius: 0,
  },
  buttonText: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
  },
});
