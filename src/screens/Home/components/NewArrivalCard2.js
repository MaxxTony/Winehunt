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

const NewArrivalCard2 = () => {
  return (
    <View style={styles.cardContainer}>
      <Image
        source={require('../images/curve.png')}
        style={styles.backgroundImage}
      />
      <View style={styles.contentRow}>
        <Image
          source={require('../images/bottle2.png')}
          style={styles.bottleImage}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Château Margaux</Text>
          <Text style={styles.subtitle}>(Restaurant)</Text>
          <Text style={styles.description}>
            Taylors <Text style={styles.highlightedText}>(Port Wine)</Text>
          </Text>
          <Text style={styles.price}>$ 25.99</Text>
          <Pressable
            style={styles.button}
            onPress={() => Alert.alert('Coming soon')}>
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
