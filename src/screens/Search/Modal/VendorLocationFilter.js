import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../../constant/Styles';
import WineHuntButton from '../../../common/WineHuntButton';
import Fontisto from 'react-native-vector-icons/Fontisto';
import BottomSheet from '@gorhom/bottom-sheet';

const VendorLocationFilter = ({
  bottomSheetModalRef,
  snapPoints,
  vendorLocation,
  selectedVendor,
  setSelectedVendor,
}) => {
  return (
    <BottomSheet
      ref={bottomSheetModalRef}
      index={-1}
      snapPoints={snapPoints}
      handleStyle={styles.bottomSheetHandle}
      handleIndicatorStyle={styles.handleIndicator}>
      <View style={styles.container}>
        <Text style={styles.filterText}>Filter</Text>
        <Text style={styles.chooseVendorText}>
          Choose your Vendor locations
        </Text>
        <FlatList
          data={vendorLocation}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({item}) => {
            const isSelected = item.id === selectedVendor;

            return (
              <Pressable
                onPress={() => setSelectedVendor(item.id)}
                style={styles.listItem}>
                <Fontisto
                  name={isSelected ? 'radio-btn-active' : 'radio-btn-passive'}
                  color={isSelected ? Colors.red2 : Colors.gray11}
                  size={25}
                />
                <Text style={styles.vendorText}>{item?.name}</Text>
              </Pressable>
            );
          }}
          ListFooterComponent={() => (
            <View style={styles.footerContainer}>
              <WineHuntButton
                text="Clear"
                extraButtonStyle={styles.clearButton}
                extraTextStyle={styles.clearButtonText}
                onPress={() => {
                  setSelectedVendor(null);
                  bottomSheetModalRef.current?.close();
                }}
              />
              <WineHuntButton
                text="Apply"
                extraButtonStyle={styles.applyButton}
                onPress={() => {
                  console.log('Selected Vendor:', selectedVendor);
                  bottomSheetModalRef.current?.close();
                }}
              />
            </View>
          )}
        />
      </View>
    </BottomSheet>
  );
};

export default VendorLocationFilter;

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
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    padding: 20,
    paddingBottom: 0,
    gap: 20,
  },
  filterText: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontWeight: '500',
    fontSize: 16,
  },
  chooseVendorText: {
    fontFamily: Fonts.InterMedium,
    color: Colors.red,
    fontWeight: '500',
    fontSize: 15,
  },
  listContainer: {
    gap: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-start',
  },
  vendorText: {
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    fontWeight: '500',
    fontSize: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 5,
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
