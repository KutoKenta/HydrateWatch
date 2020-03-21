// Aboutscreen.js
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  ScrollView,
  AppState,
  FlatList,
  Dimensions,
  Button,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { stringToBytes } from 'convert-string';
import { bytesToString } from 'convert-string';
import { createStackNavigator, createAppContainer } from 'react-navigation';

const window = Dimensions.get('window');
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class Bluetoothscreen extends Component {

   constructor(){
    super()

    this.state = {
      scanning:false,
      peripherals: new Map(),
      appState: ''
    }

    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    BleManager.start({showAlert: false});

    this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
    this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
    this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
    this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );



    if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
            if (result) {
              console.log("Permission is OK");
            } else {
              PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                  console.log("User accept");
                } else {
                  console.log("User refuse");
                }
              });
            }
      });
    }
  }

  handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
        console.log('Connected peripherals: ' + peripheralsArray.length);
      });
    }
    this.setState({appState: nextAppState});
  }

  componentWillUnmount() {
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    this.handlerDisconnect.remove();
    this.handlerUpdate.remove();
  }

  handleDisconnectedPeripheral(data) {
    let peripherals = this.state.peripherals;
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      this.setState({peripherals});
    }
    console.log('Disconnected from ' + data.peripheral);
  }

  handleUpdateValueForCharacteristic(data) {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
    
    const Notificationdata = bytesToString(data.value);
    console.log("Received " + Notificationdata );
  }

  handleStopScan() {
    console.log('Scan is stopped');
    this.setState({ scanning: false });
  }

  startScan() {
    if (!this.state.scanning) {
      //this.setState({peripherals: new Map()});
      BleManager.scan([], 40, true).then((results) => {
        console.log('Scanning...');
        this.setState({scanning:true});
      });
    }
  }

  retrieveConnected(){
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length == 0) {
        console.log('No connected peripherals')
      }
      console.log(results);
      var peripherals = this.state.peripherals;
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        this.setState({ peripherals });
      }

      BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
        //console.log('Retrieved peripheral services', peripheralData.);
        var service = 'e093f3b5-00a3-a9e5-9eca-40016e0edc24';
        var Notificationc = 'e093f3b6-00a3-a9e5-9eca-40026e0edc24';
        var WriteC = 'e093f3b7-00a3-a9e5-9eca-40036e0edc24';

        BleManager.startNotification(peripheral.id, service, Notificationc).then(() => {
          console.log("Notification started");
          const data = stringToBytes('0/AL/L//'); //Data to get Ambience
         
          BleManager.write(peripheral.id, service, WriteC, data).then(() => {console.log("Write Data");}).catch((error) => 
            {console.log('error', error);});

        }).catch((error) => {
          console.log('Notification error', error);});
      });
    });
  }

  handleDiscoverPeripheral(peripheral){
    var peripherals = this.state.peripherals;
    //console.log('Got ble peripheral', peripheral);
    console.log(peripheral.name);

    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    if(peripheral.name == 'RSL10_BLE_Terminal')
    {
      console.log("Thinkkkkkk");
      peripherals.set(peripheral.id, peripheral);
      this.setState({ peripherals });
    }
  }

    test(peripheral) {
    if (peripheral){
      if (peripheral.connected){
        BleManager.disconnect(peripheral.id);
      }else{
        BleManager.connect(peripheral.id).then(() => {
          let peripherals = this.state.peripherals;
          let p = peripherals.get(peripheral.id);
          if (p) {
            p.connected = true;
            peripherals.set(peripheral.id, p);
            this.setState({peripherals});
          }
          console.log('Connected to ' + peripheral.id);


          setTimeout(() => {

            /* Test read current RSSI value
            BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
              console.log('Retrieved peripheral services', peripheralData);
              BleManager.readRSSI(peripheral.id).then((rssi) => {
                console.log('Retrieved actual RSSI value', rssi);
              });
            });*/

            // Test using bleno's pizza example
            // https://github.com/sandeepmistry/bleno/tree/master/examples/pizza
            BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
              console.log(peripheralInfo);
              var service = '13333333-3333-3333-3333-333333333337';
              var bakeCharacteristic = '13333333-3333-3333-3333-333333330003';
              var crustCharacteristic = '13333333-3333-3333-3333-333333330001';

              setTimeout(() => {
                BleManager.startNotification(peripheral.id, service, bakeCharacteristic).then(() => {
                  console.log('Started notification on ' + peripheral.id);
                  setTimeout(() => {
                    BleManager.write(peripheral.id, service, crustCharacteristic, [0]).then(() => {
                      console.log('Writed NORMAL crust');
                      BleManager.write(peripheral.id, service, bakeCharacteristic, [1,95]).then(() => {
                        console.log('Writed 351 temperature, the pizza should be BAKED');
                        /*
                        var PizzaBakeResult = {
                          HALF_BAKED: 0,
                          BAKED:      1,
                          CRISPY:     2,
                          BURNT:      3,
                          ON_FIRE:    4
                        };*/
                      });
                    });

                  }, 500);
                }).catch((error) => {
                  console.log('Notification error', error);
                });
              }, 200);
            });

          }, 900);
        }).catch((error) => {
          console.log('Connection error', error);
        });
      }
    }
  }

  renderItem(item) {
    const color = item.connected ? '#9b870c' : '#1c313a';
    return (
      <TouchableHighlight onPress={() => this.test(item) }>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text style={{fontSize: 12, textAlign: 'center', color: '#3CD3AD', padding: 10}}>{item.name}</Text>
          <Text style={{fontSize: 10, textAlign: 'center', color: '#3CD3AD', padding: 2}}>RSSI: {item.rssi}</Text>
          <Text style={{fontSize: 8, textAlign: 'center', color: '#3CD3AD', padding: 2, paddingBottom: 20}}>{item.id}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const list = Array.from(this.state.peripherals.values());
    const btnScanTitle = 'SCAN BLUETOOTH (' + (this.state.scanning ? 'ON' : 'OFF') + ')';
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>

          <View style={styles2.container}>
            <TouchableOpacity style={styles2.button} onPress={() => this.startScan() } >
              <Text style={styles2.buttonText}>{btnScanTitle}</Text> 
            </TouchableOpacity> 
          </View> 



           <View style={styles2.container}>
            <TouchableOpacity style={styles2.button}  onPress={() => this.retrieveConnected() } >
              <Text style={styles2.buttonText}>TIME 10 SEC</Text> 
            </TouchableOpacity> 
          </View> 

           <View style={styles2.container}>
            <TouchableOpacity style={styles2.button}  onPress={() => this.retrieveConnected() } >
              <Text style={styles2.buttonText}>TIME 3 HOUR</Text> 
            </TouchableOpacity> 
          </View> 

           <View style={styles2.container}>
            <TouchableOpacity style={styles2.button}  onPress={() => this.retrieveConnected() } >
              <Text style={styles2.buttonText}>TIME 6 HOUR</Text> 
            </TouchableOpacity> 
          </View> 
         
          <ScrollView style={styles.scroll}>
            {(list.length == 0) &&
              <View style={{flex:1, margin: 10}}>
                <Text style={{textAlign: 'center'}}>No peripherals</Text>
              </View>
            }
            <FlatList
              data={list}
              renderItem={({ item }) => this.renderItem(item) }
              keyExtractor={item => item.id}
            />
          </ScrollView>


           <View style={styles2.container}>
            <TouchableOpacity style={styles2.button3}  onPress={() => this.props.navigation.navigate('Data') } >
              <Text style={styles2.buttonText}>DATA</Text> 
            </TouchableOpacity> 
          </View> 

        </View>
      </SafeAreaView>
    );
  }


 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3CD3AD',
    width: window.width,
    height: window.height
  },
  scroll: {
    flex: 1,
    backgroundColor: '#2abb97',
    margin: 10,
    borderRadius: 5,
  },
  row: {
    margin: 10,
    borderRadius: 5,
  },
});

const styles2 = StyleSheet.create({
  container : {
    backgroundColor:'#3CD3AD',
    alignItems:'center',
    justifyContent :'center'
  },
  button: {
    width:340,
    backgroundColor:'#1c313a',
    borderRadius: 5,
    marginVertical: 15,
    paddingVertical: 10,
    marginBottom: 0
  },
  button3: {
    width:140,
    backgroundColor:'#1c313a',
    borderRadius: 5,
    marginVertical: 5,
    paddingVertical: 10,
    marginBottom: 30
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#3CD3AD',
    textAlign:'center'
  }
});

