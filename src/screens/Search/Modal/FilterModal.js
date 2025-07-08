import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Switch,
  Platform,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
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
    sortBy: null,
    grapesTypes: [],
    popularCountry: [],
    hasMilestoneRewards: false ,
    hasOffers: false,
    hasNewArrival: false,
    averageRating: null,
  });

  // Extract dynamic categories from data
  const getCategoryByName = name => {
    return (
      data?.find(cat => cat.name.toLowerCase().includes(name.toLowerCase()))
        ?.categories || []
    );
  };

  const wineType = getCategoryByName('wine');
  const grapesType = getCategoryByName('grape');
  const popularCountry = getCategoryByName('countries');

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

  const sortByList = [
    {id: 3, name: 'Low to High (Price)'},
    {id: 4, name: 'High to Low (Price)'},
  ];

  const handleSortBy = (id, name) => {
    setFilters(prev => ({...prev, sortBy: name}));
  };

  const handleSwitch = (key, value) => {
    setFilters(prev => ({...prev, [key]: value}));
  };

  const resetFilters = () => {
    setFilters({
      wineTypes: [],
      sortBy: null,
      grapesTypes: [],
      popularCountry: [],
      hasMilestoneRewards: false,
      hasOffers: false ,
      hasNewArrival: false,
      averageRating: null,
    });
  };

  const handleApply = () => {
    if (onApplyFilters) onApplyFilters(filters);
    onClose();
  };

  // Pro chip style (now with image)
  const renderChip = (selected, onPress, label, image) => (
    <Pressable
      style={[
        styles.chip,
        selected && styles.selectedChip,
        styles.elevatedChip,
        {flexDirection: 'row', alignItems: 'center'},
      ]}
      onPress={onPress}>
      {image && (
        <View style={styles.chipImageWrapper}>
          <Animated.Image
            source={{uri: image}}
            style={styles.chipImage}
            resizeMode="cover"
          />
        </View>
      )}
      <Text
        style={[
          styles.chipText,
          selected && styles.selectedChipText,
          {marginLeft: image ? 8 : 0},
        ]}
        allowFontScaling={false}>
        {label}
      </Text>
    </Pressable>
  );




  // Star rating selector with animation and clear button
  const starScales = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
  ];

  const animateStar = idx => {
    Animated.sequence([
      Animated.timing(starScales[idx], {
        toValue: 1.25,
        duration: 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(starScales[idx], {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
    ]).start();
  };

  const handleStarPress = star => {
    setFilters(prev => ({...prev, averageRating: star}));
    animateStar(star - 1);
  };

  const handleClearRating = () =>
    setFilters(prev => ({...prev, averageRating: null}));

  const renderStarRating = () => (
    <View style={styles.ratingCard}>
      <View style={styles.ratingStarsRow}>
        {[1, 2, 3, 4, 5].map((star, idx) => (
          <Pressable
            key={star}
            onPress={() => handleStarPress(star)}
            style={styles.starButton}>
            <Animated.View style={{transform: [{scale: starScales[idx]}]}}>
              <MaterialCommunityIcons
                name={
                  filters.averageRating && filters.averageRating >= star
                    ? 'star'
                    : 'star-outline'
                }
                size={36}
                color={
                  filters.averageRating && filters.averageRating >= star
                    ? Colors.red
                    : Colors.gray15
                }
                style={styles.starIcon}
              />
            </Animated.View>
          </Pressable>
        ))}
        {filters.averageRating && (
          <Pressable onPress={handleClearRating} style={styles.clearRatingBtn}>
            <MaterialCommunityIcons
              name="close-circle"
              size={24}
              color={Colors.gray15}
            />
          </Pressable>
        )}
      </View>
    </View>
  );

  // Sort By chip style (reuse price chip style for consistency)
  const renderSortChip = (selected, onPress, label, icon) => (
    <Pressable
      style={[
        styles.priceChip,
        selected && styles.selectedPriceChip,
        styles.elevatedChip,
      ]}
      onPress={onPress}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={selected ? Colors.white : Colors.black}
          style={{marginRight: 6}}
        />
      )}
      <Text
        style={[styles.priceChipText, selected && styles.selectedPriceChipText]}
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
                    () =>
                      setFilters(prev => ({
                        ...prev,
                        wineTypes: prev.wineTypes.includes(item.id)
                          ? prev.wineTypes.filter(typeId => typeId !== item.id)
                          : [...prev.wineTypes, item.id],
                      })),
                    item.name,
                    item.image,
                  ),
                )}
              </View>
              <View style={styles.divider} />

              {/* Grapes */}
              <Text style={styles.subTitle} allowFontScaling={false}>
                Grapes
              </Text>
              <View style={styles.chipContainer}>
                {grapesType.map(item =>
                  renderChip(
                    filters.grapesTypes.includes(item.id),
                    () =>
                      setFilters(prev => ({
                        ...prev,
                        grapesTypes: prev.grapesTypes.includes(item.id)
                          ? prev.grapesTypes.filter(
                              typeId => typeId !== item.id,
                            )
                          : [...prev.grapesTypes, item.id],
                      })),
                    item.name,
                    item.image,
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
                    () =>
                      setFilters(prev => ({
                        ...prev,
                        popularCountry: prev.popularCountry.includes(item.id)
                          ? prev.popularCountry.filter(
                              typeId => typeId !== item.id,
                            )
                          : [...prev.popularCountry, item.id],
                      })),
                    item.name,
                    item.image,
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
                    filters.hasMilestoneRewards ? Colors.red : Colors.gray14
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
                  trackColor={{false: Colors.gray14, true: Colors.red + '55'}}
                />
              </View>
              {/* Offers */}
              <View style={styles.switchRow}>
                <MaterialCommunityIcons
                  name="tag"
                  size={26}
                  color={filters.hasOffers ? Colors.red : Colors.gray14}
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
                  trackColor={{false: Colors.gray14, true: Colors.red + '55'}}
                />
              </View>
              <View style={styles.divider} />
              {/* New Arrival */}
              <View style={styles.switchRow}>
                <MaterialCommunityIcons
                  name="new-box"
                  size={26}
                  color={filters.hasNewArrival ? Colors.red : Colors.gray14}
                />
                <Text style={styles.switchLabel} allowFontScaling={false}>
                  New Arrival
                </Text>
                <Switch
                  value={filters.hasNewArrival}
                  onValueChange={val =>
                    handleSwitch('hasNewArrival', val)
                  }
                  thumbColor={
                    filters.hasNewArrival
                      ? Colors.red
                      : Platform.OS === 'android'
                      ? Colors.gray5
                      : undefined
                  }
                  trackColor={{false: Colors.gray14, true: Colors.red + '55'}}
                />
              </View>
              <View style={styles.divider} />
              <Text style={styles.subTitle} allowFontScaling={false}>
                Price Range
              </Text>
              <View style={styles.priceChipRow}>
                {sortByList.map(item =>
                  renderSortChip(
                    filters.sortBy === item.name,
                    () => handleSortBy(item.id, item.name),
                    item.name,
                    item.id === 3
                      ? 'arrow-down-bold'
                      : item.id === 4
                      ? 'arrow-up-bold'
                      : undefined,
                  ),
                )}
              </View>
              {/* Average Customer Rating */}
              <Text style={styles.subTitle} allowFontScaling={false}>
                Avg. Customer Rating
              </Text>
              {renderStarRating()}
            </>
          }
          data={[]}
          contentContainerStyle={{paddingBottom: 180}}
          renderItem={null}
          keyExtractor={item => item.id.toString()}
          ListFooterComponent={<></>}
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
  chipImageWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
  priceChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 8,
    marginLeft: 4,
  },
  priceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: Colors.gray5,
    borderRadius: 18,
    backgroundColor: Colors.white,
    marginBottom: 6,
    marginRight: 8,
    minHeight: 36,
  },
  selectedPriceChip: {
    backgroundColor: Colors.red,
    borderColor: Colors.red,
  },
  priceChipText: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontWeight: '500',
    fontSize: 15,
  },
  selectedPriceChipText: {
    color: Colors.white,
  },
  ratingCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  ratingStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    gap: 4,
  },
  starButton: {
    padding: 4,
  },
  starIcon: {
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  clearRatingBtn: {
    marginLeft: 10,
    padding: 2,
  },
  ratingLabelText: {
    marginTop: 2,
    fontFamily: Fonts.InterMedium,
    color: Colors.red,
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'center',
  },
});
