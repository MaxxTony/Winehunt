import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useState} from 'react';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Fonts} from '../../constant/Styles';
import Entypo from 'react-native-vector-icons/Entypo';
import WineHuntButton from '../../common/WineHuntButton';

const Cart = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState('');

  const increaseQuantity = () => {
    if (quantity < 20) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Add to cart"
        onPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image
          source={require('./images/cartBG.png')}
          style={[styles.cartImage, {width: width - 40}]}
        />
        <View style={styles.cartItemContainer}>
          <Image
            source={require('./images/cartBottle.png')}
            style={styles.bottleImage}
          />
          <View style={styles.cartDetailsContainer}>
            <Text style={styles.itemName}>Eva (White Grape juice)</Text>
            <Text style={styles.itemDescription}>Best Rated this Month</Text>
            <View style={styles.priceQuantityContainer}>
              <View style={styles.priceTag}>
                <Text style={styles.priceText}>$12.00</Text>
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={increaseQuantity}>
                  <Entypo name="squared-plus" color={Colors.red} size={40} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity onPress={decreaseQuantity}>
                  <Entypo name="squared-minus" color={Colors.red} size={40} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: Colors.gray13,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            backgroundColor: '#fff',
            elevation: 2,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <Image
            source={require('./images/coupon.png')}
            style={{height: 18, width: 28}}
            resizeMode="contain"
          />
          <TextInput
            value={couponCode}
            onChangeText={e => setCouponCode(e)}
            placeholderTextColor={Colors.gray4}
            style={{
              flex: 1,
              paddingVertical: Platform.OS == 'ios' ? 5 : 0,
              color: Colors.black,
            }}
            placeholder="Enter Promo Code/ Milestone reward"
          />
          <WineHuntButton
            text="Apply"
            extraButtonStyle={{
              padding: 10,
              backgroundColor: couponCode.length > 0 ? Colors.red : Colors.gray,
            }}
            disabled={couponCode.length > 0 ? false : true}
          />
        </View>
      </ScrollView>

      <View
        style={{
          padding: 20,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.5,
          shadowRadius: 6,
          backgroundColor: '#fff',
          elevation: 8,
          gap: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: Fonts.InterMedium,
              color: Colors.black,
              fontWeight: '600',
              fontSize: 16,
            }}>
            Sub Total
          </Text>
          <Text
            style={{
              fontFamily: Fonts.InterMedium,
              color: Colors.gray14,
              fontWeight: '600',
              fontSize: 16,
            }}>
            $68
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: Fonts.InterMedium,
              color: Colors.black,
              fontWeight: '600',
              fontSize: 16,
            }}>
            Deivery
          </Text>
          <Text
            style={{
              fontFamily: Fonts.InterMedium,
              color: Colors.gray14,
              fontWeight: '600',
              fontSize: 16,
            }}>
            $100
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: Fonts.InterMedium,
              color: Colors.black,
              fontWeight: '800',
              fontSize: 17,
            }}>
            Grand Total
          </Text>
          <Text
            style={{
              fontFamily: Fonts.InterMedium,
              color: Colors.black,
              fontWeight: '700',
              fontSize: 16,
            }}>
            $168
          </Text>
        </View>
        <WineHuntButton text="Next" />
      </View>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100,
    gap: 20,
  },
  cartImage: {
    height: 180,
    borderRadius: 10,
  },
  cartItemContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray13,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  bottleImage: {
    height: 75,
    width: 40,
  },
  cartDetailsContainer: {
    gap: 10,
    flex: 1,
  },
  itemName: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontWeight: '700',
    fontSize: 16,
  },
  itemDescription: {
    fontFamily: Fonts.InterMedium,
    color: Colors.gray7,
    fontWeight: '600',
    fontSize: 12,
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceTag: {
    padding: 8,
    paddingHorizontal: 10,
    backgroundColor: Colors.red,
    alignItems: 'center',
    borderRadius: 5,
  },
  priceText: {
    fontFamily: Fonts.InterMedium,
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityText: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontWeight: '600',
    fontSize: 18,
  },
});
