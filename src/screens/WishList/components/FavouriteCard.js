import {Alert, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../../constant/Styles';
import WineHuntButton from '../../../common/WineHuntButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

const FavouriteCard = ({item, type, onPress}) => {
  return (
    <>
      {type == 'Vendors' ? (
        <View style={styles.cardContainer}>
          <Image
            source={require('../images/wine.png')}
            style={styles.vendorImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.vendorName}>{item?.vendor?.shop_name}</Text>
            <Text style={styles.vendorDescription}>Best Rated this Month</Text>
            <View style={styles.ratingRow}>
              <AntDesign name="star" size={15} color={Colors.yellow} />
              <Text style={styles.ratingText}>4.3 | 120 Review</Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexDirection: 'column',
            }}>
            <Pressable onPress={onPress}>
              <Image
                source={require('../images/delete.png')}
                style={styles.deleteIcon}
                resizeMode="contain"
              />
            </Pressable>
            <View style={styles.distanceRow}>
              <Feather name="navigation" size={15} color={Colors.black} />
              <Text style={styles.distanceText}>2.5 Km</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.cardContainer}>
          <Image
            source={
              item?.product?.product_images[0]?.image
                ? {uri: item?.product?.product_images[0]?.image}
                : require('../images/bottle4.png')
            }
            style={styles.bottleImage}
            resizeMode="contain"
          />

          <View style={styles.cardDetailsContainer}>
            <Text style={styles.cardTitle}>
              {item?.product?.name} ({item?.product?.title})
            </Text>
            <Text style={styles.cardPrice}>$12.00</Text>
            {/* <WineHuntButton
              text="Add to cart"
              extraButtonStyle={styles.addToCartButton}
              extraTextStyle={styles.addToCartText}
              onPress={() => Alert.alert('Product Added !!')}
            /> */}
          </View>

          <View style={styles.cardActionsContainer}>
            <Pressable onPress={onPress}>
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
      )}
    </>
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
    alignItems: 'flex-end',
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

  vendorImage: {
    height: 65,
    width: 65,
  },
  textContainer: {
    gap: 5,
    flex: 1,
  },
  vendorName: {
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
    fontSize: 16,
  },
  vendorDescription: {
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    fontSize: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingText: {
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    fontSize: 12,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  distanceText: {
    color: Colors.black,
    fontSize: 12,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
  },
});
