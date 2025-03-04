import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors, Fonts} from '../../constant/Styles';
import Feather from 'react-native-vector-icons/Feather';
import WineHuntButton from '../../common/WineHuntButton';
import ActionnModal from '../../Modal/ActionnModal';
import DeleteModal from '../../Modal/DeleteModal';
import AddressModal from '../../Modal/AddressModal';

const AddressList = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();

  const [showActionModal, setShowActionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Address List"
        onPress={() => navigation.goBack()}
      />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{
            fontSize: 16,
            color: Colors.black,
            fontFamily: Fonts.InterMedium,
            fontWeight: '600',
          }}>
          NO Address Found At the Moment
        </Text>
      </View>
      <FlatList
        data={Array.from({length: 0})}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderColor: Colors.gray2,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{gap: 5, flex: 1}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.black,
                    fontFamily: Fonts.InterMedium,
                    fontWeight: '600',
                  }}>
                  Address 1
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: Colors.black,
                    fontFamily: Fonts.InterMedium,
                    fontWeight: '500',
                  }}>
                  6391 Elgin St. Celina, Delaware 10299
                </Text>
              </View>
              <Pressable onPress={() => setShowActionModal(true)}>
                <Feather name="more-vertical" size={25} color={Colors.red} />
              </Pressable>
            </View>
          );
        }}
      />
      <View style={{marginTop: 'auto', padding: 20, paddingBottom: 30}}>
        {/* <WineHuntButton
          text="Add New Address"
          onPress={() => setShowAddAddressModal(true)}
        /> */}
      </View>

      <ActionnModal
        setShowActionModal={setShowActionModal}
        showActionModal={showActionModal}
        onDelete={() => {
          setShowActionModal(false);
          setShowDeleteModal(true);
        }}
        onEdit={() => console.log('hurray!!!')}
      />

      {showDeleteModal && (
        <DeleteModal
          onCancel={() => setShowDeleteModal(false)}
          onDelete={() => setShowDeleteModal(false)}
        />
      )}
      <AddressModal
        setShowAddAddressModal={setShowAddAddressModal}
        showAddAddressModal={showAddAddressModal}
      />
    </View>
  );
};

export default AddressList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
