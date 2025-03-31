import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors} from '../../constant/Styles';
import WineHuntLabelInput from '../../common/WineHuntLabelInput';
import WineHuntButton from '../../common/WineHuntButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import axios from 'axios';
import {showSucess, showWarning} from '../../helper/Toastify';

const HelpSupport = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name) {
      showWarning('Please enter your name');
      return;
    }
    if (!email) {
      showWarning('Please enter your email');
      return;
    }
    if (!title) {
      showWarning('Please enter a title');
      return;
    }
    if (!message) {
      showWarning('Please enter your query');
      return;
    }
    const info = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(info)?.token;

    const url = Constants.baseUrl6 + Constants.inquiry;

    setLoading(true);

    const body = {
      name,
      email,
      title,
      query: message,
    };

    try {
      const res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(res?.data);
      if (res?.data?.status == 200) {
        showSucess(res?.data?.message);
        navigation.goBack();
        setEmail('');
        setMessage('');
        setTitle('');
        setName('');
      }
    } catch (error) {
      if (error.response) {
        console.log('Server Error:', error.response.data);
        showWarning(error.response.data?.message);
      } else if (error.request) {
        console.log('No Response:', error.request);
      } else {
        console.log('Request Error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.innerContainer, {paddingTop: inset.top}]}>
          <BackNavigationWithTitle
            title="Help & Support"
            onPress={() => navigation.goBack()}
          />
          <View style={styles.formContainer}>
            <WineHuntLabelInput
              value={name}
              onChangeText={setName}
              placeholder="Enter Your Name"
              label="Name"
              allowFontScaling={false}
            />
            <WineHuntLabelInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter Your Email"
              label="Email"
              allowFontScaling={false}
            />
            <WineHuntLabelInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter Your Title"
              label="Title"
              allowFontScaling={false}
            />
            <WineHuntLabelInput
              value={message}
              onChangeText={setMessage}
              placeholder="Enter Your Message"
              label="Your Query"
              extraInputStyle={{height: 100, verticalAlign: 'top'}}
              multiline
              allowFontScaling={false}
            />
            <View style={styles.buttonContainer}>
              <WineHuntButton
                text="Submit"
                onPress={onSubmit}
                loading={loading}
                allowFontScaling={false}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HelpSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  innerContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    gap: 10,
    flex: 1,
  },
  buttonContainer: {
    paddingBottom: 30,
  },
});
