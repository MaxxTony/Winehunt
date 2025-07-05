import React from 'react';
import {
  Dimensions,
  ImageBackground,
  Pressable,
  Text,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Colors, Fonts} from '../../../constant/Styles';

const {width} = Dimensions.get('window');

const OffersCarousel = ({
  offers,
  loading,
  navigation,
  userData,
}) => {
  const renderCarouselItem = ({item}) => {
    const toDate = new Date(item.to_date);
    const fromDate = new Date(item.from_date);
    const currentDate = new Date();
    const isExpired = currentDate > toDate;
    const isActive = currentDate >= fromDate && currentDate <= toDate;
    
    const formattedToDate = !isNaN(toDate)
      ? `${toDate.getDate().toString().padStart(2, '0')}/${(
          toDate.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}/${toDate.getFullYear()}`
      : 'N/A';

    const daysLeft = Math.ceil((toDate - currentDate) / (1000 * 60 * 60 * 24));
    
    return (
      <Pressable
        style={styles.carouselItem}
        onPress={() => {
          if (item?.product_id !== null) {
            navigation.navigate('WineDetail', {
              item: item?.product_id,
            });
          } else {
            navigation.navigate('VendorDetail', {
              item: item,
              userCoordinates: {
                latitude: userData?.latitude,
                longitude: userData?.longitude,
              },
            });
          }
        }}>
        <ImageBackground
          source={{uri: item.image}}
          style={styles.carouselImageBackground}
          imageStyle={styles.carouselImageStyle}>
          <View style={styles.carouselGradientOverlay}>
            <View style={styles.carouselOverlay}>
              <View style={styles.carouselTopSection}>
                {isExpired ? (
                  <View style={styles.expiredBadge}>
                    <Text style={styles.expiredText}>EXPIRED</Text>
                  </View>
                ) : isActive ? (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeText}>ACTIVE</Text>
                  </View>
                ) : (
                  <View style={styles.upcomingBadge}>
                    <Text style={styles.upcomingText}>UPCOMING</Text>
                  </View>
                )}
                
                {!isExpired && daysLeft > 0 && daysLeft <= 7 && (
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentText}>
                      {daysLeft === 1 ? '1 DAY LEFT' : `${daysLeft} DAYS LEFT`}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.carouselContentSection}>
                <View style={styles.carouselTextContainer}>
                  {item.name ? (
                    <Text style={styles.carouselOfferName} numberOfLines={2} allowFontScaling={false}>
                      {item.name}
                    </Text>
                  ) : null}
                  
                  <Text style={styles.carouselOfferDesc} numberOfLines={3} allowFontScaling={false}>
                    {item.offer_desc}
                  </Text>
                </View>

                <View style={styles.carouselFooter}>
                  <View style={styles.validityContainer}>
                    <Text style={styles.validityLabel} allowFontScaling={false}>
                      Valid until
                    </Text>
                    <Text style={styles.validityDate} allowFontScaling={false}>
                      {formattedToDate}
                    </Text>
                  </View>
                  
                  <View style={styles.exploreButton}>
                    <Text style={styles.exploreButtonText} allowFontScaling={false}>
                      Explore
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    );
  };

  if (!offers?.length) return null;

  return (
    <>
      <Text style={styles.carouselSimpleTitle} allowFontScaling={false}>
        Special Offers
      </Text>
      <View style={styles.carouselContainer}>
        {loading ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <SkeletonPlaceholder borderRadius={10}>
              <SkeletonPlaceholder.Item
                width={width}
                height={width / 1.8}
              />
            </SkeletonPlaceholder>
          </View>
        ) : (
          <Carousel
            loop
            width={width}
            height={width / 2}
            autoPlay={true}
            autoPlayInterval={4000}
            data={offers}
            scrollAnimationDuration={800}
            pagingEnabled={true}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
            renderItem={renderCarouselItem}
          />
        )}
      </View>
    </>
  );
};

const styles = {
  carouselSimpleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.black,
    marginLeft: 20,
    marginTop: 10,
  },
  carouselContainer: {
    paddingHorizontal: 0,
    paddingTop: 20,
    overflow: 'visible',
  },
  carouselItem: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    marginHorizontal: 0,
  },
  carouselImageBackground: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  carouselImageStyle: {
    borderRadius: 16,
  },
  carouselGradientOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
  },
  carouselOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    borderRadius: 16,
  },
  carouselTopSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  expiredBadge: {
    backgroundColor: Colors.red,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  expiredText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: Fonts.InterBold,
  },
  activeBadge: {
    backgroundColor: Colors.green,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  activeText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: Fonts.InterBold,
  },
  upcomingBadge: {
    backgroundColor: Colors.yellow,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  upcomingText: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: Fonts.InterBold,
  },
  urgentBadge: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  urgentText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: Fonts.InterBold,
  },
  carouselContentSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  carouselTextContainer: {
    flex: 1,
    marginBottom: 20,
  },
  carouselOfferName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
    fontFamily: Fonts.InterBold,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  carouselOfferDesc: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: Fonts.InterRegular,
    lineHeight: 22,
  },
  carouselFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  validityContainer: {
    flex: 1,
  },
  validityLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: Fonts.InterRegular,
    marginBottom: 4,
  },
  validityDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    fontFamily: Fonts.InterBold,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  exploreButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  exploreButtonText: {
    color: Colors.red,
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: Fonts.InterBold,
  },
};

export default OffersCarousel; 