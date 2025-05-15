import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Colors} from '../../constant/Styles';
import {fetchProfile} from '../../redux/slices/profileSlice';
import {useDispatch, useSelector} from 'react-redux';

const Quiz = () => {
  const navigation = useNavigation();
  const [quizList, setQuizList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [coins, setCoins] = useState(120);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.profile);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfile());
    }, [dispatch]),
  );

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

  const handleConvert = () => {
    // const milestonePoints = Math.floor(coins / 40);
    // if (milestonePoints > 0) {
    //   const remaining = coins % 40;
    //   setCoins(remaining);
    //   Alert.alert(
    //     'Converted!',
    //     `You converted ${milestonePoints * 40} coins into ${milestonePoints} Milestone Point(s).`
    //   );
    //   // TODO: Send update to backend if needed
    // } else {
    //   Alert.alert('Not Enough Coins', 'You need at least 40 coins to convert.');
    // }
  };

  const renderQuizItem = ({item}) => (
    <View
      style={[styles.quizItem, item.isComplete === 1 && styles.completedQuiz]}>
      <Text style={{color: Colors.black}}>{item.title}</Text>

      <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
        {/* Coin badge */}
        <View style={styles.coinBadge}>
          <Text style={styles.coinText}>+3</Text>
        </View>
        {item.isComplete === 1 ? (
          <View style={styles.completeButton}>
            <Text style={styles.completeText} allowFontScaling={false}>
              Completed
            </Text>
          </View>
        ) : (
          <Pressable
            style={styles.startButton}
            onPress={() => navigation.navigate('Quizquestion', {data: item})}>
            <Text style={styles.startText} allowFontScaling={false}>
              Start
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <BackNavigationWithTitle
        title="Quiz"
        onPress={() => navigation.goBack()}
      />

      {/* Quiz Banner */}
      <View style={styles.imageContainer}>
        <Image source={require('./images/quiz.png')} style={styles.quizImage} />
      </View>

      {/* Coin Summary Section */}
      <View style={styles.coinSummary}>
        <Text style={styles.coinBalance}>
          You have: {userData?.milestone} Coins
        </Text>
        <Text style={styles.conversionInfo}>
          Conversion Rate: 40 Coins = 1 Milestone Point
        </Text>
        {userData?.milestone >= 40 && (
          <Pressable style={styles.convertButton} onPress={handleConvert}>
            <Text style={styles.convertText}>Convert to Milestone</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.heading}>Available Quiz</Text>
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
        }
      />
    </View>
  );
};

export default Quiz;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    paddingHorizontal: 20,
  },
  quizItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  completedQuiz: {
    backgroundColor: '#d3ffd3',
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
  coinSummary: {
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff8e1',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ffd54f',
  },
  coinBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff9800',
    marginBottom: 5,
  },
  conversionInfo: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 10,
  },
  convertButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  convertText: {
    color: 'white',
    fontWeight: '600',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginRight: 10,
  },
  coinText: {
    color: '#f57c00',
    fontWeight: '600',
    marginRight: 4,
  },
  coinIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
});
