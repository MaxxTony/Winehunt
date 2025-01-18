import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors} from '../../constant/Styles';

const TermsCondition = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Terms & Condition"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default TermsCondition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
