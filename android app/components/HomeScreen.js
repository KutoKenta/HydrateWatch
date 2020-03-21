// Homescreen.js
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar ,
  TouchableOpacity,
  Image
} from 'react-native';



import { createStackNavigator, createAppContainer } from 'react-navigation';

export default class Homescreen extends Component {
  static navigationOptions = {header: null, };  
  render() {
    return (


     <View style={styles.container}>
        
        <Image style={styles.image} source={require('./icons.png')} />

         <TouchableOpacity style={styles.button}  onPress={() => this.props.navigation.navigate('Bluetooth')}>
        <Text style={styles.buttonText}>Connect</Text> 
        </TouchableOpacity> 

  
      </View> 


    )
  }
}


const styles = StyleSheet.create({
  container : {
    backgroundColor:'#3CD3AD',
    flex: 1,
    alignItems:'center',
    justifyContent :'center'
  },
  signupTextCont : {
    flexGrow: 1,
    alignItems:'flex-end',
    justifyContent :'center',
    paddingVertical:16,
    flexDirection:'row'
  },
  signupText: {
    color:'rgba(255,255,255,0.6)',
    fontSize:16
  },
  signupButton: {
    color:'#ffffff',
    fontSize:16,
    fontWeight:'500'
  },
  button: {
    width:180,
    backgroundColor:'#1c313a',
    borderRadius: 5,
    marginVertical: 1,
    paddingVertical: 15,
    marginBottom: 60
  },

  image: {
    width:90,
    height:90,
    borderRadius: 5,
    marginVertical: 1,
    paddingVertical: 15,
    marginBottom: 30
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#3CD3AD',
    textAlign:'center'
  },
    imageText: {
    fontSize:16,
    fontWeight:'500',
    color:'#1c313a',
    textAlign:'center'
  }
});