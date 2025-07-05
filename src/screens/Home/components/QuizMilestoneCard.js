import React from 'react';
import {View, Text, Pressable, Alert} from 'react-native';
import {Colors, Fonts} from '../../../constant/Styles';

const QuizMilestoneCard = ({userData, navigation, quizProgress, milestoneProgress}) => {
  const handleConvertQuizPoints = () => {
    if ((userData?.milestone || 0) < 40) {
      return;
    }

    Alert.alert(
      'Convert Quiz Points',
      'Are you sure you want to convert 40 quiz points to 1 milestone?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Convert',
          onPress: () => {
            console.log('lp');
          },
        },
      ],
    );
  };

  const handleRewardSelection = rewardType => {
    Alert.alert('Reward Selected', `You've selected: ${rewardType}`, [
      {text: 'OK', onPress: () => navigation.navigate('ScanCode')},
    ]);
  };

  return (
    <>
      <View style={styles.quizCard}>
        <View style={styles.quizHeader}>
          <View style={styles.quizIconContainer}>
            <Text style={styles.quizIcon}>🧠</Text>
          </View>
          <View style={styles.quizTitleContainer}>
            <Text style={styles.quizTitle} allowFontScaling={false}>
              Quiz Challenge
            </Text>
            <Text style={styles.quizSubtitle} allowFontScaling={false}>
              Test your wine knowledge
            </Text>
          </View>
        </View>

        <View style={styles.quizProgressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel} allowFontScaling={false}>
              Quiz Points
            </Text>
            <Text style={styles.progressValue} allowFontScaling={false}>
              {userData?.milestone || 0} / 40
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, {width: `${quizProgress}%`}]} />
          </View>
        </View>

        <View style={styles.quizActions}>
          {(userData?.milestone || 0) >= 40 && (
            <Pressable
              style={styles.convertButton}
              onPress={handleConvertQuizPoints}>
              <Text style={styles.convertButtonText} allowFontScaling={false}>
                Convert to Milestone
              </Text>
            </Pressable>
          )}

          <Pressable
            style={styles.startQuizButton}
            onPress={() => navigation.navigate('Quiz')}>
            <Text style={styles.startQuizButtonText} allowFontScaling={false}>
              Start Quiz
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.milestoneCard}>
        <View style={styles.milestoneHeader}>
          <View style={styles.milestoneIconContainer}>
            <Text style={styles.milestoneIcon}>🏆</Text>
          </View>
          <View style={styles.milestoneTitleContainer}>
            <Text style={styles.milestoneTitle} allowFontScaling={false}>
              Milestone Rewards
            </Text>
            <Text style={styles.milestoneSubtitle} allowFontScaling={false}>
              Unlock exclusive benefits
            </Text>
          </View>
        </View>

        <View style={styles.milestoneProgressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel} allowFontScaling={false}>
              Milestone Points
            </Text>
            <Text style={styles.progressValue} allowFontScaling={false}>
              {userData?.milestonePoints || 0} / 10
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, {width: `${milestoneProgress}%`}]}
            />
          </View>
        </View>

        {(userData?.milestonePoints || 0) >= 10 && (
          <View style={styles.rewardSection}>
            <Text style={styles.rewardTitle} allowFontScaling={false}>
              🎉 Available Rewards
            </Text>

            <View style={styles.rewardOptions}>
              <Pressable
                style={styles.rewardOption}
                onPress={() =>
                  handleRewardSelection('20% Discount on Wine Products')
                }>
                <View style={styles.rewardOptionContent}>
                  <Text style={styles.rewardIcon}>📦</Text>
                  <Text style={styles.rewardText} allowFontScaling={false}>
                    20% Discount on Wine Products
                  </Text>
                </View>
              </Pressable>

              <Pressable
                style={styles.rewardOption}
                onPress={() =>
                  handleRewardSelection('£10 Voucher (Min Order £50)')
                }>
                <View style={styles.rewardOptionContent}>
                  <Text style={styles.rewardIcon}>🎫</Text>
                  <Text style={styles.rewardText} allowFontScaling={false}>
                    £10 Voucher (Min Order £50)
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </>
  );
};

const styles = {
  quizCard: {
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quizIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizIcon: {
    fontSize: 26,
    color: '#FF6B6B',
  },
  quizTitleContainer: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    fontFamily: Fonts.InterBold,
    marginBottom: 4,
  },
  quizSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: Fonts.InterRegular,
  },
  quizProgressSection: {
    marginBottom: 20,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: Fonts.InterMedium,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    fontFamily: Fonts.InterBold,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 8,
  },
  quizActions: {
    flexDirection: 'row',
    gap: 12,
  },
  convertButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  convertButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: Fonts.InterBold,
  },
  startQuizButton: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startQuizButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    fontFamily: Fonts.InterBold,
  },
  milestoneCard: {
    backgroundColor: '#4ECDC4',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  milestoneIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  milestoneIcon: {
    fontSize: 26,
    color: '#4ECDC4',
  },
  milestoneTitleContainer: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    fontFamily: Fonts.InterBold,
    marginBottom: 4,
  },
  milestoneSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: Fonts.InterRegular,
  },
  milestoneProgressSection: {
    marginBottom: 20,
  },
  rewardSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.white,
    fontFamily: Fonts.InterBold,
    textAlign: 'center',
  },
  rewardOptions: {
    marginTop: 12,
    gap: 8,
  },
  rewardOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rewardOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rewardIcon: {
    fontSize: 18,
  },
  rewardText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontFamily: Fonts.InterMedium,
  },
};

export default QuizMilestoneCard; 