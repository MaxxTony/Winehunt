import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../../constant/Styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

const NearVendorCards = ({item}) => {
  return (
    <View style={styles.cardContainer}>
      <Image
        source={require('../images/wine.png')}
        style={styles.vendorImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.vendorName}>Vendor shop Name</Text>
        <Text style={styles.vendorDescription}>Best Rated this Month</Text>
        <View style={styles.ratingRow}>
          <AntDesign name="star" size={15} color={Colors.yellow} />
          <Text style={styles.ratingText}>4.3 | 120 Review</Text>
        </View>
      </View>
      <View>
        <View style={styles.distanceRow}>
          <Feather name="navigation" size={15} color={Colors.black} />
          <Text style={styles.distanceText}>2.5 Km</Text>
        </View>
      </View>
    </View>
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
