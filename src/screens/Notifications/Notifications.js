import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors} from '../../constant/Styles';
import Icon from 'react-native-vector-icons/Feather';

const notifications = [];

const NotificationItem = ({item}) => {
  return (
    <View style={styles.container}>
      <Icon name="bell" size={20} color="gray" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.message} allowFontScaling={false}>
          {item.message}
        </Text>
        {item.sender && (
          <Text
            style={[styles.sender, item.highlight && styles.highlight]}
            allowFontScaling={false}>
            {item.sender}
          </Text>
        )}
      </View>
      <Text style={styles.date} allowFontScaling={false}>
        {item.date}
      </Text>
    </View>
  );
};

const Notifications = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <BackNavigationWithTitle
        title="Notifications"
        onPress={() => navigation.goBack()}
      />
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({item}) => <NotificationItem item={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="bell-off" size={50} color="gray" />
            <Text style={styles.emptyText} allowFontScaling={false}>
              No notifications yet
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
   container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
  },
  sender: {
    fontSize: 13,
    color: 'gray',
  },
  highlight: {
    color: 'red',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: 'gray',
  },
  emptyContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  paddingTop: 50,
},
emptyText: {
  fontSize: 16,
  color: 'gray',
  marginTop: 10,
},
});
