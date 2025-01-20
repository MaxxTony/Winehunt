import {Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors} from '../../constant/Styles';
import Feather from 'react-native-vector-icons/Feather';
import WineHuntButton from '../../common/WineHuntButton';

const ChangePassword = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Change Password"
        onPress={() => navigation.goBack()}
      />
      <View style={{padding: 20, gap: 10, flex: 1}}>
        <View
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: Colors.gray2,
            borderRadius: 10,
            gap: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Feather name="lock" size={18} color={Colors.red} />
          <TextInput
            value={oldPassword}
            onChangeText={e => setOldPassword(e)}
            style={{
              flex: 1,
              paddingVertical: Platform.OS === 'ios' ? 5 : 0,
            }}
            placeholder="Enter Old Password"
            placeholderTextColor={Colors.gray4}
            secureTextEntry={true}
          />
        </View>
        <View
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: Colors.gray2,
            borderRadius: 10,
            gap: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Feather name="lock" size={18} color={Colors.red} />
          <TextInput
            value={newPassword}
            onChangeText={e => setNewPassword(e)}
            style={{
              flex: 1,
              paddingVertical: Platform.OS === 'ios' ? 5 : 0,
            }}
            placeholder="Enter New Password"
            placeholderTextColor={Colors.gray4}
            secureTextEntry={true}
          />
        </View>
        <View
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: Colors.gray2,
            borderRadius: 10,
            gap: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Feather name="lock" size={18} color={Colors.red} />
          <TextInput
            value={confirmNewPassword}
            onChangeText={e => setConfirmNewPassword(e)}
            style={{
              flex: 1,
              paddingVertical: Platform.OS === 'ios' ? 5 : 0,
            }}
            placeholder="Enter Confirm Password"
            placeholderTextColor={Colors.gray4}
            secureTextEntry={true}
          />
        </View>
        <View style={{marginTop: 'auto', paddingBottom: 30}}>
          <WineHuntButton text="Update" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
