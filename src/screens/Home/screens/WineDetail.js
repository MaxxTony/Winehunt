import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts} from '../../../constant/Styles';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const WineDetail = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(1);

  const tab = [
    {
      id: 1,
      name: 'Descriptions',
    },
    {
      id: 2,
      name: 'Reviews',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.semiCircleContainer}>
          <Image
            source={require('../images/bg.png')}
            style={styles.semiCircleImage}
          />
        </View>
        <View style={styles.headerContainer}>
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.goBack()}>
            <Fontisto name="angle-left" size={20} color={Colors.white} />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <AntDesign name="hearto" size={25} color={Colors.white} />
          </Pressable>
        </View>

        <View style={styles.contentContainer}>
          <Image
            source={require('../images/newbottle.png')}
            style={styles.bottleImage}
            resizeMode="contain"
          />
          <View style={styles.infoContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.vendorName}>Vendor shop Name</Text>
              <Pressable
                style={{
                  padding: 3,
                  paddingHorizontal: 5,
                  backgroundColor: Colors.green,
                  alignItems: 'center',
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: Fonts.InterMedium,
                    fontWeight: '600',
                    color: Colors.white,
                  }}>
                  View Detail
                </Text>
              </Pressable>
            </View>
            <Text style={styles.wineName}>Taylors (Red Grape juice)</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>
                Price <Text style={styles.priceValue}>£12.00</Text>
              </Text>
              <View style={styles.ratingContainer}>
                <AntDesign name="star" size={18} color={Colors.yellow} />
                <Text style={styles.ratingText}>4.3</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Add To Cart</Text>
              </Pressable>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Try Me</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View style={{padding: 20}}>
          {/* <CustomTabView /> */}
          {/* <FlatList
            data={tab}
            horizontal
            scrollEnabled={false}
            keyExtractor={item => item.id.toString()}
            renderItem={({item, index}) => {
              const isActive = item.id === activeTab;
              return (
                <Pressable
                  onPress={() => setActiveTab(item.id)}
                  style={{
                    width: width / 2,
                    paddingVertical: 12,
                    alignItems: 'center',
                    borderBottomWidth: isActive ? 2 : 1,
                    borderBottomColor: isActive ? Colors.red : Colors.gray,
                    backgroundColor: '#FFF',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: isActive ? 'bold' : 'normal',
                      color: isActive ? Colors.black : 'black',
                    }}>
                    {item.name}
                  </Text>
                </Pressable>
              );
            }}
          /> */}
          {/* {activeTab === 1 ? (
            <View style={{paddingVertical: 20, gap: 20}}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: Fonts.InterMedium,

                  color: Colors.black,
                }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type{' '}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Fonts.PhilosopherBold,
                  color: Colors.black,
                }}>
                Suggested for you
              </Text>
              <Text>NO Suggestion Found </Text>
            </View>
          ) : (
            <View style={{paddingVertical: 20, gap: 20}}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: Fonts.PhilosopherBold,
                  color: Colors.black,
                }}>
                No Review Found yet
              </Text>
            </View>
          )} */}
        </View>
      </ScrollView>
    </View>
  );
};

export default WineDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    paddingBottom: 80,
  },

  semiCircleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    overflow: 'hidden',
    height: 200,
    width: '100%',
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
  semiCircleImage: {
    height: 400,
    width: '100%',
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    resizeMode: 'cover',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    padding: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bottleImage: {
    height: 245,
    width: 100,
  },
  infoContainer: {
    flex: 1,
    gap: 5,
  },
  vendorName: {
    fontSize: 18,
    fontFamily: Fonts.InterMedium,
    fontWeight: '800',
    color: Colors.black,
    flex: 1,
  },
  wineName: {
    fontSize: 16,
    fontFamily: Fonts.InterMedium,
    fontWeight: '800',
    color: Colors.black,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 18,
    fontFamily: Fonts.InterMedium,
    fontWeight: '800',
    color: Colors.black,
  },
  priceValue: {
    color: Colors.red,
    fontSize: 25,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingText: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: Fonts.InterRegular,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    padding: 8,
    paddingHorizontal: 15,
    backgroundColor: Colors.red,
    alignItems: 'center',
    borderRadius: 10,
    flex: 0.43,
  },
  buttonText: {
    fontSize: 12,
    fontFamily: Fonts.InterMedium,
    fontWeight: '800',
    color: Colors.white,
  },
});
