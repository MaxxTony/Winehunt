import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../../constant/Styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import haversine from 'haversine';

const formatNumber = num => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num);
};

const shopTypeMeta = {
  1: {name: 'Restaurant', emoji: '🍽️', color: '#FFB74D'},
  2: {name: 'Hotel', emoji: '🏨', color: '#64B5F6'},
  3: {name: 'Winery', emoji: '🍇', color: '#BA68C8'},
  4: {name: 'Wine Bar', emoji: '🍷', color: '#E57373'},
  5: {name: 'Wine Shop', emoji: '🏪', color: '#81C784'},
};

const ShopTypeBadge = ({type}) => {
  if (!type || typeof type !== 'object') return null;
  const meta = shopTypeMeta[type.id] || {
    name: String(type.name || ''),
    emoji: '🏬',
    color: '#F6F8FF',
  };
  return (
    <View style={styles.shopTypeBadge}>
      <Text style={styles.shopTypeEmoji}>{meta.emoji}</Text>
      <Text style={styles.shopTypeText}>{meta.name}</Text>
    </View>
  );
};

const NearVendorCards = ({item, navigation, userCoordinates}) => {


  
  const vendorCoordinates = {
    latitude: parseFloat(item?.latitude),
    longitude: parseFloat(item?.longitude),
  };

  const userCoords = {
    latitude: parseFloat(userCoordinates?.latitude),
    longitude: parseFloat(userCoordinates?.longitude),
  };

  const distance = haversine(userCoords, vendorCoordinates, {
    unit: 'km',
  });
  const formattedDistance = formatNumber(distance);

  // Extract city from address
  const getCityFromAddress = address => {
    if (!address) return '';
    const parts = address.split(',');
    return (
      parts[parts.length - 3]?.trim() || parts[parts.length - 2]?.trim() || ''
    );
  };

  const city = getCityFromAddress(item?.address);

  return (
    <Pressable
      style={styles.cardContainer}
      onPress={() => {
        navigation.navigate('VendorDetail', {
          item: item,
          userCoordinates: userCoords,
        });
      }}>
      {/* Main Card with Gradient Background */}
      <LinearGradient
        colors={['#FFFFFF', '#b1cbf0ff']}
        style={styles.gradientContainer}>
        
        {/* Header Section with Background Image */}
        <View style={styles.headerSection}>
          <Image
            source={
              item?.background
                ? {uri: item?.background}
                : require('../images/shopbg.png')
            }
            style={styles.headerBackground}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
            style={styles.headerOverlay}
          />
          
          {/* Status Badge */}
          <View style={styles.statusBadge}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    item?.status === 1 ? '#10B981' : '#6B7280',
                },
              ]}
            />
            <Text style={styles.statusText}>
              {item?.status === 1 ? 'Open Now' : 'Closed'}
            </Text>
          </View>

          {/* Distance Badge */}
          <View style={styles.distanceBadge}>
            <Feather name="navigation" size={12} color="#FFFFFF" />
            <Text style={styles.distanceText}>
              {formattedDistance} km
            </Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Vendor Info Row */}
          <View style={styles.vendorInfoRow}>
            <View style={styles.profileImageContainer}>
              <Image
                source={
                  item?.image ? {uri: item?.image} : require('../images/wine.png')
                }
                style={styles.profileImage}
              />
              <View style={styles.onlineIndicator} />
            </View>
            
            <View style={styles.vendorDetails}>
              <Text style={styles.vendorName} numberOfLines={1}>
                {item?.shop_name || 'Wine Shop'}
              </Text>
              <ShopTypeBadge type={item?.vendor_shop_type} />
              <View style={styles.locationRow}>
                <MaterialIcons name="location-on" size={14} color="#6B7280" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {city || 'Noida, Uttar Pradesh'}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          {item?.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item?.description}
            </Text>
          )}

          {/* Contact Info */}
          {(item?.phone || item?.website) && (
            <View style={styles.contactSection}>
              {item?.phone && (
                <View style={styles.contactItem}>
                  <View style={styles.contactIcon}>
                    <Feather name="phone" size={12} color="#6B7280" />
                  </View>
                  <Text style={styles.contactText} numberOfLines={1}>
                    {item?.country_code} {item?.phone}
                  </Text>
                </View>
              )}

              {item?.website && (
                <View style={styles.contactItem}>
                  <View style={styles.contactIcon}>
                    <Feather name="globe" size={12} color="#6B7280" />
                  </View>
                  <Text style={styles.contactText} numberOfLines={1}>
                    {item?.website}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Action Button */}
          <View style={styles.actionSection}>
            <LinearGradient
                colors={[Colors.red, Colors.blue]}
              style={styles.actionButton}>
              <Text style={styles.actionButtonText}>View Details</Text>
              <AntDesign name="arrowright" size={16} color="#FFFFFF" />
            </LinearGradient>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export default NearVendorCards;

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  gradientContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerSection: {
    position: 'relative',
    height: 140,
  },
  headerBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: Fonts.InterMedium,
    color: '#1F2937',
  },
  distanceBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    color: '#FFFFFF',
    fontFamily: Fonts.InterMedium,
    fontSize: 11,
  },
  contentSection: {
    padding: 20,
  },
  vendorInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // elevation: 6,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  vendorDetails: {
    flex: 1,
  },
  vendorName: {
    color: '#1F2937',
    fontFamily: Fonts.InterBold,
    fontSize: 18,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop:5
  },
  locationText: {
    color: '#6B7280',
    fontFamily: Fonts.InterRegular,
    fontSize: 13,
    flex: 1,
  },
  description: {
    color: '#4B5563',
    fontFamily: Fonts.InterRegular,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  contactSection: {
    gap: 8,
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactText: {
    color: '#6B7280',
    fontFamily: Fonts.InterRegular,
    fontSize: 13,
    flex: 1,
  },
  actionSection: {
    alignItems: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontFamily: Fonts.InterMedium,
    fontSize: 15,
  },
  shopTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F8FF', // default, will be overridden
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 2,
    marginBottom: 2,
    marginRight: 8,
  },
  shopTypeEmoji: {
    fontSize: 13,
    marginRight: 4,
  },
  shopTypeText: {
    fontSize: 12,
    color: '#222',
    fontFamily: Fonts.InterMedium,
  },
});
