import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors} from '../../constant/Styles';

const PrivacyPolicy = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Privacy Policy"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
