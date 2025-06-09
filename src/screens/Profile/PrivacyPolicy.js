import {ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {Colors, Fonts} from '../../constant/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../../helper/Constant';
import RenderHtml from 'react-native-render-html';
import axios from 'axios';


const PrivacyPolicy = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {width} = Dimensions.get('window');
  const [loading, setLoading] = useState(false);
  const [termsText, setTermsText] = useState('');
  useEffect(() => {
    if (isFocused) {
      fetchPrivacy();
    }
  }, [isFocused]);

  const fetchPrivacy = async () => {
    try {
      const datas = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(datas)?.token;
      const url = Constants.baseUrl10 + 'get-privacy';
  
   
      setLoading(true);
      const res = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res)
      const description = res?.data?.data?.privacy || 'No terms found.';
      setTermsText(description);
    } catch (error) {
      console.log(error)
      if (error.response) {
        showWarning(error.response.data?.message);
      }
      // setTermsText('Failed to load terms and conditions.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Privacy Policy"
        onPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <RenderHtml
            contentWidth={width}
            source={{html: termsText}}
            tagsStyles={{
              body: {
                color: Colors.black, // Or use dynamic theming
              },
              p: {
                color: Colors.black,
              },
              span: {
                color: Colors.black,
              },
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    padding: 16,
    color: 'black',
  },
  termsText: {
    fontSize: 16,
    color: 'black',
    fontFamily: Fonts.Regular,
    lineHeight: 24,
  },
});
