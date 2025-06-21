import {
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../../constant/Styles';

const {width} = Dimensions.get('window');

const NewArrivalCard = ({onPress, item}) => {
  const formatPrice = (price) => {
    return `£${parseFloat(price).toFixed(2)}`;
  };

  const calculateDiscountedPrice = (originalPrice, discount) => {
    if (!discount || discount <= 0) return originalPrice;
    return originalPrice - (originalPrice * discount / 100);
  };

  const hasDiscount = item?.has_discount && item?.discount > 0;
  const originalPrice = item?.actual_price || item?.price;
  const discountedPrice = hasDiscount 
    ? calculateDiscountedPrice(originalPrice, item?.discount)
    : originalPrice;

  return (
    <Pressable style={styles.cardContainer} onPress={onPress}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={
            item?.product_images?.[0]?.image
              ? {uri: item?.product_images[0]?.image}
              : require('../images/bottle2.png')
          }
          style={styles.productImage}
          resizeMode="contain"
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discount}%</Text>
          </View>
        )}

        
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Wine Name */}
        <Text style={styles.wineName} numberOfLines={1} allowFontScaling={false}>
          {item?.name || 'Wine Name'}
        </Text>

        {/* Shop Name */}
        <Text style={styles.shopName} numberOfLines={1} allowFontScaling={false}>
          {item?.user?.shop_name || 'Wine Shop'}
        </Text>

        {/* Price Container */}
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice} allowFontScaling={false}>
            {formatPrice(discountedPrice)}
          </Text>
          
          {hasDiscount && (
            <Text style={styles.originalPrice} allowFontScaling={false}>
              {formatPrice(originalPrice)}
            </Text>
          )}
        </View>

        {/* View More Button */}
        <Pressable style={styles.viewMoreButton} onPress={onPress}>
          <Text style={styles.viewMoreText} allowFontScaling={false}>
            View Details
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

export default NewArrivalCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.4,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.gray12,
    overflow: 'hidden',
    marginBottom:10
  },
  imageContainer: {
    height: 140,
    backgroundColor: Colors.lightPink,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  productImage: {
    height: 120,
    width: 60,
    resizeMode: 'contain',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
  },
  discountText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: Fonts.InterBold,
    fontWeight: '700',
  },
  contentContainer: {
    padding: 12,
    gap: 4,
  },
  wineName: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
    fontWeight: '700',
    lineHeight: 18,
  },
  shopName: {
    fontSize: 11,
    color: Colors.gray8,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    lineHeight: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  currentPrice: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 12,
    color: Colors.gray8,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    textDecorationLine: 'line-through',
  },
  viewMoreButton: {
    backgroundColor: Colors.red,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.red,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  viewMoreText: {
    color: Colors.white,
    fontSize: 11,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
  },
});
