import React from 'react';
import { Text, View, ImageBackground, Button, Alert, TouchableOpacity, Image, TextInput, ScrollView, NetInfo, Clipboard } from 'react-native';
import GradientButton from 'react-native-gradient-buttons';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import { SecureStore } from 'expo'
import styles from './styles/Receive'

export default class Receive extends React.Component {
  constructor() {
      super()
      this.state = {
        address: "",
        privateKey: "",
        renderMain: false,
        noConnection: false,
        modalView: false,
        username: "",
        password: "",
        qrCodeSize: 100
      }
   }
   qrSize = () => {
     if (this.state.qrCodeSize == 100){this.setState({qrCodeSize: 200})} else {this.setState({qrCodeSize: 100})}
   }
   cancel = () => {
     this.setState({modalView: false})
     this.props.navigation.navigate('Home')
   }
   getAddress = async () => {
     this.setState({modalView: false})
     NetInfo.getConnectionInfo().then((connectionInfo) => {
       if (connectionInfo.type == 'none'){
         this.setState({noConnection: true})
       } else {
         this.requestKeyPair()
       }
     });
   }
   requestKeyPair = async () => {
     var data = "somedata" + this.state.username + "moredata" + this.state.password;
     return fetch('http://176.9.64.121:3000/keyPair/xbts/' + data)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson.address)
      SecureStore.setItemAsync('address', responseJson.address)
      SecureStore.setItemAsync('privateKey', responseJson.privateKey)
      this.setState({address: responseJson.address, renderMain: true, privateKey: responseJson.privateKey})
      Alert.alert("Warning", "Always make sure you backup your wallet or you risk losing your funds")
    })
    .catch((error) => {
      console.error(error);
    });
   }
   async componentDidMount() {
      var address = await SecureStore.getItemAsync('address')
      var privatekey = await SecureStore.getItemAsync('privateKey')
      if (address !== null){
        this.setState({renderMain: true, address: address, privateKey: privatekey})
        Alert.alert("Warning", "Always make sure you backup your wallet or you risk losing your funds")
      } else {
        this.setState({modalView: true})
      }
   }
  render() {
    return (
      <View>
      <Modal isVisible={this.state.modalView}>
      <View style={styles.modal}>
      <View style={styles.modal1}>
      <Text style={styles.modalMsg}>Enter a username and password, this is only used to generate your wallet and you will not need to use it to sign in and it will not be stored anywhere even on your device.</Text>
      <Text style={styles.modalMsg}>Make sure that you are able to remember your credentials as they will be used to backup your wallet in future and there is no option to reset user credentials</Text>
      <Text style={styles.modalMsg}>If you are trying to restore from backup, enter the same credentials below and your wallet will be imported to this device</Text>
      <TextInput
          style={styles.input}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
          placeholder={"Username"}
          placeholderTextColor={"grey"}
        />
        <TextInput
            style={styles.input}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            placeholder={"Password"}
            placeholderTextColor={"grey"}
          />
          <Text style={styles.goBack1} onPress={()=> this.cancel()}>Go Back</Text>
          <GradientButton
          style={{marginTop: 30}}
          textStyle={{ fontSize: 15, fontFamily: 'made-evolve-thin' }}
          gradientBegin="#8e722e"
          gradientEnd="#e2dda4"
          gradientDirection="diagonal"
          height={40}
          width={130}
          radius={30}
          impact
          impactStyle='Light'
          text="Create Wallet"
          onPressAction={() => this.getAddress()}
        />
      </View>
      </View>
      </Modal>
      {
        this.state.renderMain ? (
      <ImageBackground source={require('../assets/background.png')} style={styles.image}>
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
    <Text style={styles.title}>RECEIVE</Text>
    <View style={styles.qrWrapper}>
    <TouchableOpacity onPress={() => this.qrSize()}>
    <QRCode
      value={this.state.address}
      size={this.state.qrCodeSize}
    />
    </TouchableOpacity>
    </View>
    <Text style={styles.disAddress}>{this.state.address}</Text>
    <View style={styles.recBtnWrapper}>
    <GradientButton
    style={{ marginVertical: 8 }}
    textStyle={{ fontSize: 15, fontFamily: 'made-evolve-thin' }}
    gradientBegin="#8e722e"
    gradientEnd="#e2dda4"
    gradientDirection="diagonal"
    height={30}
    width={90}
    radius={15}
    impact
    impactStyle='Light'
    text="Copy"
    onPressAction={() => {
      Alert.alert('Copied to Clipboard')
      Clipboard.setString(this.state.address);
    }}
  />
  <GradientButton
  style={{ marginVertical: 8 }}
  textStyle={{ fontSize: 15, fontFamily: 'made-evolve-thin' }}
  gradientBegin="#8e722e"
  gradientEnd="#e2dda4"
  gradientDirection="diagonal"
  height={30}
  width={90}
  radius={15}
  impact
  impactStyle='Light'
  text="Backup"
  onPressAction={() => {
    Alert.alert("Copied private key to clipboard")
    Clipboard.setString(this.state.privateKey);
  }}
/>
    </View>
    </View>
    </ImageBackground>
  ) : this.state.noConnection ? (
    <ImageBackground source={require('../assets/background.png')} style={styles.image}>
    <View style={styles.noConnectionWrapper}>
    <Image
    style={styles.warningIcon}
    source={require('../assets/warning.png')}/>
    <Text style={styles.warning}>You do not have connection to the internet. Please connect and try again. You will not have to do this again after the wallet setup</Text>
    <GradientButton
    style={{ marginVertical: 8 }}
    textStyle={{ fontSize: 15, fontFamily: 'made-evolve-thin' }}
    gradientBegin="#5a1277"
    gradientEnd="#7f4795"
    gradientDirection="diagonal"
    height={40}
    width={150}
    radius={15}
    impact
    impactStyle='Light'
    text="Try Again"
    onPressAction={() => this.getAddress()}
  />
    </View>
    </ImageBackground>
  ) : null
}
      </View>
    );
  }
}
