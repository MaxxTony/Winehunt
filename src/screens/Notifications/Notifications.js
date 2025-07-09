import {View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Animated} from 'react-native';
import React, {useCallback, useState} from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import { Colors } from '../../constant/Styles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import {showWarning} from '../../helper/Toastify';
import axios from 'axios';
import moment from 'moment';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';

// Helper: get icon name and color by type
const getTypeIcon = (type) => {
  switch (type) {
    case 'order':
      return { name: 'shopping-cart', color: Colors.primary };
    case 'product_review':
      return { name: 'star', color: '#FFD700' };
    case 'message':
      return { name: 'message-circle', color: '#4A90E2' };
    default:
      return { name: 'bell', color: 'gray' };
  }
};

const NotificationItem = ({ item, onDelete, onToggleRead }) => {
  const [highlight, setHighlight] = React.useState(false);
  const highlightAnim = React.useRef(new Animated.Value(0)).current;

  // Animate highlight on tap
  const handlePress = () => {
    setHighlight(true);
    Animated.sequence([
      Animated.timing(highlightAnim, { toValue: 1, duration: 120, useNativeDriver: false }),
      Animated.timing(highlightAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start(() => setHighlight(false));
    onToggleRead(item.id);
  };

  const isUnread = !item.is_read;
  const { name: iconName, color: iconColor } = getTypeIcon(item.type);

  // Swipe actions
  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteAction} onPress={() => onDelete(item.id)}>
      <Icon name="trash-2" size={24} color="#fff" />
      <Text style={styles.actionText}>Delete</Text>
    </TouchableOpacity>
  );
  const renderLeftActions = () => (
    <TouchableOpacity style={styles.readAction} onPress={() => onToggleRead(item.id)}>
      <Icon name={isUnread ? 'check-circle' : 'circle'} size={24} color="#fff" />
      <Text style={styles.actionText}>{isUnread ? 'Mark Read' : 'Mark Unread'}</Text>
    </TouchableOpacity>
  );

  // Animated background for highlight
  const rowStyle = [
    styles.container,
    isUnread && styles.unreadContainer,
    {
      backgroundColor: highlightAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [isUnread ? '#F5F7FF' : '#fff', '#E0F7FA'],
      }),
    },
  ];

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      overshootRight={false}
      overshootLeft={false}
    >
      <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
        <Animated.View style={rowStyle}>
          <View style={styles.iconWrapper}>
            <Icon name={iconName} size={22} color={iconColor} style={styles.icon} />
            {isUnread && <View style={styles.unreadDot} />}
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.message, isUnread && styles.unreadMessage]} allowFontScaling={false}>
              {item.message}
            </Text>
            {item.sender_id && (
              <Text style={styles.sender} allowFontScaling={false}>
                {item.sender_name || `Sender: ${item.sender_id}`}
              </Text>
            )}
          </View>
          <Text style={styles.date} allowFontScaling={false}>
            {moment(item.created_at).fromNow()}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </Swipeable>
  );
};


const Notifications = () => {
 const navigation = useNavigation();
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getNotification();
    }, []),
  );

  const getNotification = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(data)?.token;
      const url = `${Constants.baseUrl10}${Constants.getNotification}`;
 
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res?.status === 200) {
        // Add local is_read state for animation
        console.log(res?.data)
        setNotification((res?.data?.data || []).map(n => ({ ...n, is_read: n.is_read })));
      }
    } catch (error) {
      if (error.response) {
        showWarning(error.response.data?.message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Delete notification locally
  const handleDelete = (id) => {
    setNotification(prev => prev.filter(n => n.id !== id));
    // Optionally: call API to delete notification
  };

  // Toggle read/unread locally
  const handleToggleRead = (id) => {
    setNotification(prev => prev.map(n => n.id === id ? { ...n, is_read: !n.is_read } : n));
    // Optionally: call API to mark as read/unread
  };

  const onRefresh = () => {
    getNotification(true);
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <BackNavigationWithTitle
        title="Notifications"
        onPress={() => navigation.goBack()}
      />
      <FlatList
        data={notification}
        keyExtractor={item => item.id?.toString()}
        renderItem={({item}) => (
          <NotificationItem
            item={item}
            onDelete={handleDelete}
            onToggleRead={handleToggleRead}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="bell-off" size={50} color="gray" />
            <Text style={styles.emptyText} allowFontScaling={false}>
              No notifications yet
            </Text>
          </View>
        }
        contentContainerStyle={notification.length === 0 && {flex: 1}}
        // Animated FlatList
        ItemSeparatorComponent={() => (
          <View style={{height: 1, backgroundColor: '#E0E0E0'}} />
        )}
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
    backgroundColor: '#fff',
  },
  unreadContainer: {
    backgroundColor: '#F5F7FF',
  },
  iconWrapper: {
    marginRight: 10,
    position: 'relative',
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  icon: {},
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  sender: {
    fontSize: 13,
    color: 'gray',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 8,
    minWidth: 70,
    textAlign: 'right',
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
  // Swipe actions
  deleteAction: {
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: '100%',
    flexDirection: 'column',
  },
  readAction: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 110,
    height: '100%',
    flexDirection: 'column',
  },
  actionText: {
    color: '#fff',
    fontSize: 13,
    marginTop: 4,
  },
});
