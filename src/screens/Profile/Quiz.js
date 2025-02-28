import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';
import WineHuntButton from '../../common/WineHuntButton';

const Quiz = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <BackNavigationWithTitle
        title="Quiz"
        onPress={() => navigation.goBack()}
      />
      <View style={{padding: 20}}>
        <Image source={require('./images/quiz.png')} style={styles.checkIcon} />
      </View>

      <View style={{padding: 20}}>
        <Text style={styles.heading}>Instructions</Text>
        <View style={styles.benefitsContainer}>
          {Array(7)
            .fill(
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            )
            .map((item, index) => (
              <View key={index} style={styles.benefitItem}>
                <Image
                  source={require('./images/check.png')}
                  style={styles.checkIcons}
                />

                <Text style={styles.benefitText}>{item}</Text>
              </View>
            ))}
        </View>
        <View style={styles.buttonContainer}>
          <WineHuntButton
            text="Next"
            onPress={() => navigation.navigate('Quizquestion')}
          />
        </View>
      </View>
    </View>
  );
};

export default Quiz;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  checkIcon: {
    width: '100%',
    height: 137,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'red',
  },

  container1: {padding: 20, backgroundColor: '#fff', flex: 1},
  heading: {fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: 'black'},

  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  benefitText: {fontSize: 14, color: '#555'},
  checkIcons: {color: 'red', marginRight: 8, width: 24, height: 24},
  buttonContainer: {
    marginTop: 80,
  },
});
