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
 import { LocalAuthentication, Font, SecureStore } from 'expo';
 import Modal from 'react-native-modal';
 import GradientButton from 'react-native-gradient-buttons';

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
      let result = await LocalAuthentication.authenticateAsync("Verify your ID");
      if (result.success == true){
        Alert.alert("Authorized")
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
      Alert.alert("PINs do not match")
    }
  }
  loginWithPIN = async () => {
    var password = await SecureStore.getItemAsync('madebywkibbler')
    if (password == this.state.pin3){
      this.setState({loginPIN: false})
      this.props.navigation.navigate('Home')
      Alert.alert("Authorized")
    } else {
      Alert.alert("PIN is incorrect")
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
        gradientBegin="#8e722e"
        gradientEnd="#e2dda4"
        gradientDirection="diagonal"
        height={30}
        width={90}
        radius={15}
        impact
        impactStyle='Light'
        text="or use PIN"
        onPressAction={() => this.usePIN()}
      />
        </View>
        </View>
        </Modal>
        <Modal isVisible={this.state.registerPIN}>
        <View style={styles.BMVwrapper}>
        <View style={[styles.biometricPromtView, {width: 250, height: 300}]}>
        <Text style={styles.registerTitle}>Register a PIN</Text>
        <TextInput
            style={styles.input}
            onChangeText={(pin1) => this.setState({pin1})}
            value={this.state.pin1}
            placeholder={"Enter a PIN"}
            placeholderTextColor={"white"}
            keyboardType={"numeric"}
          />
          <TextInput
              style={styles.input}
              onChangeText={(pin2) => this.setState({pin2})}
              value={this.state.pin2}
              placeholder={"Confirm PIN"}
              placeholderTextColor={"white"}
              keyboardType={"numeric"}
            />
            <GradientButton
            style={{ marginVertical: 8, marginTop: 60 }}
            textStyle={{ fontSize: 15, fontFamily: 'made-evolve-light' }}
            gradientBegin="#8e722e"
            gradientEnd="#e2dda4"
            gradientDirection="diagonal"
            height={30}
            width={110}
            radius={15}
            impact
            impactStyle='Light'
            text="Register PIN"
            onPressAction={() => this.registerPIN()}
          />
        </View>
        </View>
        </Modal>
        <Modal isVisible={this.state.loginPIN}>
        <View style={styles.BMVwrapper}>
        <View style={[styles.biometricPromtView, {width: 250, height: 300}]}>
        <Text style={styles.registerTitle}>Enter PIN</Text>
        <TextInput
            style={styles.input}
            onChangeText={(pin3) => this.setState({pin3})}
            value={this.state.pin3}
            placeholder={"Enter PIN"}
            placeholderTextColor={"white"}
            keyboardType={"numeric"}
          />
            <GradientButton
            style={{ marginVertical: 8, marginTop: 60 }}
            textStyle={{ fontSize: 15, fontFamily: 'made-evolve-light' }}
            gradientBegin="#8e722e"
            gradientEnd="#e2dda4"
            gradientDirection="diagonal"
            height={30}
            width={110}
            radius={15}
            impact
            impactStyle='Light'
            text="Login"
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
