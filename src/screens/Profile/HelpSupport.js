import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors} from '../../constant/Styles';

const HelpSupport = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Help & Support"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default HelpSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
