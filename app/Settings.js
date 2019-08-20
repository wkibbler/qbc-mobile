import React from 'react';
import { Text, View, ImageBackground, Button, Alert, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import GradientButton from 'react-native-gradient-buttons';
import Modal from 'react-native-modal';
import { SecureStore, Localization } from 'expo'
import i18n from 'i18n-js';

import en from './locals/en'
import fr from './locals/fr'

i18n.fallbacks = true;
i18n.translations = { en, fr };
i18n.locale = Localization.locale;


import styles from './styles/Settings'

export default class Settings extends React.Component {
  state = {
      names: [
         {
            id: 1,
            name: i18n.t('33'),
         },
         {
           id: 2,
           name: i18n.t('46')
         }
      ],
      isDeleteWarningVisible: false,
      isRestoreWarningVisible: false,
      privateKey: ""
   }
   DeleteWarning(){
     this.setState({ isDeleteWarningVisible: !this.state.isDeleteWarningVisible});
   }
   RestoreWarning(){
     this.setState({ isRestoreWarningVisible: !this.state.isRestoreWarningVisible});
   }
   importWallet(){
     this.deleteWallet()
     //import new wallet
     return fetch('http://54.39.201.117:3001/privatekey/qbc/' + this.state.privateKey)
     .then((response) => response.json())
     .then((responseJson) => {
       SecureStore.setItemAsync('address', responseJson.address)
       SecureStore.setItemAsync('privateKey', responseJson.privateKey)
       Alert.alert("Private key has been imported")
     })
     .catch((error) => {
       Alert.alert("There was a error reaching out server")
     })
   }
   onPresses = (item) => {
     if (item.id == 1){
        this.DeleteWarning()
      } else if (item.id == 2){
        this.RestoreWarning()
      }
   }
   deleteWallet = () => {
     SecureStore.deleteItemAsync("address")
     SecureStore.deleteItemAsync("privateKey")
     Alert.alert(i18n.t('12'), i18n.t('34'))
   }
  render() {
    return (
      <View>
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
    {
               this.state.names.map((item, index) => (
                  <TouchableOpacity
                     key = {item.id}
                     style = {styles.container}
                     onPress = {() => this.onPresses(item)}>
                     <Text style = {styles.text}>
                        {item.name}
                     </Text>
                  </TouchableOpacity>
               ))
            }
    <Modal isVisible={this.state.isDeleteWarningVisible}>
    <View style={styles.warningModal}>
    <View style={styles.warningModal1}>
    <Image
    source={require('../assets/warning.png')}
    style={styles.warningIcon}/>
    <Text style={styles.warningMsg}>{i18n.t('14')}</Text>
    <Text style={styles.warningMsg1}>{i18n.t('35')}</Text>
    <TouchableOpacity style={styles.goBack} onPress={() => this.DeleteWarning()}>
    <Text style={styles.goBackText}>{i18n.t('36')}</Text>
    </TouchableOpacity>
    <GradientButton
    style={styles.deleteBtn}
    textStyle={{ fontSize: 15, fontFamily: 'made-evolve-thin' }}
    gradientBegin="#04339b"
    gradientEnd="#91b8fa"
    gradientDirection="diagonal"
    height={40}
    width={130}
    radius={30}
    impact
    impactStyle='Light'
    text={i18n.t('33')}
    onPressAction={() => {
      this.deleteWallet()
      this.DeleteWarning()
    }}
  />
    </View>
    </View>
    </Modal>

    <Modal isVisible={this.state.isRestoreWarningVisible}>
    <View style={styles.warningModal}>
    <View style={styles.warningModal1}>
    <Text style={styles.warningMsg}>{i18n.t('46')}</Text>
    <Text style={styles.warningMsg1}>{i18n.t('48')}</Text>
    <TextInput
        style={styles.input}
        onChangeText={(privateKey) => this.setState({privateKey})}
        value={this.state.privateKey}
        placeholder={i18n.t('50')}
        placeholderTextColor={"white"}
      />
    <TouchableOpacity style={styles.goBack} onPress={() => this.RestoreWarning()}>
    <Text style={styles.goBackText}>{i18n.t('36')}</Text>
    </TouchableOpacity>
    <GradientButton
    style={styles.deleteBtn}
    textStyle={{ fontSize: 15, fontFamily: 'made-evolve-thin' }}
    gradientBegin="#04339b"
    gradientEnd="#91b8fa"
    gradientDirection="diagonal"
    height={40}
    width={130}
    radius={30}
    impact
    impactStyle='Light'
    text={i18n.t('49')}
    onPressAction={() => {
      this.importWallet()
      this.RestoreWarning()
    }}
  />
    </View>
    </View>
    </Modal>

    </View>
    </ImageBackground>
      </View>
    );
  }
}
