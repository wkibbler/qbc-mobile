import React from 'react';
import { Text, View, ImageBackground, Button, Alert, TouchableOpacity, Image, TextInput, StyleSheet, Linking, Dimensions, LayoutAnimation, StatusBar } from 'react-native';
import GradientButton from 'react-native-gradient-buttons';
import { Font, Permissions, BarCodeScanner, SecureStore } from 'expo';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';


import styles from './styles/Send';

export default class Send extends React.Component {
  constructor(props) {
      super(props)
      values = {
        amount: 0,
        balance: 0
      }
      this.state = {
         address: "",
         amount: values.amount.toFixed(4),
         question: 4,
         fee: 0.00031543,
         balance: values.balance.toFixed(4),
         qrReader: false,
         hasCameraPermission: null,
         lastScannedUrl: null,
         spinner: false
      }
   }
   send = async () => {
     var address = await SecureStore.getItemAsync('address')
     var privKey = await SecureStore.getItemAsync('privateKey')
     var sendJson = {send: this.state.address, from: address, privKey: privKey, amount: this.state.amount, balance: this.state.balance * 100000000}
     console.log(JSON.stringify(sendJson))
     return fetch('http://176.9.64.121:3000/send/xbts/' + JSON.stringify(sendJson))
     .then((response) => response.json())
     .then((responseJson) => {
       this.setState({spinner: false})
       Alert.alert(responseJson.alert, responseJson.message)
     })
     .catch((error) => {
       this.setState({spinner: false})
       Alert.alert("error", "There was an error reaching our server")
     });
   }
   _openQrScanner = () => {
     this._requestCameraPermission();
     //Alert.alert("Swipe left to go back or click on the address displyed below after scan to use")
     this.setState({qrReader: true})
   }

   _requestCameraPermission = async () => {
     const { status } = await Permissions.askAsync(Permissions.CAMERA);
     this.setState({
       hasCameraPermission: status === 'granted',
     });
   };

   _handleBarCodeRead = result => {
     if (result.data !== this.state.lastScannedUrl) {
       LayoutAnimation.spring();
       this.setState({ lastScannedUrl: result.data, qrReader: false, address: result.data });
     }
   };
   onValueChange(value) {
    this.setState({ question: value });
    this.setState({fee: value.toFixed(4)})
  }
  sendMax(){
    this.setState({amount: JSON.stringify(this.state.balance - this.state.fee)})
  }
  async balance(){
    var address = await SecureStore.getItemAsync('address')
    if (address !== null){
      return fetch('http://176.9.64.121:3001/api/addr/' + address + "/balance")
      .then((response) => response.json())
      .then((responseJson) => {
        if (typeof responseJson == 'number'){
          this.setState({balance: (responseJson / 100000000).toFixed(4)})
        } else {
          this.setState({balance: (0).toFixed(4)})
        }
      })
      .catch((error) => {
        console.error(error);
      });
    } else {
      this.setState({balance: (0).toFixed(4)})
    }
    }
    componentDidMount(){
      this.balance()
      this.interval = setInterval(() => this.balance(), 10000);
    }
  render() {
    return (
      <View>
      <Spinner
          visible={this.state.spinner}
          textContent={''}
          textStyle={styles.spinnerTextStyle}
          overlayColor={'rgba(0,0,0,0.6)'}
        />
      <ImageBackground
      style={styles.backgroundImage}
      source={require('../assets/background.png')}>
    <View style={styles.logoWrapper}>
    <Image
    source={require('../assets/headerLogo.png')}
    style={styles.logo}/>
    </View>
    <TouchableOpacity style={styles.backBtn} onPress={() => this.props.navigation.navigate('Home')}>
    <Image
    source={require('../assets/backIcon.png')}
    style={styles.backIcon}/>
    </TouchableOpacity>
    <View style={styles.op1}>
    <Text style={styles.title}>SEND</Text>
    <View style={styles.balanceWrapper}>
    <View style={styles.balance}>
    <Text style={styles.balanceDis}>{this.state.balance}</Text>
    </View>
    </View>
    <View style={styles.inputWrapper}>
    <TextInput
        style={styles.input}
        onChangeText={(address) => this.setState({address})}
        value={this.state.address}
        placeholder={"Enter Address"}
        placeholderTextColor={"white"}
      />
      <TouchableOpacity onPress={() => {
        this._openQrScanner()
        //this.setState({qrReader: true})
      }}>
      <Image
      source={require('../assets/qrIcon.png')}
      style={styles.icons}/>
      </TouchableOpacity>
      </View>
      <View style={styles.inputWrapper}>
      <TextInput
          style={styles.input}
          onChangeText={(amount) => this.setState({amount})}
          value={this.state.amount}
        />
        <TouchableOpacity onPress={() => this.sendMax()}>
        <Image
        source={require('../assets/maxIcon.png')}
        style={styles.icons}/>
        </TouchableOpacity>
        </View>
        <View style={styles.sliderWrapper}>
        <Text style={styles.feeDis}>{"Fee: " + this.state.fee}</Text>
        </View>
        <View style={styles.sendWrapper}>
        <GradientButton
        style={styles.sendBtn}
        textStyle={{ fontSize: 15, fontFamily: 'made-evolve-thin' }}
        gradientBegin="#8e722e"
        gradientEnd="#e2dda4"
        gradientDirection="diagonal"
        height={40}
        width={100}
        radius={30}
        impact
        impactStyle='Light'
        text="Send"
        onPressAction={() => {
          this.setState({spinner: true})
           this.send()
         }
        }
      />
        </View>
    </View>
    <Modal isVisible={this.state.qrReader}>
    <View style={{width: '100%', backgroundColor: 'black'}}>
    <Text onPress={() => this.setState({qrReader: false})} style={{color: 'white'}}>Cancel</Text>
    </View>
    <View style={styles.container}>

      {this.state.hasCameraPermission === null
        ? <Text>Requesting for camera permission</Text>
        : this.state.hasCameraPermission === false
            ? <Text style={{ color: '#fff' }}>
                Camera permission is not granted
              </Text>
            :

            <BarCodeScanner
                onBarCodeRead={this._handleBarCodeRead}
                style={{
                  height: '80%',
                  width: Dimensions.get('window').width,
                }}
              />}

      <StatusBar hidden />
    </View>
    </Modal>
    </ImageBackground>
      </View>
    );
  }
}
