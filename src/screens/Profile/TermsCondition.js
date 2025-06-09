import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useIsFocused, useNavigation} from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import {Dimensions} from 'react-native';
import Constants from '../../helper/Constant';
import { Colors, Fonts } from '../../constant/Styles';

const TermsCondition = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {width} = Dimensions.get('window');
  const [loading, setLoading] = useState(false);
  const [termsText, setTermsText] = useState('');

  useEffect(() => {
    if (isFocused) {
      fetchTerms();
    }
  }, [isFocused]);

  const fetchTerms = async () => {
    try {
      const datas = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(datas)?.token;
      const url = Constants.baseUrl10 + "get-terms";
    
      setLoading(true);
      const res = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('res', res, 'some');
      const description = res?.data?.data?.terms || 'No terms found.';
      console.log(description);

      setTermsText(description);
    } catch (error) {
      if (error.response) {
        showWarning(error.response.data?.message);
      } else if (error.request) {
      } else {
      }
      setTermsText('Failed to load terms and conditions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <BackNavigationWithTitle
        title="Terms & Condition"
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

export default TermsCondition;

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
