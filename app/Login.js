import React from 'react';
import {
  Text,
  View,
  ImageBackground,
  Alert,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Overlay,
  AsyncStorage,
  Button,
  Platform
 } from 'react-native';
 import { LocalAuthentication, Font, SecureStore, Localization } from 'expo';
 import Modal from 'react-native-modal';
 import GradientButton from 'react-native-gradient-buttons';
 import i18n from 'i18n-js';

 import en from './locals/en'
 import fr from './locals/fr'

 i18n.fallbacks = true;
 i18n.translations = { en, fr };
 i18n.locale = Localization.locale;


import styles from './styles/Login';

export default class Login extends React.Component {
  constructor() {
      super()
      this.state = {
         biometrics: false,
         fontLoaded: false,
         biometricPromt: false,
         registerPIN: false,
         pin1: "",
         pin2: "",
         loginPIN: false,
         pin3: ""
      }
   }
login = async () => {
  if (Platform.OS == 'android') {this.setState({biometricPromt: true})}
      let result = await LocalAuthentication.authenticateAsync(i18n.t('21'));
      if (result.success == true){
        Alert.alert(i18n.t('23'))
        this.props.navigation.navigate('Home');
        this.setState({biometricPromt: false})
      } else {
        this.login()
      }
  }
  usePIN = async () => {
    this.setState({biometricPromt: false})
    var password = await SecureStore.getItemAsync('madebywkibbler')
    if (password == null){
      this.setState({registerPIN: true})
    } else {
      this.setState({loginPIN: true})
    }
  }
  registerPIN = async () => {
    if (this.state.pin1 == this.state.pin2){
      this.setState({registerPIN: false})
      SecureStore.setItemAsync('madebywkibbler', this.state.pin1)
      this.props.navigation.navigate('Home')
    } else {
      Alert.alert(i18n.t('24'))
    }
  }
  loginWithPIN = async () => {
    var password = await SecureStore.getItemAsync('madebywkibbler')
    if (password == this.state.pin3){
      this.setState({loginPIN: false})
      this.props.navigation.navigate('Home')
      Alert.alert(i18n.t('23'))
    } else {
      Alert.alert(i18n.t('25'))
    }
  }
  async componentDidMount(){
    this.login()
    await Font.loadAsync({
      'made-evolve-thin': require('../assets/fonts/Poppins-Light.ttf'),
      'made-evolve-light': require('../assets/fonts/Poppins-Regular.ttf')
    });

    this.setState({ fontLoaded: true });
  }
  render() {
    return (
      <View>
      {this.state.fontLoaded ? (
      <ImageBackground source={require('../assets/background.png')} style={styles.image}>
        <View style={styles.logoWrapper}>
        <Image
        source={require('../assets/loginLogo.png')}
        style={styles.logo}/>
        <Modal isVisible={this.state.biometricPromt}>
        <View style={styles.BMVwrapper}>
        <View style={styles.biometricPromtView}>
        <TouchableOpacity onPress={() => this.login()}>
        <Image
        style={styles.biometricLogo}
        source={require('../assets/biometric.png')}/>
        </TouchableOpacity>
        <GradientButton
        style={{ marginVertical: 8 }}
        textStyle={{ fontSize: 15, fontFamily: 'made-evolve-light' }}
        gradientBegin="#04339b"
        gradientEnd="#91b8fa"
        gradientDirection="diagonal"
        height={30}
        width={90}
        radius={15}
        impact
        impactStyle='Light'
        text={i18n.t('26')}
        onPressAction={() => this.usePIN()}
      />
        </View>
        </View>
        </Modal>
        <Modal isVisible={this.state.registerPIN}>
        <View style={styles.BMVwrapper}>
        <View style={[styles.biometricPromtView, {width: 250, height: 300}]}>
        <Text style={styles.registerTitle}>{i18n.t('27')}</Text>
        <TextInput
            style={styles.input}
            onChangeText={(pin1) => this.setState({pin1})}
            value={this.state.pin1}
            placeholder={i18n.t('28')}
            placeholderTextColor={"white"}
            keyboardType={"numeric"}
          />
          <TextInput
              style={styles.input}
              onChangeText={(pin2) => this.setState({pin2})}
              value={this.state.pin2}
              placeholder={i18n.t('29')}
              placeholderTextColor={"white"}
              keyboardType={"numeric"}
            />
            <GradientButton
            style={{ marginVertical: 8, marginTop: 60 }}
            textStyle={{ fontSize: 15, fontFamily: 'made-evolve-light' }}
            gradientBegin="#04339b"
            gradientEnd="#91b8fa"
            gradientDirection="diagonal"
            height={30}
            width={110}
            radius={15}
            impact
            impactStyle='Light'
            text={i18n.t('30')}
            onPressAction={() => this.registerPIN()}
          />
        </View>
        </View>
        </Modal>
        <Modal isVisible={this.state.loginPIN}>
        <View style={styles.BMVwrapper}>
        <View style={[styles.biometricPromtView, {width: 250, height: 300}]}>
        <Text style={styles.registerTitle}>{i18n.t('31')}</Text>
        <TextInput
            style={styles.input}
            onChangeText={(pin3) => this.setState({pin3})}
            value={this.state.pin3}
            placeholder={i18n.t('31')}
            placeholderTextColor={"white"}
            keyboardType={"numeric"}
          />
            <GradientButton
            style={{ marginVertical: 8, marginTop: 60 }}
            textStyle={{ fontSize: 15, fontFamily: 'made-evolve-light' }}
            gradientBegin="#04339b"
            gradientEnd="#91b8fa"
            gradientDirection="diagonal"
            height={30}
            width={110}
            radius={15}
            impact
            impactStyle='Light'
            text={i18n.t('32')}
            onPressAction={() => this.loginWithPIN()}
          />
        </View>
        </View>
        </Modal>
        </View>
        </ImageBackground>
      ): null
    }
      </View>
    );
  }
}
