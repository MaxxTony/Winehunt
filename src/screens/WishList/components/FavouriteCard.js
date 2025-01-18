import {Alert, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../../constant/Styles';
import WineHuntButton from '../../../common/WineHuntButton';
import AntDesign from 'react-native-vector-icons/AntDesign';

const FavouriteCard = () => {
  return (
    <View style={styles.cardContainer}>
      <Image
        source={require('../images/bottle4.png')}
        style={styles.bottleImage}
        resizeMode="contain"
      />
      <View style={styles.cardDetailsContainer}>
        <Text style={styles.cardTitle}>Eva (White Grape juice)</Text>
        <Text style={styles.cardPrice}>$12.00</Text>
        <WineHuntButton
          text="Add to cart"
          extraButtonStyle={styles.addToCartButton}
          extraTextStyle={styles.addToCartText}
          onPress={() => Alert.alert('Product Added !!')}
        />
      </View>
      <View style={styles.cardActionsContainer}>
        <Pressable onPress={() => Alert.alert('Delete from list')}>
          <Image
            source={require('../images/delete.png')}
            style={styles.deleteIcon}
            resizeMode="contain"
          />
        </Pressable>
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={18} color={Colors.yellow} />
          <Text style={styles.ratingText}>4.3</Text>
        </View>
      </View>
    </View>
  );
};

export default FavouriteCard;

const styles = StyleSheet.create({
  cardContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray2,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
    elevation: 5,
  },
  bottleImage: {
    height: 80,
    width: 30,
  },
  cardDetailsContainer: {
    gap: 5,
    flex: 1,
  },
  cardTitle: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontWeight: '500',
    fontSize: 16,
  },
  cardPrice: {
    fontFamily: Fonts.InterMedium,
    color: Colors.gray7,
    fontWeight: '500',
    fontSize: 13,
  },
  addToCartButton: {
    padding: 5,
    alignSelf: 'flex-start',
    borderRadius: 5,
    paddingHorizontal: 8,
    marginTop: 'auto',
  },
  addToCartText: {
    fontSize: 12,
  },
  cardActionsContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  deleteIcon: {
    height: 18,
    width: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.black,
  },
});
