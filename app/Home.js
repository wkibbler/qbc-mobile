import React from 'react';
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
  ScrollView,
  Linking} from 'react-native';
  import GradientButton from 'react-native-gradient-buttons';
  import { Font, SecureStore, Localization } from 'expo';
  import i18n from 'i18n-js';

/*import different languages*/

import en from './locals/en'

import fr from './locals/fr'

i18n.fallbacks = true;
i18n.translations = { en, fr };
i18n.locale = Localization.locale;


import styles from './styles/Home';

export default class Home extends React.Component {
  constructor() {
      super()
      this.state = {
         BTCprice: '0.00000000',
         Quebecoinprice: '0.00000000',
         blockHeight: '0',
         fontLoaded: false,
         balance: "",
         transactions: [],
         address: ""
      }
   }
   openTx(txid){
     Linking.openURL('http://155.138.220.104:11889/tx/' + txid)
   }
   async sendReceive(txid){
     var address = await SecureStore.getItemAsync('address')
     return fetch('http://155.138.220.104:11889/api/v1/tx/' + txid)
     .then((response) => response.json())
     .then((responseJson) => {
       if (responseJson.vin[0].addresses[0] == address){
         return "SEND"
       } else {
         return "RECEIVE"
       }
     })
     .catch((error) => {
       return "error"
     })
   }

   txValue(txid){
     return "some value"
   }

   async balance(){
     var address = await SecureStore.getItemAsync('address')
     if (address !== null){
       this.setState({address: address})
       return fetch('http://155.138.220.104:11889/api/v1/address/' + address)
       .then((response) => response.json())
       .then((responseJson) => {
           this.setState({balance: (JSON.parse(responseJson.balance)).toFixed(4)})
           if (typeof responseJson.transactions == 'undefined'){
             this.setState({transactions: []})
           } else {
             this.setState({transactions: responseJson.transactions})
           }
       })
       .catch((error) => {
         console.log(error)
         this.setState({balance: (0).toFixed(4), transactions: []});
         console.log(address)
       })
     } else {
       this.setState({balance: (0).toFixed(4), transactions: []})
     }
     }
   async componentDidMount() {
     await Font.loadAsync({
       'made-evolve-thin': require('../assets/fonts/Poppins-Light.ttf'),
       'made-evolve-light': require('../assets/fonts/Poppins-Regular.ttf')
     });
     this.setState({ fontLoaded: true });
     this.balance()
     this.interval = setInterval(() => {
       this.balance();}, 10000);
   }
  render() {
    return (
      <View>
      { this.state.fontLoaded ? (
      <ImageBackground source={require('../assets/background.png')} style={styles.image}>
      <View style={styles.logoWrapper}>
      <Image
      source={require('../assets/headerLogo.png')}
      style={styles.logo}/>
      </View>
      <Text style={styles.balance1}>{i18n.t('1')}</Text>
      <Text style={[styles.balanceTitle, {fontFamily: 'made-evolve-light'}]}>{this.state.balance}</Text>
      <Text style={[styles.balance1, {marginTop: 5}]}>QBC</Text>
      <View style={styles.btnContainers}>
      <View style={styles.stBtnCon}>
      <GradientButton
      style={{ marginVertical: 8, marginLeft: 40 }}
      textStyle={{ fontSize: 15, fontFamily: 'made-evolve-thin' }}
      textStyle={{ fontSize: 15, fontFamily: 'made-evolve-thin' }}
      gradientBegin="#04339b"
      gradientEnd="#91b8fa"
      gradientDirection="diagonal"
      height={30}
      width={90}
      radius={15}
      impact
      impactStyle='Light'
      text={i18n.t('2')}
      onPressAction={() => this.props.navigation.navigate('Send')}
    />
      </View>
      <View>
      <TouchableOpacity
      onPress={() => {
        this.props.navigation.navigate('Settings')
      }
      }>
      <Image
      source={require('../assets/settings.png')}
      style={styles.settings}/>
      </TouchableOpacity>
      </View>
      <View style={styles.stBtnCon}>
      <GradientButton
      style={{ marginVertical: 8, marginRight: 40 }}
      textStyle={{ fontSize: 15, fontFamily: 'made-evolve-thin' }}
      textStyle={{ fontSize: 15, fontFamily: 'made-evolve-thin' }}
      gradientBegin="#04339b"
      gradientEnd="#91b8fa"
      gradientDirection="diagonal"
      height={30}
      width={90}
      radius={15}
      impact
      impactStyle='Light'
      text={i18n.t('3')}
      onPressAction={() => this.props.navigation.navigate('Receive')}
    />
      </View>
      </View>
      <View style={styles.op2}>
      <Text style={[styles.ltTitle, {fontFamily: 'made-evolve-light'}]}>{i18n.t('4')}</Text>
      <ScrollView style={styles.scroll}>
      {
        this.state.transactions.map((item, index) => (
          <TouchableOpacity
          key = {item}
          style={styles.trasactionContainer}
          onPress = {() => this.openTx(item)}>
          <Text style={styles.transaction}>
          <Text>{i18n.t('5')} </Text><Text style={{fontFamily: 'made-evolve-light'}}>{item}</Text>
          </Text>
          </TouchableOpacity>
        ))
      }
      </ScrollView>
      </View>
      </ImageBackground>
    ) : null
    }
      </View>
    );
  }
}
//https://github.com/expo/react-native/archive/sdk-32.0.0.tar.gz
