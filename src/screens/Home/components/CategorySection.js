import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {MultiSwitch} from 'react-native-multiswitch-selector';
import {Colors, Fonts} from '../../../constant/Styles';

const {width} = Dimensions.get('window');

const CategorySection = ({categories, type, setType, navigation}) => {
  return (
    <View style={styles.categorySection}>
      <Text style={styles.categoryTitle}>Explore Categories</Text>

      <MultiSwitch
        allStates={['Wine types', 'Popular countries', 'Popular grapes']}
        currentState={type}
        changeState={setType}
        mode="white"
        styleRoot={styles.multiSwitchRoot}
        styleAllStatesContainer={styles.multiSwitchContainer}
        styleActiveState={styles.activeState}
        styleActiveStateText={styles.activeStateText}
        styleInactiveStateText={styles.inactiveStateText}
      />

      <View style={styles.listContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({index, item}) => (
            <Pressable
              style={({pressed}) => [
                styles.categoryCard,
                pressed && styles.categoryCardPressed,
              ]}
              key={index}
              onPress={() =>
                navigation.navigate('WineList', {
                  item: item,
                })
              }>
              <View style={styles.categoryImageContainer}>
                <Image
                  source={{uri: item.image}}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
                <View style={styles.categoryOverlay} />
                <View style={styles.categoryGradient} />
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>Explore</Text>
                </View>
              </View>
              <View style={styles.categoryContent}>
                <Text
                  style={styles.categoryName}
                  allowFontScaling={false}>
                  {item?.name}
                </Text>
                <Text style={styles.categorySubtitle}>
                  Discover wines
                </Text>
              </View>
            </Pressable>
          )}
          keyExtractor={(item, index) => `category-${item?.id || index}`}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categorySection: {
    marginVertical: 15,
  },
  categoryTitle: {
    fontSize: 26,
    fontFamily: Fonts.InterBold,
    color: Colors.black,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  multiSwitchRoot: {
    borderRadius: 16,
    padding: 0,
    marginBottom: 15,
    marginTop: 5,
  },
  multiSwitchContainer: {
    backgroundColor: Colors.gray12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.gray5,
    paddingHorizontal: 6,
    paddingVertical: 6,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  activeState: {
    backgroundColor: Colors.red,
    borderRadius: 12,
    shadowColor: Colors.red,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.red2,
  },
  activeStateText: {
    fontFamily: Fonts.InterMedium,
    color: Colors.white,
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  inactiveStateText: {
    color: Colors.gray8,
    fontFamily: Fonts.InterMedium,
    fontWeight: '500',
    fontSize: 12,
    letterSpacing: 0.2,
  },
  listContainer: {
    paddingVertical: 15,
  },
  horizontalList: {
    gap: 18,
    paddingHorizontal: 8,
  },
  categoryCard: {
    width: 150,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    transform: [{scale: 1}],
    borderWidth: 1,
    borderColor: Colors.gray5,
  },
  categoryCardPressed: {
    transform: [{scale: 0.96}],
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  categoryImageContainer: {
    position: 'relative',
    height: 110,
    width: '100%',
  },
  categoryImage: {
    height: '100%',
    width: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  categoryGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  categoryContent: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  categoryName: {
    fontSize: 15,
    fontFamily: Fonts.InterMedium,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  categorySubtitle: {
    fontSize: 11,
    fontFamily: Fonts.InterRegular,
    color: Colors.gray7,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontFamily: Fonts.InterMedium,
    color: Colors.white,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default CategorySection; 