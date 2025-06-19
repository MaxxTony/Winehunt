import {Alert, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../../constant/Styles';

const WineCard = ({item, onPress}) => {
  // Helper to get background image
  const getBackgroundImage = () => {
    if (item?.background_image) {
      return { uri: item.background_image.startsWith('http') ? item.background_image : `http://13.48.249.80/winehunt/laravel/public/storage/${item.background_image}` };
    }
    return require('../images/curve.png');
  };

  // Helper to get bottle image
  const getBottleImage = () => {
    if (item?.product_images?.[0]?.image) {
      return { uri: item.product_images[0].image };
    }
    return require('../images/curve.png');
  };

  // Calculate discounted price
  const getDiscountedPrice = () => {
    if (item.has_discount && item.discount && item.actual_price) {
      return (item.actual_price - item.discount).toFixed(2);
    }
    return item.price;
  };

  return (
    <Pressable style={styles.cardContainer} onPress={onPress}>
      {/* Background Image */}
      <Image source={getBackgroundImage()} style={styles.backgroundImage} resizeMode="cover" />
     
      {/* Discount/Offer Badges */}
      <View style={styles.badgeRow}>
        {/* Combined Emoji and Badge Text */}
        {item.has_discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.badgeText}>🏆 MileStone Offer</Text>
          </View>
        )}
        {item.has_offer && (
          <View style={styles.offerBadge}>
            <Text style={styles.badgeText}>🏷️ Special Offer</Text>
          </View>
        )}
      </View>
      <View style={styles.contentRow}>
        <Image source={getBottleImage()} style={styles.bottleImage}  />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} allowFontScaling={false}>
            {item?.name}
          </Text>
          <Text style={styles.vendorType} allowFontScaling={false}>
            {item?.user?.vendor_shop_type?.name ? item.user.vendor_shop_type.name : 'Restaurant'}
          </Text>
          <Text style={styles.subtitle} allowFontScaling={false}>
            {item?.user?.shop_name ? item.user.shop_name : 'Unknown Shop'}
          </Text>
          <Text style={styles.description} numberOfLines={2} allowFontScaling={false}>
            {item?.product_desc}
          </Text>
          <View style={styles.priceRow}>
            {item.has_discount && item.actual_price && (
              <Text style={styles.oldPrice} allowFontScaling={false}>
                € {item.actual_price}
              </Text>
            )}
            <Text style={styles.price} allowFontScaling={false}>
              € {getDiscountedPrice()}
            </Text>
          </View>
          <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText} allowFontScaling={false}>
              View More
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default WineCard;

const styles = StyleSheet.create({
  cardContainer: {
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    backgroundColor: Colors.white,
    elevation: 3,
    borderRadius: 14,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    minHeight: 160,
    marginBottom: 16,
    overflow: 'hidden',
  },
  backgroundImage: {
    height: 80,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.08,
  },
  badgeRow: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    gap: 6,
  },
  discountBadge: {
    backgroundColor: Colors.red,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
  },
  offerBadge: {
    backgroundColor: Colors.gray8,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 13,
    fontFamily: Fonts.InterBold,
  },
  wishlistIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 18,
    marginTop: 25,
  },
  bottleImage: {
    width: 50,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
    fontWeight: '700',
    marginBottom: 2,
  },
  vendorType: {
    fontSize: 13,
    color: Colors.red,
    fontFamily: Fonts.InterBold,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.gray8,
    fontFamily: Fonts.InterBold,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    marginBottom: 2,
  },
  highlightedText: {
    color: Colors.red,
    fontSize: 12,
    fontFamily: Fonts.InterBold,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  oldPrice: {
    fontSize: 12,
    color: Colors.gray8,
    fontFamily: Fonts.InterRegular,
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  price: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
    fontWeight: '700',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    backgroundColor: Colors.red,
    alignItems: 'center',
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  buttonText: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
  },
});
