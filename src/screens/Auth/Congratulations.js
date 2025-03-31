import { StyleSheet, Text, View,Image        } from 'react-native'
import React from 'react'
import WineHuntButton from '../../common/WineHuntButton';
import {useNavigation} from '@react-navigation/native';
const Congratulations = () => {
    const navigation = useNavigation();
  return (
    <View style={{flex:1,backgroundColor:'white'}}>
        <View style={styles.con}>
      <Image
    source={require('../../../assets/images/LoginPage/congralation.png')}
                   style={styles.icon}
                 />
                 </View>
                 <View>
                    <View style={styles.con}>
<Text style={styles.some} allowFontScaling={false}>Congratulations</Text>
<Text style={styles.fou} allowFontScaling={false}>Your account has been successfully Created !!!</Text>
                    </View>

                    <View style={{marginLeft:20,marginRight:20,marginBottom:20,marginTop:120 }}>
                <WineHuntButton text="Continue" onPress={() => navigation.navigate('TabNavigator')} allowFontScaling={false} />
              </View>
                 </View>
    </View>
  )
}

export default Congratulations

const styles = StyleSheet.create({
    con:{
        alignItems:'center',
        margin:10
        
    },
    icon:{
        width:281,
        height:300,
        marginTop:80
    },
    some:{
        color:"black",
        fontSize:28,
 },
 fou:{
    fontSize:16,
    color:'black',
    marginLeft:20,
    marginRight:20,
    textAlign:"center"
 }
})