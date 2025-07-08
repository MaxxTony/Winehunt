import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts } from '../../constant/Styles';
import WineHuntButton from '../../common/WineHuntButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { showSucess } from '../../helper/Toastify';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Quizquestion = (props) => {
  const quizInfo = props?.route?.params?.data;
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Handle answer selection
  const handleAnswerSelection = (answer, index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const isCorrect = answer.is_right === 1;
    if (isCorrect) {
      setScore((prevScore) => prevScore + quizInfo.quizzes[currentIndex].mark);
      setCorrectAnswers((prevCount) => prevCount + 1);
    }
    setAnswers((prev) => [
      ...prev,
      {
        question: quizInfo.quizzes[currentIndex].question,
        selected: answer.text,
        isCorrect,
        correct: quizInfo.quizzes[currentIndex].answers.find((a) => a.is_right === 1)?.text,
      },
    ]);
    setTimeout(() => {
      goToNextQuestion();
    }, 1200);
  };

  // Go to next question or submit
  const goToNextQuestion = () => {
    if (currentIndex < quizInfo.quizzes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      onSubmitQuiz();
    }
  };

  // Submit quiz
  const onSubmitQuiz = async () => {
    try {
      const datas = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(datas)?.token;
      const url = 'http://13.48.249.80:8000/api/other/update-quiz-points';
      const data = {
        quiz_id: quizInfo?.id,
        scores: correctAnswers,
        points: score,
      };
      console.log(data);
      const res = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.status === 200) {
        console.log(res?.data)
        showSucess(res?.data?.message);
        setShowModal(true);
      }
    } catch (error) {
      console.log('Error updating quiz result :', error);
      setShowModal(true); // Still show modal for UX
    }
  };

  // UI Components
  const renderAnswer = ({ item, index }) => {
    const isSelected = selectedAnswer === index;
    const isCorrect = item.is_right === 1;
    const showCorrect =
      selectedAnswer !== null && isCorrect && (selectedAnswer !== index || isSelected);
    let bgColor = Colors.gray12;
    let borderColor = 'transparent';
    let icon = null;
    if (selectedAnswer !== null) {
      if (isSelected) {
        if (isCorrect) {
          bgColor = '#4BB543';
          borderColor = '#4BB543';
          icon = <AntDesign name="checkcircle" size={22} color="white" style={{ marginLeft: 8 }} />;
        } else {
          bgColor = '#E74C3C';
          borderColor = '#E74C3C';
          icon = <AntDesign name="closecircle" size={22} color="white" style={{ marginLeft: 8 }} />;
        }
      } else if (showCorrect) {
        bgColor = '#4BB543';
        borderColor = '#4BB543';
        icon = <AntDesign name="checkcircle" size={22} color="white" style={{ marginLeft: 8 }} />;
      }
    }
    return (
      <TouchableOpacity
        style={[
          styles.answerOption,
          {
            backgroundColor: bgColor,
            borderColor,
            flexDirection: 'row',
            alignItems: 'center',
            opacity: selectedAnswer !== null && !isSelected && !showCorrect ? 0.6 : 1,
          },
        ]}
        onPress={() => handleAnswerSelection(item, index)}
        disabled={selectedAnswer !== null}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Answer option: ${item.text}`}
      >
        <Text
          style={[
            styles.answerText,
            isSelected && { color: 'white' },
            showCorrect && { color: 'white' },
          ]}
          allowFontScaling={false}
        >
          {item.text}
        </Text>
        {icon}
      </TouchableOpacity>
    );
  };



  return (
    <View style={styles.container}>
      <BackNavigationWithTitle
        title={quizInfo?.title}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.quizInfoContainer}>
        <Text style={styles.totalQuizText} allowFontScaling={false}>
          Question {currentIndex + 1} of {quizInfo.quizzes.length}
        </Text>
      </View>
      {/* Question Progress Dots */}
      <View style={styles.questionDotsContainer}>
        {quizInfo?.quizzes?.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.progressDot,
              idx < currentIndex
                ? { backgroundColor: '#4BB543' }
                : idx === currentIndex
                ? { backgroundColor: Colors.green2 }
                : { backgroundColor: Colors.gray12 },
            ]}
          />
        ))}
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText} allowFontScaling={false}>
          {quizInfo.quizzes[currentIndex]?.question}
        </Text>
        <FlatList
          data={quizInfo.quizzes[currentIndex]?.answers}
          contentContainerStyle={styles.answersContainer}
          renderItem={renderAnswer}
          keyExtractor={(_, idx) => idx.toString()}
        />
      </View>
      {/* Result Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} allowFontScaling={false}>
                🎉 Quiz Complete! 🎉
              </Text>
             
            </View>
            
            <Image
              source={require('./images/score.png')}
              style={styles.resultImage}
              resizeMode="contain"
            />
            
            <View style={styles.scoreContainer}>
              <Text
                style={[
                  styles.modalScore,
                  { color: correctAnswers < Math.ceil(quizInfo.quizzes.length / 2) ? '#E74C3C' : '#4BB543' },
                ]}
                allowFontScaling={false}
              >
                {correctAnswers} / {quizInfo.quizzes.length} Correct
              </Text>
              <Text style={styles.pointsText} allowFontScaling={false}>
                Total Points Earned: {score}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <WineHuntButton 
                text="Continue" 
                onPress={() => {
                  navigation.goBack();
                  setShowModal(false);
                }}
                extraButtonStyle={styles.continueButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Quizquestion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  quizInfoContainer: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalQuizText: {
    ...Fonts.PhilosopherBold,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
  },
  questionDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  progressDot: {
    width: 16,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  questionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  questionText: {
    ...Fonts.InterRegular,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 18,
  },
  answersContainer: {
    gap: 18,
    marginTop: 10,
  },
  answerOption: {
    padding: 16,
    backgroundColor: Colors.gray12,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  answerText: {
    ...Fonts.InterRegular,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
  },
  resultImage: {
    height: 180,
    width: 180,
    alignSelf: 'center',
    marginBottom: 10,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalScore: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pointsText: {
    fontSize: 16,
    color: Colors.black,
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
  continueButton: {
    backgroundColor: Colors.green2,
    paddingVertical: 15,
  },

});
