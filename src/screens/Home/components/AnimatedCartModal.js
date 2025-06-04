import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import {Modal} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure you install this if not already
import {Colors} from '../../../constant/Styles';

const AnimatedCartModal = ({
  visible,
  onClose,
  cartData,
  navigation,
  onRemoveItem,
}) => {
  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);


  const renderItem = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: Colors.gray10,
        padding: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
      }}>
      <Image
        source={{
          uri:
            item?.product?.product_images?.[0]?.image ||
            'https://via.placeholder.com/50',
        }}
        style={{
          width: 60,
          height: 60,
          borderRadius: 12,
        }}
        resizeMode="contain"
      />
      <View style={{flex: 1, marginLeft: 12}}>
        <Text style={{fontSize: 16, fontWeight: '600', marginBottom: 2}}>
          {item.product.name}
        </Text>
        <Text style={{color: Colors.black, fontSize: 14}}>
          Quantity: {item.quantity}
        </Text>
      </View>
      <View style={{alignItems: 'flex-end'}}>
        <Text style={{fontWeight: 'bold', fontSize: 15, marginBottom: 5}}>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(
            item?.quantity *
              parseFloat(item?.product?.price),
          )}
        </Text>
        <TouchableOpacity onPress={() => onRemoveItem(item.id)}>
          <Icon name="delete" size={22} color={Colors.red} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable
        style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'}}
        onPress={onClose}
      />
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          backgroundColor: Colors.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
          transform: [{translateY: slideAnim}],
          maxHeight: '100%',
        }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 15,
          }}>
          Your Cart
        </Text>

        {cartData.length > 0 ? (
          <>
            <FlatList
              data={cartData}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />

            <Pressable
              style={{
                backgroundColor: Colors.blue,
                padding: 15,
                borderRadius: 10,
                alignItems: 'center',
                marginTop: 20,
              }}
              onPress={() => navigation.navigate('Cart')}>
              <Text style={{color: Colors.white, fontWeight: 'bold'}}>
                Proceed to Checkout
              </Text>
            </Pressable>
          </>
        ) : (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              color: Colors.gray,
              marginTop: 20,
            }}>
            Your cart is empty.
          </Text>
        )}
      </Animated.View>
    </Modal>
  );
};

export default AnimatedCartModal;
