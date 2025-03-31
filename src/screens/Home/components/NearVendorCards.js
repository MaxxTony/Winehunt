import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../../constant/Styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import haversine from 'haversine';

const formatNumber = num => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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

  return (
    <Pressable
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate('VendorDetail', {
          item: item,
          userCoordinates: userCoords,
        })
      }>
      <Image
        source={
          item?.image ? {uri: item?.image} : require('../images/wine.png')
        }
        style={styles.vendorImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.vendorName} allowFontScaling={false}>{item?.shop_name}</Text>
        <Text style={styles.vendorDescription} allowFontScaling={false}>Best Rated this Month</Text>
        <View style={styles.ratingRow}>
           <AntDesign name="star" size={15} color={Colors.yellow}  allowFontScaling={false}/> 
           <Text style={styles.ratingText} allowFontScaling={false}>4.3 | 120 Review</Text>
           <View style={styles.distanceRow}>
          <Feather name="navigation" size={15} color={Colors.black} allowFontScaling={false}/>
          <Text style={styles.distanceText} allowFontScaling={false}>{formattedDistance} Km</Text>
        </View>
        </View>
      </View>
      <View>
      
      </View>
    </Pressable>
  );
};

export default NearVendorCards;

const styles = StyleSheet.create({
  cardContainer: {
    padding: 15,
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
    gap: 10,
    margin: 5,
  },
  vendorImage: {
    height: 65,
    width: 65,
    borderRadius: 10,
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
    fontSize: 10,
  },
  distanceRow: {
    flexDirection: 'row',
     alignItems: 'center',
    gap: 5,
    marginLeft:22
  },
  distanceText: {
    color: Colors.black,
    fontSize: 12,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
  },
});
