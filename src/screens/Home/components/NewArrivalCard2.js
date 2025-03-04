import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../../constant/Styles';

const NewArrivalCard2 = ({onPress, item}) => {
  console.log(item);
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
              : require('../images/curve.png')
          }
          style={styles.bottleImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {item?.name}
          </Text>
          <Text style={styles.subtitle}>
            ({item?.user?.shop_name ? item?.user?.shop_name : 'Restaurant'})
          </Text>
          <Text style={styles.description} numberOfLines={1}>
            {item?.name}{' '}
          </Text>
          <Text style={styles.highlightedText}>({item?.title})</Text>
          <Text style={styles.price}>$ 25.99</Text>
          <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>View More</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default NewArrivalCard2;

const styles = StyleSheet.create({
  cardContainer: {
    padding: Platform.OS == 'android' ? 10 : 15,
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
    height: 80,
    width: 50,
    position: 'absolute',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  bottleImage: {
    width: 30,
    height: 120,
  },
  textContainer: {
    gap: 5,
  },
  title: {
    fontSize: 10,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '600',
    width: 100,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.gray8,
    fontFamily: Fonts.InterRegular,
    fontWeight: '600',
  },
  description: {
    fontSize: 10,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '600',
    width: 100,
  },
  highlightedText: {
    color: Colors.red,
    fontSize: 10,
  },
  price: {
    fontSize: 14,
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
    fontSize: 11,
    color: Colors.white,
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
  },
});
