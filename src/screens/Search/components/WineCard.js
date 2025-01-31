import {Alert, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../../constant/Styles';

const WineCard = ({item, onPress}) => {
  return (
    <View style={styles.cardContainer}>
      <Image
        source={require('../images/curve.png')}
        style={styles.backgroundImage}
      />
      <View style={styles.contentRow}>
        <Image
          source={
            item?.product_images[0]?.image
              ? {uri: item?.product_images[0]?.image}
              : require('../images/bottle3.png')
          }
          style={styles.bottleImage}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item?.title}</Text>
          <Text style={styles.subtitle}>
            (
            {item?.user?.shop_name !== ''
              ? item?.user?.shop_name
              : 'Restaurant'}
            )
          </Text>
          <Text style={styles.description}>{item?.name}</Text>
          <Text style={styles.highlightedText}>({item?.title})</Text>
          <Text style={styles.price}>$ {item?.small_size_price}</Text>
          <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>View More</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default WineCard;

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
    flex: 0.5,
  },
  backgroundImage: {
    height: 90,
    width: 60,
    position: 'absolute',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  bottleImage: {
    width: 30,
    height: 100,
  },
  textContainer: {
    gap: 10,
  },
  title: {
    fontSize: 13,
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
    fontSize: 12,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '600',
  },
  highlightedText: {
    fontSize: 11,
    color: Colors.red,
    fontFamily: Fonts.InterRegular,
    fontWeight: '600',
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
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
  },
  buttonText: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
  },
});
