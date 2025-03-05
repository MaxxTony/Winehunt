import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {checkIfConfigIsValid} from 'react-native-reanimated/lib/typescript/reanimated2/animation/springUtils';

const ThankYou = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
      <Image source={require('./images/pay.png')} style={styles.checkIcon} />
      <Text style={styles.thank}>ThankYou for your order</Text>
      <Text style={styles.thanks}>Your order has been successfully placed</Text>
    </View>
  );
};

export default ThankYou;

const styles = StyleSheet.create({
  checkIcon: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 100,
  },
  thank: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
  },
  thanks: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 13,
    color: 'gray',
  },
});
