import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';

const quizData = [
  {
    question:
      'Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.',
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
  },
  {
    question: 'Another sample question goes here?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
  },
  {
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Rome'],
  },
  {
    question: 'React Native is used for?',
    options: ['Mobile Apps', 'Web Apps', 'Desktop Apps', 'AI'],
  },
  {
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
  },
];
const Quizquestion = () => {
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      navigation.goBack(); // Auto navigate back when timer reaches 0
    }
  }, [timer]);

  const handleAnswerSelection = index => {
    setSelectedAnswers({...selectedAnswers, [currentQuestion]: index});
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimer(10); // Reset timer for next question
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setTimer(10); // Reset timer when going back
    }
  };

  return (
    <View style={styles.container}>
      <BackNavigationWithTitle
        title="Quiz For You"
        onPress={() => navigation.goBack()}
      />

      <View style={styles.container1}>
        <Text style={styles.totalQuiz}>
          Total Quiz: 05{' '}
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
          {currentQuestion + 1}. {quizData[currentQuestion].question}
        </Text>

        {quizData[currentQuestion].options.map((option, index) => (
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

        {/* Navigation Buttons */}
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

          <Modal
            transparent={true}
            visible={modalVisible}
            animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Close Button */}
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}>
                  <Text style={styles.closeText}>×</Text>
                </TouchableOpacity>

                {/* Image */}
                <Image
                  source={require('../Profile/images/modal.png')}
                  style={styles.image}
                />

                {/* Text */}
                <TouchableOpacity style={styles.milestoneBox}>
                  <Text style={styles.milestoneText}>
                    Total Earn Milestones{' '}
                    <Text style={styles.amount}>20.00</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity
            onPress={handleNext}
            disabled={currentQuestion === quizData.length - 1}
            style={styles.navButton}>
            <Text style={styles.navText}>{'Next >'}</Text>
          </TouchableOpacity>
        </View>
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

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 370,
    height: 448,
    alignItems: 'center',
  },

  closeButton: {position: 'absolute', right: 10, top: 10},
  closeText: {fontSize: 20, color: 'black'},

  image: {width: 282, height: 319, resizeMode: 'contain', marginBottom: 20},

  milestoneBox: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  milestoneText: {color: 'white', fontWeight: 'bold', fontSize: 14},
  amount: {fontWeight: 'bold', fontSize: 16},
});
