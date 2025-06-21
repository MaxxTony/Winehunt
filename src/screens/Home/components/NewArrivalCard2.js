import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import {Colors, Fonts} from '../../../constant/Styles';

const {width} = Dimensions.get('window');

const NewArrivalCard2 = ({onPress, item, onWishlistPress}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [isWishlisted, setIsWishlisted] = useState(item?.is_wishlist || false);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleWishlistPress = () => {
    setIsWishlisted(!isWishlisted);
    if (onWishlistPress) {
      onWishlistPress(item?.id, !isWishlisted);
    }
  };

  const calculateDiscountPercentage = () => {
    if (item?.has_discount && item?.actual_price && item?.price) {
      return Math.round(((item.actual_price - item.price) / item.actual_price) * 100);
    }
    return 0;
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: fadeAnim,
          transform: [
            {translateY: slideAnim},
            {scale: scaleAnim},
          ],
        },
      ]}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Discount badge */}
      {item?.has_discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            -{calculateDiscountPercentage()}%
          </Text>
        </View>
      )}

   

      <View style={styles.contentContainer}>
        {/* Wine bottle image */}
        <View style={styles.imageContainer}>
          <Image
            source={
              item?.product_images?.[0]?.image
                ? {uri: item.product_images[0].image}
                : require('../images/bottle.png')
            }
            style={styles.bottleImage}
            resizeMode="contain"
          />
          {/* Image overlay for better text readability */}
          <View style={styles.imageOverlay} />
        </View>

        {/* Content section */}
        <View style={styles.textContainer}>
          {/* Wine name and type */}
          <View style={styles.titleSection}>
            <Text style={styles.wineName} numberOfLines={1} allowFontScaling={false}>
              {item?.name || 'Wine Name'}
            </Text>
           
          </View>

          {/* Shop name */}
          <Text style={styles.shopName} numberOfLines={1} allowFontScaling={false}>
            {item?.user?.shop_name || 'Wine Shop'}
          </Text>

          {/* Description */}
          <Text style={styles.description} numberOfLines={2} allowFontScaling={false}>
            {item?.product_desc || 'Delicious wine description'}
          </Text>

          {/* Price section */}
          <View style={styles.priceSection}>
            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice} allowFontScaling={false}>
                £{item?.price?.toFixed(2) || '0.00'}
              </Text>
              {item?.has_discount && (
                <Text style={styles.originalPrice} allowFontScaling={false}>
                  £{item?.actual_price?.toFixed(2) || '0.00'}
                </Text>
              )}
            </View>
            
            {/* Offer badge */}
            {item?.has_offer && (
              <View style={styles.offerBadge}>
                <Text style={styles.offerText}>
                  {item?.offer_discount}% OFF
                </Text>
              </View>
            )}
          </View>

          {/* Action button */}
          <Pressable
            style={styles.viewMoreButton}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}>
            <Text style={styles.buttonText} allowFontScaling={false}>
              View Details
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

export default NewArrivalCard2;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 8,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
    minHeight: 180,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.lightPink,
    opacity: 0.1,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.red,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 10,
  },
  discountText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: Fonts.InterBold,
    fontWeight: '700',
  },
  wishlistButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  heartIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heartIconActive: {
    backgroundColor: Colors.red,
  },
  heartText: {
    fontSize: 16,
    color: Colors.gray8,
  },
  heartTextActive: {
    color: Colors.white,
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  imageContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottleImage: {
    width: 60,
    height: 140,
    borderRadius: 8,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    gap: 8,
  },
  titleSection: {
    gap: 2,
  },
  wineName: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
    fontWeight: '700',
    lineHeight: 20,
  },
  wineType: {
    fontSize: 12,
    color: Colors.red,
    fontFamily: Fonts.InterMedium,
    fontWeight: '600',
  },
  shopName: {
    fontSize: 11,
    color: Colors.gray8,
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
  },
  description: {
    fontSize: 11,
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    lineHeight: 16,
    flex: 1,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap:10
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentPrice: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 14,
    color: Colors.gray8,
    fontFamily: Fonts.InterRegular,
    textDecorationLine: 'line-through',
  },
  offerBadge: {
    backgroundColor: Colors.lightGreen,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  offerText: {
    fontSize: 9,
    color: Colors.green,
    fontFamily: Fonts.InterBold,
    fontWeight: '700',
  },
  viewMoreButton: {
    backgroundColor: Colors.red,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 4,
    shadowColor: Colors.red,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: Fonts.InterBold,
    fontWeight: '600',
  },
});
