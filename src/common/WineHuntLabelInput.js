import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts} from '../constant/Styles';
import Entypo from 'react-native-vector-icons/Entypo';

const WineHuntLabelInput = props => {
  const [secureTextEntry, setSecureTextEntry] = useState(
    props?.isPassword || false,
  );

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={{gap: 10}}>
      <Text
        style={{
          fontSize: 14,
          color: Colors.black,
          fontFamily: Fonts.InterMedium,
          fontWeight: '500',
        }}
        allowFontScaling={false}>
        {props?.label}
        {props?.isRequired && <Text style={styles.asterisk}> *</Text>}
      </Text>
      <View
        style={{
          borderWidth: 1,
          padding: 10,
          // paddingVertical: 12,
          borderColor: Colors.gray2,
          borderRadius: 5,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          backgroundColor: '#fff',
          elevation: 2,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}>
        <TextInput
          value={props?.value}
          onChangeText={props?.onChangeText}
          secureTextEntry={secureTextEntry}
          style={[
            {
              flex: 1,
              color: Colors.black,
              paddingVertical: Platform.OS == 'android' ? 0 : 5,
            },
            props?.extraInputStyle,
          ]}
          placeholder={props?.placeholder}
          placeholderTextColor={Colors.gray4}
          {...props}
        />
        {props?.isPassword && (
          <TouchableOpacity onPress={toggleSecureTextEntry}>
            <Entypo
              name={secureTextEntry ? 'eye-with-line' : 'eye'}
              size={20}
              color={Colors.black}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default WineHuntLabelInput;

const styles = StyleSheet.create({
  asterisk: {
    color: 'red',
  },
});
