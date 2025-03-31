import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Button,
  Pressable,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import {useNavigation} from '@react-navigation/native';
import {Colors, Fonts} from '../../constant/Styles';
import WineHuntButton from '../../common/WineHuntButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {showSucess} from '../../helper/Toastify';

const Quizquestion = props => {
  const quizInfo = props?.route?.params?.data;
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleAnswerSelection = (answer, index) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    setSelectedAnswer(index);

    const isCorrect = answer.is_right === 1;
    if (isCorrect) {
      setScore(prevScore => prevScore + quizInfo.quizzes[currentIndex].mark); // Add marks
      setCorrectAnswers(prevCount => prevCount + 1);
    }

    setAnswers([
      ...answers,
      {
        question: quizInfo.quizzes[currentIndex].question,
        selected: answer.text,
        isCorrect,
      },
    ]);

    setTimeout(() => {
      if (currentIndex < quizInfo.quizzes.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
      } else {
        onSubmitQuiz();
      }
    }, 1000);
  };

  const onSubmitQuiz = async () => {
    try {
      const datas = await AsyncStorage.getItem('userDetail');
      const token = JSON.parse(datas)?.token;
      const url = 'http://13.48.249.80:8000/api/other/update-quiz-milestone';
      const data = {
        quiz_id: quizInfo?.id,
        scores: correctAnswers,
        milestones: score,
      };
      const res = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.status === 200) {
        showSucess(res?.data?.message);
        setShowModal(true); // Show the results modal
      }
    } catch (error) {
      console.log('Error updating quiz result :', error);
    }
  };

  return (
    <View style={styles.container}>
      <BackNavigationWithTitle
        title={quizInfo?.title}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.quizInfoContainer}>
        <Text style={styles.totalQuizText} allowFontScaling={false}>
          Total Quiz: {quizInfo.quizzes.length}
        </Text>
        <Text style={styles.timerText} allowFontScaling={false}>(Time: 10 sec)</Text>
      </View>
      <View style={styles.progressBarContainer}>
        {quizInfo?.quizzes?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBar,
              {backgroundColor: index <= currentIndex ? Colors.green2 : 'gray'},
            ]}
          />
        ))}
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText} allowFontScaling={false}>
          {currentIndex + 1}. {quizInfo.quizzes[currentIndex]?.question}
        </Text>
        <FlatList
          data={quizInfo.quizzes[currentIndex]?.answers}
          contentContainerStyle={styles.answersContainer}
          renderItem={({item, index}) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = item.is_right === 1;
            return (
              <TouchableOpacity
                style={[
                  styles.answerOption,
                  isSelected && {backgroundColor: isCorrect ? 'green' : 'red'},
                ]}
                onPress={() => handleAnswerSelection(item, index)}
                disabled={selectedAnswer !== null}>
                <Text
                  style={[styles.answerText, isSelected && {color: 'white'}]} allowFontScaling={false}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Result Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Pressable
              style={{padding: 5, alignSelf: 'flex-end'}}
              onPress={() => {
                navigation.goBack();
                setShowModal(false);
              }}>
              <AntDesign name="close" size={20} color={Colors.black} />
            </Pressable>
            <Text style={styles.modalTitle} allowFontScaling={false}>Thank You for Playing!</Text>
            <Image
              source={require('./images/score.png')}
              style={{height: 280, width: 280}}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.modalScore,
                {color: correctAnswers < 3 ? 'red' : 'green'},
              ]} allowFontScaling={false}>
              You got {correctAnswers}/{quizInfo.quizzes.length}
            </Text>
            <WineHuntButton text={`Total Earn Milestones ${score}`} allowFontScaling={false} />
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
  timerText: {
    ...Fonts.InterRegular,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.green2,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  progressBar: {
    width: 60,
    height: 3,
    borderRadius: 2,
    marginHorizontal: 5,
  },
  questionContainer: {
    paddingHorizontal: 20,
  },
  questionText: {
    ...Fonts.InterRegular,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  answersContainer: {
    gap: 20,
    marginTop: 10,
  },
  answerOption: {
    padding: 10,
    backgroundColor: Colors.gray12,
    borderRadius: 5,
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
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    // alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.green2,
    marginVertical: 5,
    textAlign: 'center',
  },
  resultItem: {
    marginVertical: 5,
    alignItems: 'center',
  },
  resultQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
});
