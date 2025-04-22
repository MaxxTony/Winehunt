import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Fonts} from '../../constant/Styles';
import {MultiSwitch} from 'react-native-multiswitch-selector';

const Order = () => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const [type, setType] = useState('Current Order');

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Order"
        onPress={() => navigation.goBack()}
        // rightIcon={true}
        // rightText="Clear All"
        // onPressRightIcon={() => onClearAll()}
        extraStyle={styles.backNavigationExtraStyle}
      />
      <View style={styles.switchContainer}>
        <MultiSwitch
          allStates={['Current Order', 'Order History']}
          currentState={type}
          changeState={setType}
          mode="white"
          styleRoot={styles.multiSwitchRoot}
          styleAllStatesContainer={styles.multiSwitchContainer}
          styleActiveState={styles.activeState}
          styleActiveStateText={styles.activeStateText}
          styleInactiveStateText={styles.inactiveStateText}
        />
      </View>
      {type === 'Current Order' ? (
        <FlatList
          contentContainerStyle={{padding: 20, gap: 10}}
          data={Array.from({length: 20})}
          renderItem={({item, index}) => {
            return (
                <Pressable style={styles.cardContainer} onPress={() => navigation.navigate("OrderDetail")}>
                <View style={styles.topSection}>
                  <Image
                    source={require('./images/wine.png')}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                  <View style={styles.middleSection}>
                    <Text style={styles.productName}>
                      Eva (White Grape-juice)
                    </Text>
                    <Text style={styles.productSize}>Size: M</Text>
                  </View>
                  <View style={styles.rightSection}>
                    <Pressable style={styles.cancelButton}>
                      <Text style={styles.cancelButtonText}>Cancel Order</Text>
                    </Pressable>
                    <Text style={styles.refundText}>Refund</Text>
                    <Text style={styles.priceText}>£12.00</Text>
                  </View>
                </View>
                {/* <View style={styles.divider} />
                <View style={styles.bottomButtons}>
                  <Pressable style={styles.bottomBtn}>
                    <Text style={styles.bottomBtnText}>Track Order</Text>
                  </Pressable>
                  <View style={styles.verticalDivider} />
                  <Pressable style={styles.bottomBtn}>
                    <Text style={styles.bottomBtnText}>Get Invoice</Text>
                  </Pressable>
                </View> */}
              </Pressable>
            );
          }}
        />
      ) : (
        <FlatList
          contentContainerStyle={{padding: 20, gap: 10}}
          data={Array.from({length: 20})}
          renderItem={({item, index}) => {
            return (
              <Pressable style={styles.cardContainer} onPress={() => navigation.navigate("OrderDetail")}>
                <View style={styles.topSection}>
                  <Image
                    source={require('./images/wine.png')}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                  <View style={styles.middleSection}>
                    <Text style={styles.productName}>
                      Eva (White Grape-juice)
                    </Text>
                    <Text style={styles.productSize}>Size: M</Text>
                  </View>
                  <View style={styles.rightSection}>
                    <Pressable style={styles.cancelButton}>
                      <Text style={styles.cancelButtonText}>Place Order</Text>
                    </Pressable>

                    <Text style={styles.priceText}>£12.00</Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backNavigationExtraStyle: {
    borderBottomWidth: 0,
  },
  switchContainer: {
    padding: 20,
    borderBottomWidth: 2,
    borderColor: Colors.gray2,
  },
  multiSwitchRoot: {
    borderRadius: 50,
    padding: 0,
    height: 50,
  },
  multiSwitchContainer: {
    backgroundColor: Colors.gray6,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#E6EBF1',
  },
  activeState: {
    backgroundColor: Colors.blue,
    borderRadius: 50,
  },
  activeStateText: {
    fontFamily: Fonts.InterRegular,
    color: Colors.white,
    fontWeight: '500',
    fontSize: 14,
  },
  inactiveStateText: {
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '500',
    fontSize: 14,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 10,
    padding: 15,
    elevation: 5,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  productImage: {
    width: 50,
    height: 90,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  productSize: {
    fontSize: 14,
    color: '#000',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 5,
  },
  cancelButton: {
    backgroundColor: '#326EFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  refundText: {
    color: '#326EFF',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  priceText: {
    color: '#A62222',
    fontWeight: '700',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBtn: {
    flex: 1,
    alignItems: 'center',
  },
  bottomBtnText: {
    color: '#D34343',
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ccc',
  },
});
