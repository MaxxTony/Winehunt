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
  ActivityIndicator,
  Animated,
  ScrollView,
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
import scoreIcon from './images/score.png';

const Quiz = () => {
  const navigation = useNavigation();
  const [quizList, setQuizList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [converting, setConverting] = useState(false);
  const [coinAnim] = useState(new Animated.Value(0));
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.profile);

  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfile());
    }, [dispatch]),
  );

  const getQuiz = async () => {
    setRefreshing(true);
    setError(null);
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
      } else {
        setError('Failed to load quizzes.');
      }
    } catch (error) {
      setError('Error fetching quiz.');
      console.log('Error fetching quiz:', error);
    }
    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getQuiz();
  }, [isFocused]);

  const onRefresh = useCallback(() => {
    getQuiz();
    dispatch(fetchProfile());
  }, []);

  // Animate coin icon on conversion
  const animateCoin = () => {
    Animated.sequence([
      Animated.timing(coinAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(coinAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Improved conversion logic
  const handleConvert = async () => {
    const milestonesToConvert = Math.floor((userData?.points ?? 0) / 40);
    if (milestonesToConvert < 1) {
      Alert.alert('Not Enough Coins', 'You need at least 40 coins to convert.');
      return;
    }
    const pointsToConvert = milestonesToConvert * 40;
    Alert.alert(
      'Convert Coins',
      `Convert ${pointsToConvert} coins to ${milestonesToConvert} Milestone Point${
        milestonesToConvert > 1 ? 's' : ''
      }?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Convert',
          onPress: async () => {
            setConverting(true);
            try {
              animateCoin();
              const datas = await AsyncStorage.getItem('userDetail');
              const token = JSON.parse(datas)?.token;
              const url = 'http://13.48.249.80:8000/api/other/redeem-points';
              const res = await axios.post(
                url,
                {},
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                },
              );
              if (res?.data?.status === 200) {
                Alert.alert('Success', res?.data?.message || 'Points redeemed successfully');
                dispatch(fetchProfile());
              } else {
                Alert.alert('Error', res?.data?.message || 'Failed to convert coins.');
              }
              setConverting(false);
            } catch (e) {
              setConverting(false);
              Alert.alert('Error', 'Failed to convert coins.');
            }
          },
        },
      ],
    );
  };

  // Calculate quiz progress
  const getQuizProgress = quiz => {
    const total = quiz.quizzes?.length || 0;
    const completed = quiz.isComplete ? total : 0; // Adjust if partial progress is tracked
    return {completed, total};
  };

  // Render quiz card
  const renderQuizItem = ({item}) => {
    const {completed, total} = getQuizProgress(item);
    const progress = total ? completed / total : 0;
    return (
      <Animated.View
        style={[
          styles.quizCard,
          item.isComplete === 1 && styles.completedQuiz,
          {
            shadowOpacity: 0.15,
            shadowRadius: 8,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 4},
          },
        ]}>
        <View style={{flex: 1}}>
          <Text style={styles.quizTitle}>{item.title}</Text>
          <View style={styles.progressBarBg}>
            <View
              style={[styles.progressBarFill, {width: `${progress * 100}%`}]}
            />
          </View>
          <Text style={styles.quizProgress}>
            {completed}/{total} Questions
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          {item.isComplete === 1 ? (
            <View style={styles.badgeCompleted}>
              <Text style={styles.badgeText}>Completed</Text>
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
      </Animated.View>
    );
  };

  // Empty state
  if (!loading && quizList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={require('./images/quiz.png')}
          style={styles.emptyImage}
        />
        <Text style={styles.emptyText}>
          No quizzes available right now. Check back later!
        </Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={getQuiz}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  // Main UI
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.red]}
        />
      }
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}>
      <BackNavigationWithTitle
        title="Quiz"
        onPress={() => navigation.goBack()}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.red} />
          <Text style={styles.loadingText}>Loading quizzes...</Text>
        </View>
      ) : (
        <>
          {/* Modern Banner */}
          <View style={styles.bannerContainer}>
            <Image
              source={require('./images/quiz.png')}
              style={styles.bannerImageCentered}
            />
          </View>

          {/* Coin & Milestone Section */}
          <View style={styles.coinSummary}>
            <View style={styles.coinRow}>
              <Animated.Image
                source={scoreIcon}
                style={[
                  styles.coinIcon,
                  {
                    transform: [
                      {
                        scale: coinAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.3],
                        }),
                      },
                    ],
                  },
                ]}
                resizeMode="contain"
              />
              <Text style={styles.coinBalance}>
                {userData?.points ?? 0} Coins
              </Text>
            </View>
            <View style={styles.coinProgressBarBg}>
              <View
                style={[
                  styles.coinProgressBarFill,
                  {width: `${((userData?.points ?? 0) % 40) * 2.5}%`},
                ]}
              />
            </View>
            <Text style={styles.conversionInfo}>
              40 Coins = 1 Milestone Point
            </Text>
            <View style={styles.milestoneRow}>
              <Text style={styles.milestoneText}>Milestones: </Text>
              <Text style={styles.milestoneValue}>
                {userData?.milestone ?? 0}
              </Text>
              <Text style={styles.milestoneEmoji}>🏅</Text>
            </View>
            {(userData?.points ?? 0) >= 40 && (
              <Pressable
                style={styles.convertButton}
                onPress={handleConvert}
                disabled={converting}>
                {converting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.convertText}>Convert to Milestone</Text>
                )}
              </Pressable>
            )}
          </View>

          <Text style={styles.heading}>Available Quizzes</Text>
          <View style={styles.listContainer}>
            {quizList.map(item => (
              <React.Fragment key={item.id}>
                {renderQuizItem({item})}
              </React.Fragment>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default Quiz;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bannerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: 180,
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.25,
  },
  bannerImageCentered: {
    width: '100%',
    height: 150,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff8e1',
    opacity: 0.7,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  coinSummary: {
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 14,
    backgroundColor: '#fff8e1',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#ffd54f',
    alignItems: 'center',
    shadowColor: '#ffd54f',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  coinIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  coinBalance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff9800',
  },
  coinProgressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#ffe0b2',
    borderRadius: 4,
    marginVertical: 6,
    overflow: 'hidden',
  },
  coinProgressBarFill: {
    height: 8,
    backgroundColor: '#ff9800',
    borderRadius: 4,
  },
  conversionInfo: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 6,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  milestoneText: {
    fontSize: 15,
    color: '#757575',
  },
  milestoneValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff9800',
    marginHorizontal: 4,
  },
  milestoneEmoji: {
    fontSize: 18,
  },
  convertButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 4,
    width: '100%',
  },
  convertText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  quizCard: {
    backgroundColor: '#f8f8f8',
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
  completedQuiz: {
    backgroundColor: '#d3ffd3',
  },
  quizTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 6,
  },
  progressBarBg: {
    width: 120,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: Colors.red,
    borderRadius: 4,
  },
  quizProgress: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
  },
  badgeCompleted: {
    backgroundColor: '#4caf50',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 4,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  startButton: {
    padding: 8,
    borderRadius: 7,
    paddingHorizontal: 22,
    backgroundColor: Colors.red,
    marginTop: 4,
  },
  startText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 32,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: Colors.red,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 7,
    marginTop: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 10,
  },
});
