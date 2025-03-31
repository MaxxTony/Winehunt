import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Colors} from '../../constant/Styles';

const Quiz = () => {
  const navigation = useNavigation();
  const [quizList, setQuizList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const getQuiz = async () => {
    setRefreshing(true);
    try {
      const datas = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(datas)?.token;
      const url = 'http://13.48.249.80:8000/api/other/get-quiz';
      const res = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.status === 200 && res?.data?.data) {
        setQuizList(res?.data?.data);
      }
    } catch (error) {
      console.log('Error fetching quiz:', error);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    getQuiz();
  }, [isFocused]);

  const onRefresh = useCallback(() => {
    getQuiz();
  }, []);

  const renderQuizItem = ({item}) => (
    <View
      style={[styles.quizItem, item.isComplete === 1 && styles.completedQuiz]}>
      <Text style={styles.quizTitle} allowFontScaling={false}>{item.title}</Text>
      {item.isComplete === 1 ? (
        <View style={styles.completeButton}>
          <Text style={styles.completeText} allowFontScaling={false}>Completed</Text>
        </View>
      ) : (
        <Pressable
          style={styles.startButton}
          onPress={() => navigation.navigate('Quizquestion', {data: item})}>
          <Text style={styles.startText} allowFontScaling={false}>Start</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <BackNavigationWithTitle
        title="Quiz"
        onPress={() => navigation.goBack()}
      />
      <View style={styles.imageContainer}>
        <Image source={require('./images/quiz.png')} style={styles.quizImage} />
      </View>
      <Text style={styles.heading} allowFontScaling={false}>Available Quizzes</Text>
      <FlatList
        data={quizList}
        keyExtractor={item => item.id.toString()}
        renderItem={renderQuizItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.red]}

          />
        }allowFontScaling={false}
      />
    </View>
  );
};

export default Quiz;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  quizImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  quizItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    margin: 5,
  },
  completedQuiz: {
    backgroundColor: '#d3ffd3', // Light green background for completed quizzes
  },
  startButton: {
    padding: 5,
    borderRadius: 5,
    paddingHorizontal: 20,
    backgroundColor: Colors.red,
  },
  startText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  completeButton: {
    padding: 5,
    borderRadius: 5,
    paddingHorizontal: 20,
    backgroundColor: 'gray',
  },
  completeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  quizTitle:{
    color:'black'
  }
});
