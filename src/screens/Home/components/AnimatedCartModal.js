import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import {Modal} from 'react-native';
import {useEffect, useRef} from 'react';
import {Colors} from '../../../constant/Styles';

const AnimatedCartModal = ({visible, onClose, cartData, navigation}) => {
  const slideAnim = useRef(new Animated.Value(500)).current;

  console.log(
    cartData[0]?.quantity * cartData[0]?.product?.price_mappings?.price,
  );

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

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable
        style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}
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
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 10,
          }}>
          Your Cart
        </Text>
        <FlatList
          data={cartData}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 15,
                backgroundColor: Colors.gray10,
                padding: 10,
                borderRadius: 10,
              }}>
              <Image
                source={{
                  uri:
                    item.product.product_images?.[0]?.image ||
                    'https://via.placeholder.com/50',
                }}
                style={{width: 50, height: 50, borderRadius: 10}}
                resizeMode="contain"
              />
              <View style={{flex: 1, marginLeft: 10}}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  {item.product.name}
                </Text>
                <Text style={{color: Colors.gray}}>
                  Quantity: {item.quantity}
                </Text>
              </View>
              <Text style={{fontWeight: 'bold', fontSize: 16}}>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(
                  item?.quantity *
                    parseFloat(item?.product?.price_mappings?.price),
                )}
              </Text>
            </View>
          )}
        />
        <Pressable
          style={{
            backgroundColor: Colors.blue,
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginTop: 10,
          }}
          onPress={() => navigation.navigate('Cart')}>
          <Text style={{color: Colors.white, fontWeight: 'bold'}}>
            Proceed to Checkout
          </Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
};

export default AnimatedCartModal;
