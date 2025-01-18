import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors} from '../../constant/Styles';

const EditProfile = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Edit Profile"
        onPress={() => navigation.goBack()}
      />
      <View style={{margin: 20, alignSelf: 'center'}}>
        <Image
          source={require('./images/profile.png')}
          style={{height: 100, width: 100}}
        />
        <Pressable style={{position: 'absolute', bottom: 0, right: 0}}>
          <Image
            source={require('./images/editIcon.png')}
            style={{height: 28, width: 28}}
          />
        </Pressable>
      </View>
      <View style={{padding: 20}}></View>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
