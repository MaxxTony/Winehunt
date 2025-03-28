import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BackNavigationWithTitle from '../../components/BackNavigationWithTitle';

const Subscription = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  return (
    <View style={styles.container}>
      <BackNavigationWithTitle
        title="Subscription Plan"
        onPress={() => navigation.goBack()}
      />

      <View style={styles.container1}>
        <Text style={styles.heading} allowFontScaling={false}>
          Benefits of going pro :
        </Text>
        <View style={styles.benefitsContainer}>
          {Array(4)
            .fill(
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            )
            .map((item, index) => (
              <View key={index} style={styles.benefitItem}>
                <Image
                  source={require('./images/check.png')}
                  style={styles.checkIcon}
                />
                {/* <Text style={styles.checkIcon}>✔</Text> */}
                <Text style={styles.benefitText} allowFontScaling={false}>
                  {item}
                </Text>
              </View>
            ))}
        </View>

        <Text style={styles.subHeading} allowFontScaling={false}>
          Subscribe now
        </Text>

        <TouchableOpacity
          style={[
            styles.planBox,
            selectedPlan === 'free' && styles.selectedPlan,
          ]}
          onPress={() => setSelectedPlan('free')}>
          <Text style={styles.planTitle} allowFontScaling={false}>
            Free <Text style={styles.price}>0$/month</Text>
          </Text>
          <Text style={styles.planDesc} allowFontScaling={false}>
            Get 10% platform free for 10 days
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.planBox,
            selectedPlan === 'monthly' && styles.selectedPlan,
          ]}
          onPress={() => setSelectedPlan('monthly')}>
          <View style={styles.planRow}>
            <Text style={styles.planTitle} allowFontScaling={false}>
              Monthly{' '}
              <Text style={styles.price} allowFontScaling={false}>
                8$/month
              </Text>
            </Text>
            <Text style={styles.discount} allowFontScaling={false}>
              25% off
            </Text>
          </View>
          <Text style={styles.planDesc} allowFontScaling={false}>
            You pay one time and can cancel it at any time
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.planBox,
            selectedPlan === 'yearly' && styles.selectedPlan,
          ]}
          onPress={() => setSelectedPlan('yearly')}>
          <Text style={styles.planTitle} allowFontScaling={false}>
            Yearly{' '}
            <Text style={styles.price} allowFontScaling={false}>
              80$/month
            </Text>
          </Text>
          <Text style={styles.planDesc} allowFontScaling={false}>
            You pay one time and can cancel it at any time
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.subscribeButtonText} allowFontScaling={false}>
            Subscribe Now
          </Text>
          <Text style={styles.subscribePrice} allowFontScaling={false}>
            $08/Month
          </Text>
        </TouchableOpacity>

        <Text style={styles.cancelText} allowFontScaling={false}>
          You can cancel subscription any time
        </Text>
      </View>
    </View>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  container1: {padding: 20, backgroundColor: '#fff', flex: 1},
  heading: {fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: 'black'},
  benefitsContainer: {marginBottom: 20, marginTop: 10},
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkIcon: {color: 'red', marginRight: 8, width: 24, height: 24},
  benefitText: {fontSize: 14, color: '#555'},
  subHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: 'black',
  },
  planBox: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#ddd',
    height: 85,
  },
  selectedPlan: {borderColor: 'red', backgroundColor: '#fee'},
  planTitle: {fontSize: 16, fontWeight: 'bold'},
  price: {color: 'red'},
  planDesc: {fontSize: 12, color: '#777'},
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discount: {
    backgroundColor: 'green',
    color: '#fff',
    padding: 4,
    fontSize: 12,
    borderRadius: 5,
  },
  subscribeButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 50,
  },
  subscribeButtonText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
  subscribePrice: {color: '#fff', fontSize: 14},
  cancelText: {fontSize: 12, color: '#777', textAlign: 'center', marginTop: 10},
});
