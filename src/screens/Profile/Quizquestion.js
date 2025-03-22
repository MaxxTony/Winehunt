import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Quizquestion = () => {
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [quizData, setQuizData] = useState([]);

  const getProfile = async () => {
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
        const formattedQuiz = res.data.data.flatMap(master =>
          master.quizzes.map(q => ({
            question: q.question,
            options: q.answers.map(a => a.text),
          })),
        );

        setQuizData(formattedQuiz);
      }
    } catch (error) {
      console.log('Error fetching quiz:', error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      navigation.goBack();
    }
  }, [timer]);

  const handleAnswerSelection = index => {
    setSelectedAnswers({...selectedAnswers, [currentQuestion]: index});
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimer(10);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setTimer(10);
    }
  };

  return (
    <View style={styles.container}>
      <BackNavigationWithTitle
        title="Quiz For You"
        onPress={() => navigation.goBack()}
      />

      <View style={styles.container1}>
        {quizData.length > 0 ? (
          <>
            <Text style={styles.totalQuiz}>
              Total Quiz: {quizData.length}{' '}
              <Text style={[styles.timer, timer <= 3 && styles.timerDanger]}>
                (Time: {timer} Sec)
              </Text>
            </Text>

            <View style={styles.progressBarContainer}>
              {quizData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressBar,
                    currentQuestion >= index && styles.progressActive,
                  ]}
                />
              ))}
            </View>

            <Text style={styles.question}>
              {currentQuestion + 1}. {quizData[currentQuestion]?.question}
            </Text>

            {quizData[currentQuestion]?.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  selectedAnswers[currentQuestion] === index &&
                    styles.selectedOption,
                ]}
                onPress={() => handleAnswerSelection(index)}>
                <Text
                  style={[
                    styles.optionText,
                    selectedAnswers[currentQuestion] === index &&
                      styles.selectedText,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.navigation}>
              <TouchableOpacity
                onPress={handlePrevious}
                disabled={currentQuestion === 0}
                style={styles.navButton}>
                <Text style={styles.navText}>{'< Preview'}</Text>
              </TouchableOpacity>

              {currentQuestion === quizData.length - 1 ? (
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => setModalVisible(true)}>
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                onPress={handleNext}
                disabled={currentQuestion === quizData.length - 1}
                style={styles.navButton}>
                <Text style={styles.navText}>{'Next >'}</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text>Loading quiz...</Text>
        )}
      </View>
    </View>
  );
};

export default Quizquestion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  container1: {padding: 20, backgroundColor: '#fff', flex: 1},
  totalQuiz: {fontSize: 16, fontWeight: 'bold', marginTop: 20},
  timer: {color: 'green', fontSize: 14},
  progressBarContainer: {flexDirection: 'row', marginTop: 10},
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 2,
  },
  progressActive: {backgroundColor: 'red'},
  question: {fontSize: 16, fontWeight: '600', marginTop: 20},
  option: {
    padding: 15,
    marginTop: 15,
    borderRadius: 5,
    backgroundColor: '#eee',
  },
  selectedOption: {backgroundColor: 'red'},
  optionText: {fontSize: 16},
  selectedText: {color: '#fff'},
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navButton: {padding: 10, backgroundColor: 'red', borderRadius: 20},
  navText: {color: 'white', fontSize: 18},
  submitButton: {backgroundColor: 'green', padding: 15, borderRadius: 5},
  submitText: {color: 'white', fontWeight: 'bold'},
});
