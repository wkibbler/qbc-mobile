import React from 'react';
import { Text, View, ImageBackground, Button, Alert, TouchableOpacity, Image, TextInput, ScrollView, NetInfo, Clipboard } from 'react-native';
import GradientButton from 'react-native-gradient-buttons';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import { SecureStore, Localization } from 'expo'
import styles from './styles/Receive'
import i18n from 'i18n-js';

/*import different languages*/

import en from './locals/en'
import fr from './locals/fr'

i18n.fallbacks = true;
i18n.translations = { en, fr };
i18n.locale = Localization.locale;

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
     return fetch('http://54.39.201.117:3001/keyPair/qbc/' + data)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson.address)
      SecureStore.setItemAsync('address', responseJson.address)
      SecureStore.setItemAsync('privateKey', responseJson.privateKey)
      this.setState({address: responseJson.address, renderMain: true, privateKey: responseJson.privateKey})
      Alert.alert(i18n.t('14'), i18n.t('15'))
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
        Alert.alert(i18n.t('14'), i18n.t('15'))
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
      <Text style={styles.modalMsg}>{i18n.t('37')}</Text>
      <Text style={styles.modalMsg}>{i18n.t('38')}</Text>
      <Text style={styles.modalMsg}>{i18n.t('39')}</Text>
      <TextInput
          style={styles.input}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
          placeholder={i18n.t('40')}
          placeholderTextColor={"grey"}
        />
        <TextInput
            style={styles.input}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            placeholder={i18n.t('41')}
            placeholderTextColor={"grey"}
          />
          <Text style={styles.goBack1} onPress={()=> this.cancel()}>Go Back</Text>
          <GradientButton
          style={{marginTop: 30}}
          textStyle={{ fontSize: 15, fontFamily: 'made-evolve-thin' }}
          gradientBegin="#04339b"
          gradientEnd="#91b8fa"
          gradientDirection="diagonal"
          height={40}
          width={130}
          radius={30}
          impact
          impactStyle='Light'
          text={i18n.t('47')}
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
    <Text style={styles.title}>{i18n.t('16')}</Text>
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
    gradientBegin="#04339b"
    gradientEnd="#91b8fa"
    gradientDirection="diagonal"
    height={30}
    width={90}
    radius={15}
    impact
    impactStyle='Light'
    text={i18n.t('17')}
    onPressAction={() => {
      Alert.alert(i18n.t('19'))
      Clipboard.setString(this.state.address);
    }}
  />
  <GradientButton
  style={{ marginVertical: 8 }}
  textStyle={{ fontSize: 15, fontFamily: 'made-evolve-thin' }}
  gradientBegin="#04339b"
  gradientEnd="#91b8fa"
  gradientDirection="diagonal"
  height={30}
  width={90}
  radius={15}
  impact
  impactStyle='Light'
  text={i18n.t('18')}
  onPressAction={() => {
    Alert.alert(i18n.t('20'))
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
    <Text style={styles.warning}>{i18n.t('42')}</Text>
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
    text={i18n.t('43')}
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
