import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import BackNavigationWithTitle from '../../../components/BackNavigationWithTitle';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, Fonts} from '../../../constant/Styles';
import StarRating from 'react-native-star-rating-widget';
import WineHuntButton from '../../../common/WineHuntButton';
import {showSucess, showWarning} from '../../../helper/Toastify';
import Constants from '../../../helper/Constant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Review = props => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const vendorId = props?.route?.params?.vendorId;
  const type = props?.route?.params?.type;

  const handleSubmit = async () => {
    if (!message.trim() || rating === 0) {
      showWarning('Please fill in all fields before submitting.');
      return;
    }

    const datas = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(datas)?.token;

    const param = {
      type: type,
      vendor_id: vendorId,
      review: message,
      rating: rating,
    };

    const url = Constants.baseUrl10 + Constants.createReview;

    try {
      const response = await axios.post(url, param, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response?.data);
      showSucess(response?.data?.message);
      setMessage('');
      setRating(0); 
      navigation.goBack();
    } catch (error) {
      console.error('Error doing create review:', error?.response?.data);
    }
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <BackNavigationWithTitle
        title="Write a Review"
        onPress={() => navigation.goBack()}
        subtitle={true}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>What Did You Like Most?</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            placeholder="Type here..."
            style={styles.textInput}
            placeholderTextColor={Colors.gray2}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Rate Your Experience</Text>
          <StarRating rating={rating} onChange={setRating} />

          <View style={styles.buttonContainer}>
            <WineHuntButton text="Submit" onPress={handleSubmit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Review;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  flex: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 18,
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    marginBottom: 10,
  },
  textInput: {
    borderColor: '#D6DCE3',
    borderWidth: 1,
    height: 120,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontFamily: Fonts.InterRegular,
    color: Colors.black,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
