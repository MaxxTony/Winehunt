import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import BackNavigationWithTitle from '../../../components/BackNavigationWithTitle';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Fonts} from '../../../constant/Styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ReviewList = props => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const data = props?.route?.params?.reviews;
  const type = props?.route?.params?.type;

  function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
      {label: 'year', seconds: 31536000},
      {label: 'month', seconds: 2592000},
      {label: 'week', seconds: 604800},
      {label: 'day', seconds: 86400},
      {label: 'hour', seconds: 3600},
      {label: 'minute', seconds: 60},
      {label: 'second', seconds: 1},
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  }

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Reviews"
        onPress={() => navigation.goBack()}
        review={true}
        onPressReview={() =>
          navigation.navigate('Review', {vendorId: data?.id, type: type})
        }
      />

      <FlatList
        data={data?.reviews}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={styles.header}>
              <Image source={{uri: item?.user?.image}} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {item?.user?.first_name} {item?.user?.last_name}
                </Text>
                <Text style={styles.dateText}>
                  {' '}
                  {dayjs(item?.created_at).fromNow()}
                </Text>
              </View>
              <View style={styles.ratingContainer}>
                <AntDesign name="star" size={16} color={Colors.yellow} />
                <Text style={styles.ratingText}>{item?.rating}</Text>
              </View>
            </View>
            <Text style={styles.reviewText}>{item?.review}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ReviewList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContainer: {
    padding: 20,
    gap: 15,
  },
  card: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray14,
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray10,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontFamily: Fonts.InterSemiBold,
    color: Colors.black,
  },
  dateText: {
    fontSize: 13,
    color: Colors.gray15,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '600',
  },
  reviewText: {
    fontSize: 15,
    color: Colors.gray8,
    lineHeight: 20,
    fontFamily: Fonts.InterRegular,
  },
});
