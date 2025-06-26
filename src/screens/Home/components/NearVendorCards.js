import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../../constant/Styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import haversine from 'haversine';

const formatNumber = num => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num);
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
      {/* Background Image */}
      <View style={styles.imageContainer}>
        <Image
          source={
            item?.background
              ? {uri: item?.background}
              : require('../images/shopbg.png')
          }
          style={styles.backgroundImage}
        />
        <View style={styles.overlay} />

        {/* Vendor Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={
              item?.image ? {uri: item?.image} : require('../images/wine.png')
            }
            style={styles.profileImage}
          />
        </View>

        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  item?.status === 1 ? Colors.green : Colors.gray,
              },
            ]}
          />
          <Text style={styles.statusText}>
            {item?.status === 1 ? 'Open' : 'Closed'}
          </Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Text
              style={styles.vendorName}
              allowFontScaling={false}
              numberOfLines={1}>
              {item?.shop_name || 'Wine Shop'}
            </Text>
          </View>

          <View style={styles.distanceContainer}>
            <Feather name="navigation" size={16} color={Colors.primary} />
            <Text style={styles.distanceText} allowFontScaling={false}>
              {formattedDistance} km
            </Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={16} color={Colors.gray7} />
          <Text
            style={styles.locationText}
            allowFontScaling={false}
            numberOfLines={1}>
            {city || 'Noida, Uttar Pradesh'}
          </Text>
        </View>

        {/* Contact Info */}
        <View style={styles.contactContainer}>
          {item?.phone && (
            <View style={styles.contactItem}>
              <Feather name="phone" size={14} color={Colors.gray7} />
              <Text style={styles.contactText} allowFontScaling={false}>
                {item?.country_code} {item?.phone}
              </Text>
            </View>
          )}

          {item?.website && (
            <View style={styles.contactItem}>
              <Feather name="globe" size={14} color={Colors.gray7} />
              <Text
                style={styles.contactText}
                allowFontScaling={false}
                numberOfLines={1}>
                {item?.website}
              </Text>
            </View>
          )}
        </View>
        {/* Description */}
        {item?.description && (
          <Text
            style={styles.description}
            allowFontScaling={false}
            numberOfLines={2}>
            {item?.description}
          </Text>
        )}

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <View style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <AntDesign name="arrowright" size={16} color={Colors.white} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default NearVendorCards;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 5,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 120,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -30,
    left: 16,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.white,
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
    color: Colors.black,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 40,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  vendorName: {
    color: Colors.black,
    fontFamily: Fonts.InterBold,
    fontSize: 18,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: Colors.black,
    fontFamily: Fonts.InterMedium,
    fontSize: 14,
    marginLeft: 2,
  },
  reviewCount: {
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontSize: 12,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  distanceText: {
    color: Colors.primary,
    fontFamily: Fonts.InterMedium,
    fontSize: 12,
  },
  description: {
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  locationText: {
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontSize: 13,
    flex: 1,
  },
  contactContainer: {
    gap: 6,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    color: Colors.gray7,
    fontFamily: Fonts.InterRegular,
    fontSize: 12,
    flex: 1,
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
  viewDetailsButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  viewDetailsText: {
    color: Colors.white,
    fontFamily: Fonts.InterMedium,
    fontSize: 14,
  },
});
