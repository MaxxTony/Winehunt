import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors} from '../../constant/Styles';
import WineHuntLabelInput from '../../common/WineHuntLabelInput';
import WineHuntButton from '../../common/WineHuntButton';

const HelpSupport = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Help & Support"
        onPress={() => navigation.goBack()}
      />
      <View style={{padding: 20, gap: 10, flex: 1}}>
        <WineHuntLabelInput
          value={name}
          onChangeText={e => setName(e)}
          placeholder="Enter Your Name"
          label="Name"
        />
        <WineHuntLabelInput
          value={email}
          onChangeText={e => setEmail(e)}
          placeholder="Enter Your Email"
          label="Email"
        />
        <WineHuntLabelInput
          value={title}
          onChangeText={e => setTitle(e)}
          placeholder="Enter Your Title"
          label="Title"
        />
        <WineHuntLabelInput
          value={message}
          onChangeText={e => setMessage(e)}
          placeholder="Enter Your Message"
          label="Your Query"
          extraInputStyle={{height: 100, verticalAlign: 'top'}}
          multiline={true}
        />
        <View style={{marginTop: 'auto', paddingBottom: 30}}>
          <WineHuntButton text="Submit" />
        </View>
      </View>
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
