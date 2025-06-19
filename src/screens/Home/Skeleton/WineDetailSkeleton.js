import React from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
const { width } = Dimensions.get('window');

const SkeletonPlaceholder = ({ style }) => (
  <View style={[styles.skeleton, style]} />
);

const WineDetailSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Top semi-circle background */}
      <View style={styles.semiCircle} />
      {/* Header */}
      <View style={styles.header}>
        <SkeletonPlaceholder style={styles.icon} />
        <SkeletonPlaceholder style={styles.icon} />
      </View>
      {/* Bottle image and info */}
      <View style={styles.row}>
        <SkeletonPlaceholder style={styles.bottle} />
        <View style={{ flex: 1, marginLeft: 16 }}>
          <SkeletonPlaceholder style={styles.vendorName} />
          <SkeletonPlaceholder style={styles.wineName} />
          <SkeletonPlaceholder style={styles.price} />
          <SkeletonPlaceholder style={styles.rating} />
          <View style={styles.buttonRow}>
            <SkeletonPlaceholder style={styles.button} />
            <SkeletonPlaceholder style={styles.button} />
          </View>
        </View>
      </View>
      {/* Tabs */}
      <View style={styles.tabRow}>
        <SkeletonPlaceholder style={styles.tab} />
        <SkeletonPlaceholder style={styles.tab} />
      </View>
      {/* Description block */}
      <SkeletonPlaceholder style={styles.description} />
      {/* Suggested for you title */}
      <SkeletonPlaceholder style={styles.suggestedTitle} />
      {/* Suggested items */}
      <View style={styles.suggestedRow}>
        <SkeletonPlaceholder style={styles.suggestedItem} />
        <SkeletonPlaceholder style={styles.suggestedItem} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
    paddingHorizontal: 16,
  },
  semiCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    backgroundColor: '#f2f2f2',
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 10,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  bottle: {
    width: 70,
    height: 220,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
  },
  vendorName: {
    width: 120,
    height: 18,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
  },
  wineName: {
    width: 100,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
  },
  price: {
    width: 80,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
  },
  rating: {
    width: 60,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    width: 90,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
  },
  tabRow: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 16,
    gap: 10,
  },
  tab: {
    width: width / 2 - 24,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  description: {
    width: '100%',
    height: 60,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    marginBottom: 16,
  },
  suggestedTitle: {
    width: 160,
    height: 20,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 12,
  },
  suggestedRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  suggestedItem: {
    width: width / 2 - 28,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
});

export default WineDetailSkeleton; 