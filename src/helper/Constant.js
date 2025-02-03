const devUrl = 'http://13.48.249.80:8000/api/auth/';
const devUrl2 = 'http://13.48.249.80:8000/api/home/';
const devUrl3 = 'http://13.48.249.80:8000/api/profile/';
const devUrl4 = 'http://13.48.249.80:8000/api/product/';

const Constants = {
  baseUrl: devUrl,
  baseUrl2: devUrl2,
  baseUrl3: devUrl3,
  baseUrl4: devUrl4,
  login: 'login-with-otp',
  verifyOtp: 'verify-otp',
  register: 'register-user',
  home: 'get-home',
  profile: 'get-profile',
  editProfile: 'edit-profile',
  changePassword: 'change-password',
  searchProducts: 'search-products',
  wineDetail: 'get-product-by-id',
};

export default Constants;
