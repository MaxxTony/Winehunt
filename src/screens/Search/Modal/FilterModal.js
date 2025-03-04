import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Colors, Fonts} from '../../../constant/Styles';
import WineHuntButton from '../../../common/WineHuntButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FilterModal = ({bottomSheetModalRef2, snapPoints2}) => {
  const [selectedWineTypes, setSelectedWineTypes] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedGrapesTypes, setSelectedGrapesTypes] = useState([]);
  const [selectedPopularCountry, setSelectedPopularCountry] = useState([]);

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

  const toggleWineTypeSelection = id => {
    setSelectedWineTypes(prev =>
      prev.includes(id) ? prev.filter(typeId => typeId !== id) : [...prev, id],
    );
  };
  const toggleGrapesTypeSelection = id => {
    setSelectedGrapesTypes(prev =>
      prev.includes(id) ? prev.filter(typeId => typeId !== id) : [...prev, id],
    );
  };
  const togglePopularCountrySelection = id => {
    setSelectedPopularCountry(prev =>
      prev.includes(id) ? prev.filter(typeId => typeId !== id) : [...prev, id],
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetModalRef2}
      index={-1}
      snapPoints={snapPoints2}
      enableOverDrag={false}
      enablePanDownToClose={true}
      handleStyle={styles.bottomSheetHandle}
      handleIndicatorStyle={styles.handleIndicator}>
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bottomSheetContent}>
        <Text style={styles.sectionTitle}>Filter</Text>
        <Text style={styles.subTitle}>Wine Type</Text>
        <View style={styles.chipContainer}>
          {wineType.map((item, index) => (
            <Pressable
              key={item.id}
              style={[
                styles.chip,
                selectedWineTypes.includes(item.id) && styles.selectedChip,
              ]}
              onPress={() => toggleWineTypeSelection(item.id)}>
              <Text
                style={[
                  styles.chipText,
                  selectedWineTypes.includes(item.id) &&
                    styles.selectedChipText,
                ]}>
                {item.name}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.divider} />
        <Text style={styles.subTitle}>Price Range</Text>
        <View>
          <FlatList
            data={priceRange}
            contentContainerStyle={styles.flatListContent}
            renderItem={({item, index}) => {
              const isSelected = item.id === selectedPriceRange;
              return (
                <Pressable
                  key={index}
                  style={styles.priceRangeItem}
                  onPress={() => setSelectedPriceRange(item.id)}>
                  <MaterialCommunityIcons
                    name={
                      isSelected ? 'checkbox-marked' : 'checkbox-blank-outline'
                    }
                    size={30}
                    color={isSelected ? Colors.red : Colors.gray5}
                  />
                  <Text style={styles.priceRangeText}>{item?.name}</Text>
                </Pressable>
              );
            }}
          />
        </View>
        <View style={styles.divider} />
        <Text style={styles.subTitle}>Grapes</Text>
        <View style={styles.chipContainer}>
          {grapesType.map((item, index) => (
            <Pressable
              key={item.id}
              style={[
                styles.chip,
                selectedGrapesTypes.includes(item.id) && styles.selectedChip,
              ]}
              onPress={() => toggleGrapesTypeSelection(item.id)}>
              <Text
                style={[
                  styles.chipText,
                  selectedGrapesTypes.includes(item.id) &&
                    styles.selectedChipText,
                ]}>
                {item.name}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.divider} />
        <Text style={styles.subTitle}>Popular Country</Text>
        <View style={styles.chipContainer}>
          {popularCountry.map((item, index) => (
            <Pressable
              key={item.id}
              style={[
                styles.chip,
                selectedPopularCountry.includes(item.id) && styles.selectedChip,
              ]}
              onPress={() => togglePopularCountrySelection(item.id)}>
              <Text
                style={[
                  styles.chipText,
                  selectedPopularCountry.includes(item.id) &&
                    styles.selectedChipText,
                ]}>
                {item.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </BottomSheetScrollView>

      <View style={styles.buttonContainer}>
        <WineHuntButton
          text="Clear"
          extraButtonStyle={styles.clearButton}
          extraTextStyle={styles.clearButtonText}
          onPress={() => {
            bottomSheetModalRef2.current?.close();
          }}
        />
        <WineHuntButton
          text="Apply"
          extraButtonStyle={styles.applyButton}
          onPress={() => {
            bottomSheetModalRef2.current?.close();
          }}
        />
      </View>
    </BottomSheet>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  bottomSheetHandle: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: Colors.white,
  },
  handleIndicator: {
    backgroundColor: Colors.gray10,
    height: 6,
    width: 50,
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
    fontWeight: '500',
    fontSize: 16,
  },
  subTitle: {
    fontFamily: Fonts.InterMedium,
    color: Colors.red,
    fontWeight: '500',
    fontSize: 15,
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  chip: {
    padding: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: Colors.gray5,
    borderRadius: 10,
    alignItems: 'center',
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
  },
  flatListContent: {
    gap: 10,
  },
  priceRangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-start',
  },
  priceRangeText: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontWeight: '500',
    fontSize: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: Colors.white,
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
});
