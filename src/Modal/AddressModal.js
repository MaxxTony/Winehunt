import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
} from 'react-native';
import Modal from 'react-native-modal';
import {Colors, Fonts} from '../constant/Styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WineHuntButton from '../common/WineHuntButton';
import {Dropdown} from 'react-native-element-dropdown';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import 'react-native-get-random-values';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const countries = [
  {id: 'ENG', name: 'England'},
  {id: 'SCT', name: 'Scotland'},
  {id: 'WLS', name: 'Wales'},
  {id: 'NIR', name: 'Northern Ireland'},
  {id: 'IRL', name: 'Ireland'},
];

const ukCountries = [
  { id: 'ENG', name: 'England' },
  { id: 'SCT', name: 'Scotland' },
  { id: 'WLS', name: 'Wales' },
  { id: 'NIR', name: 'Northern Ireland' },
];

const SCREEN_HEIGHT = Dimensions.get('window').height;

const AddressFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialValues = {},
  mode = 'add',
  loading = false,
  error = '',
}) => {
  const inset = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [form, setForm] = useState({
    country: '',
    city: '',
    flat: '',
    area: '',
    pincode: '',
    ...initialValues,
  });
  const [formError, setFormError] = useState('');
  const [focus, setFocus] = useState({});

  useEffect(() => {
    setForm({
      country: initialValues.country || '',
      city: initialValues.city || '',
      flat: initialValues.flat || '',
      area: initialValues.area || '',
      pincode: initialValues.pincode || '',
    });
    setFormError('');
  }, [initialValues, visible]);

  const validate = () => {
    if (!form.country) return 'Please select the country';
    if (!form.city) return 'Please enter the city';
    if (!form.flat) return 'Please enter the flat number';
    if (!form.area) return 'Please enter the area';
    if (!form.pincode) return 'Please enter the post code';
    return '';
  };

  const handleSave = () => {
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError('');
    onSubmit(form);
  };

  return (
    <Modal
      animationIn="fadeInUp"
      animationInTiming={400}
      backdropOpacity={0.5}
      animationOutTiming={400}
      animationOut="fadeOutDown"
      isVisible={visible}
      style={styles.modal}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      useNativeDriver
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
        
      >
        <View style={[styles.card, {paddingBottom: inset.bottom + 16, backgroundColor: isDark ? '#181818' : Colors.white}]}> 
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.dragIndicator} />
            <Text style={[styles.title,{color:isDark ? "#fff" : "#000"}]} allowFontScaling={false}>
              {mode === 'edit' ? 'Update Address' : 'Add Address'}
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={{top:10,left:10,right:10,bottom:10}}>
              <FontAwesome6 name="xmark" size={22} color={Colors.gray20} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[styles.body, { flexGrow: 1 }]}
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >
            {/* Google Places Autocomplete */}
            <Text style={[styles.label, isDark && { color: '#fff' }]}>Search Address</Text>
            <GooglePlacesAutocomplete
              placeholder="Search for address"
              onPress={(data, details = null) => {
              
                if (!details) return;
                const addressComponents = details.address_components || [];
                const getComponent = (type) =>
                  addressComponents.find(c => c.types.includes(type))?.long_name || '';
                setForm(f => ({
                  ...f,
                  country: getComponent('country'),
                  city: getComponent('locality') || getComponent('postal_town'),
                  area: getComponent('route'),
                  pincode: getComponent('postal_code'),
                }));
              }}
              query={{
                key: 'AIzaSyAvhOv_MIWS7k1W7Fm9UZR-9TGXQCVS91Q',
                language: 'en',
                components: 'country:gb|country:ie',
              }}
              fetchDetails={true}
              styles={{
                container: { marginBottom: 14 },
                textInputContainer: [styles.googleInput, isDark && { backgroundColor: '#222', borderColor: '#444' }],
                textInput: [styles.googleTextInput, isDark && { color: '#fff', backgroundColor: '#222' }],
                listView: {
                  borderWidth: 1,
                  borderColor: isDark ? '#444' : '#ddd',
                  borderRadius: 8,
                  maxHeight: 100,
                  backgroundColor: isDark ? '#222' : '#fff',
                },
                row: isDark ? { backgroundColor: '#222' } : {},
                description: isDark ? { color: '#fff' } : {},
              }}
              enablePoweredByContainer={false}
              debounce={300}
            />

            {/* Manual Country Field or UK Dropdown */}
            <Text style={[styles.label, isDark && { color: '#fff' }]}>Country</Text>
            {['United Kingdom', 'Great Britain', 'UK', 'Britain'].includes(form.country.trim()) ? (
              <View style={[styles.inputWrapper, focus.country && styles.inputWrapperActive]}> 
                <FontAwesome6 name="globe" size={18} color={Colors.gray13} style={styles.inputIcon} />
                <Dropdown
                  data={ukCountries}
                  labelField="name"
                  valueField="name"
                  value={form.country}
                  onChange={item => setForm(f => ({ ...f, country: item.name }))}
                  style={[styles.input, { flex: 1, backgroundColor: 'transparent', color: isDark ? '#fff' : '#000' }]}
                  placeholder="Select country"
                  placeholderStyle={[styles.placeholderStyle, isDark && { color: '#aaa' }]}
                  selectedTextStyle={[styles.selectedTextStyle, isDark && { color: '#fff' }]}
                  itemTextStyle={[styles.itemTextStyle, isDark && { color: '#fff' }]}
                  containerStyle={isDark ? { backgroundColor: '#222' } : {}}
                />
              </View>
            ) : (
              <View style={[styles.inputWrapper, focus.country && styles.inputWrapperActive]}> 
                <FontAwesome6 name="globe" size={18} color={Colors.gray20} style={styles.inputIcon} />
                <TextInput
                  value={form.country}
                  onChangeText={v => setForm(f => ({...f, country: v}))}
                  style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
                  placeholder="Enter country"
                  placeholderTextColor={isDark ? '#aaa' : Colors.gray10}
                  onFocus={() => setFocus(f => ({...f, country: true}))}
                  onBlur={() => setFocus(f => ({...f, country: false}))}
                />
              </View>
            )}
            {/* Manual City Field */}
            <Text style={[styles.label, isDark && { color: '#fff' }]}>City</Text>
            <View style={[styles.inputWrapper, focus.city && styles.inputWrapperActive]}> 
              <FontAwesome6 name="city" size={18} color={Colors.gray20} style={styles.inputIcon} />
              <TextInput
                value={form.city}
                onChangeText={v => setForm(f => ({...f, city: v}))}
                style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
                placeholder="Enter city"
                placeholderTextColor={isDark ? '#aaa' : Colors.gray10}
                onFocus={() => setFocus(f => ({...f, city: true}))}
                onBlur={() => setFocus(f => ({...f, city: false}))}
              />
            </View>
            {/* Manual Area/Street Field */}
            <Text style={[styles.label, isDark && { color: '#fff' }]}>Area/Street</Text>
            <View style={[styles.inputWrapper, focus.area && styles.inputWrapperActive]}> 
              <FontAwesome6 name="road" size={18} color={Colors.gray20} style={styles.inputIcon} />
              <TextInput
                value={form.area}
                onChangeText={v => setForm(f => ({...f, area: v}))}
                style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
                placeholder="Enter area or street"
                placeholderTextColor={isDark ? '#aaa' : Colors.gray10}
                onFocus={() => setFocus(f => ({...f, area: true}))}
                onBlur={() => setFocus(f => ({...f, area: false}))}
              />
            </View>
            {/* Manual Post Code Field */}
            <Text style={[styles.label, isDark && { color: '#fff' }]}>Post Code</Text>
            <View style={[styles.inputWrapper, focus.pincode && styles.inputWrapperActive]}> 
              <FontAwesome6 name="location-dot" size={18} color={Colors.gray20} style={styles.inputIcon} />
              <TextInput
                value={form.pincode}
                onChangeText={v => setForm(f => ({...f, pincode: v}))}
                style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
                placeholder="Enter post code"
                placeholderTextColor={isDark ? '#aaa' : Colors.gray10}
                keyboardType="number-pad"
                onFocus={() => setFocus(f => ({...f, pincode: true}))}
                onBlur={() => setFocus(f => ({...f, pincode: false}))}
              />
            </View>

            {/* Flat/Block */}
            <Text style={[styles.label, isDark && { color: '#fff' }]}>Flat/Block</Text>
            <View style={[styles.inputWrapper, focus.flat && styles.inputWrapperActive]}> 
              <FontAwesome6 name="building" size={18} color={Colors.gray15} style={styles.inputIcon} />
              <TextInput
                value={form.flat}
                onChangeText={v => setForm(f => ({...f, flat: v}))}
                style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
                placeholder="Enter flat or block"
                placeholderTextColor={isDark ? '#aaa' : Colors.gray10}
                onFocus={() => setFocus(f => ({...f, flat: true}))}
                onBlur={() => setFocus(f => ({...f, flat: false}))}
              />
            </View>
          </ScrollView>

          {(formError || error) && (
            <Text style={styles.errorText} allowFontScaling={false}>
              {formError || error}
            </Text>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <WineHuntButton
              text="Cancel"
              onPress={onClose}
              extraButtonStyle={styles.cancelBtn}
              textStyle={{color: Colors.black}}
            />
            <WineHuntButton
              text={mode === 'edit' ? 'Update' : 'Save'}
              onPress={handleSave}
              extraButtonStyle={[styles.saveBtn, {opacity: loading ? 0.7 : 1}]}
              disabled={loading}
            />
          </View>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={Colors.red} />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddressFormModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
    minHeight: 520,
    position: 'relative',
    // height: SCREEN_HEIGHT * 0.8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
    paddingTop: 8,
  },
  dragIndicator: {
    height: 5,
    width: 50,
    backgroundColor: Colors.gray10,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 10,
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: 8,
    padding: 4,
    zIndex: 2,
  },
  title: {
    fontSize: 20,
    color: Colors.black,
    fontFamily: Fonts.InterBold,
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  body: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  label: {
    fontSize: 13,
    color: Colors.gray20,
    fontFamily: Fonts.InterMedium,
    marginBottom: 4,
    marginTop: 10,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray2,
    borderRadius: 10,
    backgroundColor: Colors.gray1,
    marginBottom: 2,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 8 : 2,
  },
  inputWrapperActive: {
    borderColor: Colors.red,
    backgroundColor: '#fff',
    shadowColor: Colors.red,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  inputIcon: {
    marginRight: 8,
    opacity: 0.7,
  },
  dropdown: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: 36,
  },
  placeholderStyle: {
    ...Fonts.InterRegular,
    fontSize: 15,
    color: Colors.gray10,
  },
  selectedTextStyle: {
    ...Fonts.InterRegular,
    fontSize: 15,
    color: Colors.black,
  },
  itemTextStyle: {
    ...Fonts.InterBold,
    color: Colors.black,
    fontSize: 13,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    fontFamily: Fonts.InterRegular,
    paddingVertical: Platform.OS === 'ios' ? 8 : 2,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  errorText: {
    color: Colors.red,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 2,
    fontFamily: Fonts.InterMedium,
  },
  footer: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 10,
    marginBottom: 2,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: Colors.gray15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray2,
    marginRight: 0,
  },
  saveBtn: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: Colors.red,
    marginLeft: 0,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    zIndex: 10,
  },
  googleInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray2,
    borderRadius: 10,
    backgroundColor: Colors.gray1,
    marginBottom: 2,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 8 : 2,
  },
  googleTextInput: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    fontFamily: Fonts.InterRegular,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: Platform.OS === 'ios' ? 8 : 2,
    paddingHorizontal: 0,
  },
});
