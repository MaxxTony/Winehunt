import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Switch,
  Platform,
  TouchableWithoutFeedback,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {Colors, Fonts} from '../../../constant/Styles';
import WineHuntButton from '../../../common/WineHuntButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const FilterModal = ({visible, onClose, onApplyFilters, data}) => {
  // Unified filter state
  const [filters, setFilters] = useState({
    wineTypes: [],
    priceRange: null,
    grapesTypes: [],
    popularCountry: [],
    hasMilestoneRewards: false,
    hasOffers: false,
  });

  // Animation for slide up
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const wineType = [
    {id: 1, name: 'Red'},
    {id: 2, name: 'White'},
    {id: 3, name: 'Sparking'},
    {id: 4, name: 'Rose'},
    {id: 5, name: 'Sweet'},
    {id: 6, name: 'Port'},
  ];

  const priceRange = [
    {id: 1, name: 'Rating'},
    {id: 2, name: 'Latest'},
    {id: 3, name: 'Low to High (Price)'},
    {id: 4, name: 'High to Low (Price)'},
  ];

  const grapesType = [
    {id: 1, name: 'Shizar'},
    {id: 2, name: 'Chardonnay'},
    {id: 3, name: 'Grenache'},
    {id: 4, name: 'Cabernet Sauvignon'},
    {id: 5, name: 'Pinor Noir'},
  ];

  const popularCountry = [
    {id: 1, name: 'Britain'},
    {id: 2, name: 'France'},
    {id: 3, name: 'Italy'},
    {id: 4, name: 'Argentina'},
    {id: 5, name: 'Chile'},
    {id: 6, name: 'Australia'},
    {id: 7, name: 'South Africa'},
    {id: 8, name: 'South Africa'},
  ];

  // Toggle helpers
  const toggleSelection = (key, id) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(id)
        ? prev[key].filter(typeId => typeId !== id)
        : [...prev[key], id],
    }));
  };

  const handlePriceRange = id => {
    setFilters(prev => ({...prev, priceRange: id}));
  };

  const handleSwitch = (key, value) => {
    setFilters(prev => ({...prev, [key]: value}));
  };

  const resetFilters = () => {
    setFilters({
      wineTypes: [],
      priceRange: null,
      grapesTypes: [],
      popularCountry: [],
      hasMilestoneRewards: false,
      hasOffers: false,
    });
  };

  const handleApply = () => {
    if (onApplyFilters) onApplyFilters(filters);
    onClose();
  };

  // Pro chip style
  const renderChip = (selected, onPress, label) => (
    <Pressable
      style={[
        styles.chip,
        selected && styles.selectedChip,
        styles.elevatedChip,
      ]}
      onPress={onPress}>
      <Text
        style={[styles.chipText, selected && styles.selectedChipText]}
        allowFontScaling={false}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <Modal
      isVisible={visible}
      animationIn="fadeInUp"
      animationInTiming={500}
      animationOut="fadeOutDown"
      animationOutTiming={500}
      backdropOpacity={0.5}
      style={styles.modal}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      useNativeDriver
      hideModalContentWhileAnimating>
      <SafeAreaView
        style={{flex: 1, backgroundColor: Colors.white, padding: 10}}>
        <View style={styles.headerBar}>
          <Pressable
            onPress={onClose}
            style={{
              alignSelf: 'flex-end',
              padding: 4,
              backgroundColor: '#fff',
              borderRadius: 20,
              marginRight: 4,
              marginTop: 4,
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 2,
            }}>
            <MaterialCommunityIcons name="close" size={32} color={Colors.red} />
          </Pressable>
        </View>
        <FlatList
          ListHeaderComponent={
            <>
              <Text style={styles.sectionTitle} allowFontScaling={false}>
                Filter
              </Text>
              {/* Wine Type */}
              <Text style={styles.subTitle} allowFontScaling={false}>
                Wine Type
              </Text>
              <View style={styles.chipContainer}>
                {wineType.map(item =>
                  renderChip(
                    filters.wineTypes.includes(item.id),
                    () => toggleSelection('wineTypes', item.id),
                    item.name,
                  ),
                )}
              </View>
              <View style={styles.divider} />
              {/* Price Range */}
              <Text style={styles.subTitle} allowFontScaling={false}>
                Price Range
              </Text>
            </>
          }
          data={priceRange}
          contentContainerStyle={{paddingBottom: 180}}
          renderItem={({item}) => {
            const isSelected = item.id === filters.priceRange;
            return (
              <Pressable
                key={item.id}
                style={styles.priceRangeItem}
                onPress={() => handlePriceRange(item.id)}>
                <MaterialCommunityIcons
                  name={isSelected ? 'radiobox-marked' : 'radiobox-blank'}
                  size={26}
                  color={isSelected ? Colors.red : Colors.gray5}
                />
                <Text style={styles.priceRangeText} allowFontScaling={false}>
                  {item?.name}
                </Text>
              </Pressable>
            );
          }}
          keyExtractor={item => item.id.toString()}
          ListFooterComponent={
            <>
              <View style={styles.divider} />
              {/* Grapes */}
              <Text style={styles.subTitle} allowFontScaling={false}>
                Grapes
              </Text>
              <View style={styles.chipContainer}>
                {grapesType.map(item =>
                  renderChip(
                    filters.grapesTypes.includes(item.id),
                    () => toggleSelection('grapesTypes', item.id),
                    item.name,
                  ),
                )}
              </View>
              <View style={styles.divider} />
              {/* Popular Country */}
              <Text style={styles.subTitle} allowFontScaling={false}>
                Popular Country
              </Text>
              <View style={styles.chipContainer}>
                {popularCountry.map(item =>
                  renderChip(
                    filters.popularCountry.includes(item.id),
                    () => toggleSelection('popularCountry', item.id),
                    item.name,
                  ),
                )}
              </View>
              <View style={styles.divider} />
              {/* Milestone Rewards */}
              <View style={styles.switchRow}>
                <MaterialCommunityIcons
                  name="star-circle"
                  size={26}
                  color={
                    filters.hasMilestoneRewards ? Colors.red : Colors.gray5
                  }
                />
                <Text style={styles.switchLabel} allowFontScaling={false}>
                  Has Milestone Rewards
                </Text>
                <Switch
                  value={filters.hasMilestoneRewards}
                  onValueChange={val =>
                    handleSwitch('hasMilestoneRewards', val)
                  }
                  thumbColor={
                    filters.hasMilestoneRewards
                      ? Colors.red
                      : Platform.OS === 'android'
                      ? Colors.gray5
                      : undefined
                  }
                  trackColor={{false: Colors.gray12, true: Colors.red + '55'}}
                />
              </View>
              {/* Offers */}
              <View style={styles.switchRow}>
                <MaterialCommunityIcons
                  name="tag"
                  size={26}
                  color={filters.hasOffers ? Colors.red : Colors.gray5}
                />
                <Text style={styles.switchLabel} allowFontScaling={false}>
                  Has Offers
                </Text>
                <Switch
                  value={filters.hasOffers}
                  onValueChange={val => handleSwitch('hasOffers', val)}
                  thumbColor={
                    filters.hasOffers
                      ? Colors.red
                      : Platform.OS === 'android'
                      ? Colors.gray5
                      : undefined
                  }
                  trackColor={{false: Colors.gray12, true: Colors.red + '55'}}
                />
              </View>
            </>
          }
          showsVerticalScrollIndicator={false}
        />
        {/* Sticky Footer */}
        <View style={styles.stickyFooter}>
          <WineHuntButton
            text="Clear"
            extraButtonStyle={styles.clearButton}
            extraTextStyle={styles.clearButtonText}
            onPress={resetFilters}
          />
          <WineHuntButton
            text="Apply"
            extraButtonStyle={styles.applyButton}
            onPress={handleApply}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 1,
  },
  modalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 16,
    zIndex: 2,
  },
  headerBar: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handleIndicator: {
    backgroundColor: Colors.gray10,
    height: 6,
    width: 50,
    borderRadius: 3,
    marginBottom: 8,
  },
  bottomSheetContent: {
    backgroundColor: Colors.white,
    padding: 20,
    paddingBottom: 100,
    gap: 20,
  },
  sectionTitle: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontWeight: '600',
    fontSize: 20,
    marginBottom: 8,
    marginLeft: 8,
  },
  subTitle: {
    fontFamily: Fonts.InterMedium,
    color: Colors.red,
    fontWeight: '500',
    fontSize: 16,
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 8,
    marginLeft: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: Colors.gray5,
    borderRadius: 18,
    backgroundColor: Colors.white,
    marginBottom: 6,
    marginRight: 8,
    minHeight: 36,
  },
  elevatedChip: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  chipText: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontWeight: '500',
    fontSize: 15,
  },
  selectedChip: {
    backgroundColor: Colors.red,
    borderColor: Colors.red,
  },
  selectedChipText: {
    color: Colors.white,
  },
  divider: {
    height: 2,
    width: '100%',
    backgroundColor: Colors.gray12,
    marginVertical: 12,
  },
  flatListContent: {
    gap: 10,
  },
  priceRangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginLeft: 8,
    marginBottom: 4,
  },
  priceRangeText: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontWeight: '500',
    fontSize: 15,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 8,
    marginTop: 12,
    marginBottom: 4,
  },
  switchLabel: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontWeight: '500',
    fontSize: 15,
    flex: 1,
    marginLeft: 8,
  },
  stickyFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderColor: Colors.gray12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  clearButton: {
    backgroundColor: Colors.white,
    flex: 0.5,
    borderWidth: 1,
    borderColor: '#E6EBF1',
  },
  clearButtonText: {
    color: Colors.black,
  },
  applyButton: {
    flex: 0.5,
    borderWidth: 1,
    borderColor: Colors.red,
  },
  modal: {
    margin: 0,
  },
});
