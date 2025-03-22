const devUrl = 'http://13.48.249.80:8000/api/auth/';
const devUrl2 = 'http://13.48.249.80:8000/api/home/';
const devUrl3 = 'http://13.48.249.80:8000/api/profile/';
const devUrl4 = 'http://13.48.249.80:8000/api/product/';
const devUrl5 = 'http://13.48.249.80:8000/api/vendor/';
const devUrl6 = 'http://13.48.249.80:8000/api/enquiry/';
const devUrl7 = 'http://13.48.249.80:8000/api/wishlist/';
const devUrl8 = 'http://13.48.249.80:8000/api/cart/';
const devUrl9 = 'http://13.48.249.80:8000/api/order/';
const devUrl10 = 'http://13.48.249.80:8000/api/other/';

const Constants = {
  baseUrl: devUrl,
  baseUrl2: devUrl2,
  baseUrl3: devUrl3,
  baseUrl4: devUrl4,
  baseUrl5: devUrl5,
  baseUrl6: devUrl6,
  baseUrl7: devUrl7,
  baseUrl8: devUrl8,
  baseUrl9: devUrl9,
  baseUrl10: devUrl10,
  login: 'login-with-otp',
  verifyOtp: 'verify-otp',
  register: 'register-user',
  home: 'get-home',
  profile: 'get-profile',
  editProfile: 'edit-profile',
  changePassword: 'change-password',
  searchProducts: 'search-products',
  wineDetail: 'get-product-by-id',
  vendorDetail: 'get-vendor-by-id',
  inquiry: 'submit-help-query',
  addToWishList: 'to-wishlist',
  removeToWishList: 'to-unwishlist',
  clearWishList: 'clear-wishlist',
  getWishList: 'get-wishlist',
  addToCart: 'add-to-cart',
  deleteCart: 'delete-cart',
  getCart: 'get-cart',
  updateCart: 'update-cart',
  createIntent: 'create-payment-intent',
  createOrder: 'create-confirm-order',
  addAddress: 'add-address',
  getAddress: 'get-address',
  updateAddress: 'update-address',
  CategoryProduct: 'category-product',
};

export default Constants;
