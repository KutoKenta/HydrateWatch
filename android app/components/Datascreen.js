// Homescreen.js
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar ,
  TouchableOpacity
} from 'react-native';



import { createStackNavigator, createAppContainer } from 'react-navigation';

export default class Datascreeb extends Component {
  constructor (props) {
    super(props)
    this.state = {
        hum: 0,
        degree: 0,
        degree1: 0,
        degree2: 0,
        degree3: 0,


    } 
  }
  
  componentDidMount(){
  var date = new Date();
  setInterval(() => {
      
      var Hnum = 40 + (Math.random()*10)/2;
      var H = Hnum.toFixed(2);

      var Cnum = 27 + Math.random();
      var C = Cnum.toFixed(2);

      var C1 =  27 + Math.random();
      var C1 = C1.toFixed(2);

      var C2 =  27 + Math.random();
      var C2 = C2.toFixed(2);

      var C3 =  27 + Math.random();
      var C3 = C3.toFixed(2);

      
      this.setState({degree: C});
      this.setState({hum: H});

  }, 2000);

}

  render() {
    return (
     <View style={styles.container}>
       
        <TouchableOpacity style={styles.button}  >
        <Text style={styles.buttonText}>Temperature  :  {this.state.degree} C</Text> 
        </TouchableOpacity> 

        <TouchableOpacity style={styles.button}  >
        <Text style={styles.buttonText}>Humidity       :  {this.state.hum} %</Text> 
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
    width:340,
    backgroundColor:'#1c313a',
    borderRadius: 5,
    marginVertical: 1,
    paddingVertical: 15,
    marginBottom: 20
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#3CD3AD',
    textAlign:'center'
  }
});


