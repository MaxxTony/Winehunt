import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import {showSucess, showWarning} from '../../helper/Toastify';
import {parsePhoneNumberFromString} from 'libphonenumber-js';
import {Alert} from 'react-native';

export const editProfile = createAsyncThunk(
  'profile/editProfile',
  async ({
    firstName,
    lastName,
    email,
    phoneNumber,
    phoneCountryCode,
    filePath,
    setLoading,
    navigation,
  }) => {
    if (!firstName) {
      showWarning('First Name can not be empty');
      return;
    }
    if (!lastName) {
      showWarning('Last Name can not be empty');
      return;
    }
    if (!email) {
      showWarning('Email can not be empty');
      return;
    }
    if (!phoneNumber) {
      showWarning('Phone Number can not be empty');
      return;
    }
    if (phoneNumber?.length !== 10) {
      showWarning('Invalid Phone Number');
      return;
    }
    // const phoneNumberObj = parsePhoneNumberFromString(
    //   phoneNumber,
    //   phoneCountryCode,
    // );
    // if (phoneNumberObj && phoneNumberObj.isValid()) {
    //   console.log('Number Valid h ');
    // } else {
    //   console.log('Invalid phone number');
    //   showWarning('Invalid Phone Number');
    //   return;
    // }
    const data = await AsyncStorage.getItem('userDetail');
    const token = JSON.parse(data)?.token;

    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('phone', phoneNumber);
    formData.append('country_code', phoneCountryCode);
    if (filePath) {
      formData.append('image', {
        uri: filePath.uri,
        type: filePath.type,
        name: 'index.jpg',
      });
    }

    setLoading(true);
    const url = Constants.baseUrl3 + Constants.editProfile;
    try {
      const res = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res?.status == 200) {
        showSucess(res?.data?.message);
        navigation.goBack();
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
  },
);

const editProfileSlice = createSlice({
  name: 'editProfile',
  initialState: {
    userData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(editProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default editProfileSlice.reducer;
