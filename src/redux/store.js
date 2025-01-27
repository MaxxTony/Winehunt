import {configureStore} from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import editProfileReducer from './slices/editProfileSlice';

const store = configureStore({
  reducer: {
    profile: profileReducer,
    editProfile: editProfileReducer,
  },
});

export default store;
