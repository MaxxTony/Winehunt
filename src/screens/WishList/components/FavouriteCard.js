import {Alert, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../../constant/Styles';
import WineHuntButton from '../../../common/WineHuntButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';

const FavouriteCard = ({item, type, onPress}) => {
  const navigation = useNavigation();

  return (
    <>
      {type == 'Vendors' ? (
        <Pressable
          style={styles.cardContainer}
          onPress={() => {
           
            navigation.navigate('VendorDetail', {
              item: item?.vendor,
              userCoordinates: {
                latitude: item?.vendor?.latitude,
                longitude: item?.vendor?.longitude,
              },
            });
          }}>
          <Image
            source={
              item?.vendor?.image
                ? {uri: item?.vendor?.image}
                : require('../images/wine.png')
            }
            style={styles.vendorImage}
          />
          <View style={styles.vendorInfoContainer}>
            <Text
              style={styles.vendorName}
              allowFontScaling={false}
              numberOfLines={1}>
              {item?.vendor?.shop_name}
            </Text>
            {item?.vendor?.description ? (
              <Text
                style={styles.vendorDescription}
                allowFontScaling={false}
                numberOfLines={1}>
                {item?.vendor?.description}
              </Text>
            ) : null}
            {item?.vendor?.address ? (
              <View style={styles.vendorRow}>
                <Feather
                  name="map-pin"
                  size={13}
                  color={Colors.gray7}
                  style={{marginRight: 3}}
                />
                <Text
                  style={styles.vendorAddress}
                  allowFontScaling={false}
                  numberOfLines={1}>
                  {item?.vendor?.address}
                </Text>
              </View>
            ) : null}
            {item?.vendor?.phone ? (
              <View style={styles.vendorRow}>
                <Feather
                  name="phone"
                  size={13}
                  color={Colors.gray7}
                  style={{marginRight: 3}}
                />
                <Text
                  style={styles.vendorPhone}
                  allowFontScaling={false}
                  numberOfLines={1}>
                  {item?.vendor?.country_code} {item?.vendor?.phone}
                </Text>
              </View>
            ) : null}
            <View style={styles.vendorRow}>
              <AntDesign
                name="star"
                size={14}
                color={Colors.yellow}
                style={{marginRight: 3}}
              />
              <Text style={styles.vendorReviewText} allowFontScaling={false}>
                {item?.vendor?.total_reviews} Review
                {item?.vendor?.total_reviews === 1 ? '' : 's'}
              </Text>
            </View>
          </View>
          <View style={styles.vendorActionsContainer}>
            <Pressable onPress={onPress} hitSlop={10}>
              <Image
                source={require('../images/delete.png')}
                style={styles.deleteIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </Pressable>
      ) : (
        <Pressable
          style={styles.cardContainer}
          onPress={() =>
            navigation.navigate('WineDetail', {item: item?.product?.id})
          }>
          <Image
            source={
              item?.product?.product_images[0]?.image
                ? {uri: item?.product?.product_images[0]?.image}
                : require('../images/bottle4.png')
            }
            style={styles.bottleImage}
          />

          <View style={styles.cardDetailsContainer}>
            <Text style={styles.cardTitle} allowFontScaling={false}>
              {item?.product?.name}
              {item?.product?.title ? ` (${item?.product?.title})` : ''}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
              {item?.product?.discount &&
              Number(item?.product?.discount) > 0 ? (
                <>
                  <Text
                    style={styles.cardOriginalPrice}
                    allowFontScaling={false}>
                    £ {parseFloat(item?.product?.price).toFixed(2)}
                  </Text>
                  <Text
                    style={styles.cardDiscountPrice}
                    allowFontScaling={false}>
                    £{' '}
                    {(
                      parseFloat(item?.product?.price) -
                      parseFloat(item?.product?.discount)
                    ).toFixed(2)}
                  </Text>
                </>
              ) : (
                <Text style={styles.cardPrice} allowFontScaling={false}>
                  £ {item?.price !== null ? item?.price : item?.product?.price}
                </Text>
              )}
            </View>
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
              <Text style={styles.ratingText} allowFontScaling={false}>
                {item?.product?.average_rating}
              </Text>
            </View>
            <Text style={styles.reviewText} allowFontScaling={false}>
              {item?.product?.total_reviews > 0
                ? `${item?.product?.total_reviews} Review${
                    item?.product?.total_reviews === 1 ? '' : 's'
                  }`
                : 'No reviews yet'}
            </Text>
          </View>
        </Pressable>
      )}
    </>
  );
};

export default FavouriteCard;

const styles = StyleSheet.create({
  cardContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.gray2,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
    elevation: 3,
    alignItems: 'center',
    marginBottom: 8,
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
    marginBottom: 10,
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
    borderRadius: 100,
    backgroundColor: Colors.gray2,
  },
  vendorInfoContainer: {
    flex: 1,
    gap: 3,
    justifyContent: 'center',
  },
  vendorName: {
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 1,
  },
  vendorDescription: {
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    fontSize: 12,
    marginBottom: 1,
  },
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  vendorAddress: {
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    fontSize: 11,
    flex: 1,
  },
  vendorPhone: {
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    fontSize: 11,
  },
  vendorReviewText: {
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    fontSize: 12,
  },
  vendorActionsContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'column',
    height: 65,
  },
  cardOriginalPrice: {
    fontFamily: Fonts.InterMedium,
    color: Colors.gray7,
    fontWeight: '500',
    fontSize: 13,
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  cardDiscountPrice: {
    fontFamily: Fonts.InterMedium,
    color: Colors.red || '#E53935',
    fontWeight: '700',
    fontSize: 14,
  },
  reviewText: {
    fontSize: 12,
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    marginTop: 2,
  },
});
