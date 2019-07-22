import React from 'react';
import axios from 'axios';
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
  import { Font, SecureStore } from 'expo';


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
     Linking.openURL('http://176.9.64.121:3001/tx/' + txid)
   }
   sendReceive(variable){
     if (variable == this.state.address) {return "SENT"} else {return "RECEIVED"}
   }
   async balance(){
     var address = await SecureStore.getItemAsync('address')
     if (address !== null){
       this.setState({address: address})
       return fetch('http://176.9.64.121:3001/api/addr/' + address + "/balance")
       .then((response) => response.json())
       .then((responseJson) => {
           this.setState({balance: (responseJson / 100000000).toFixed(4)})
       })
       .catch((error) => {
         this.setState({balance: (0).toFixed(4)});
         console.log(address)
       })
     } else {
       this.setState({balance: (0).toFixed(4)})
     }
     }
     async transactions(){
       var address = await SecureStore.getItemAsync('address')
       if (address !== null){
       return fetch('http://176.9.64.121:3001/api/txs/?address=' + address)
       .then((response) => response.json())
       .then((responseJson) => {
           this.setState({transactions: responseJson.txs})

       })
       .catch((error) => {
         console.error(error);
       });
     } else {
       this.setState({balance: (0).toFixed(4)})
     }
     }
   async componentDidMount() {
     await Font.loadAsync({
       'made-evolve-thin': require('../assets/fonts/Poppins-Light.ttf'),
       'made-evolve-light': require('../assets/fonts/Poppins-Regular.ttf')
     });
     this.setState({ fontLoaded: true });
     this.balance()
     this.transactions()
     this.interval = setInterval(() => {
       this.balance();
     this.transactions()}, 10000);
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
      <Text style={styles.balance1}>BALANCE</Text>
      <Text style={[styles.balanceTitle, {fontFamily: 'made-evolve-light'}]}>{this.state.balance}</Text>
      <Text style={[styles.balance1, {marginTop: 5}]}>QBC</Text>
      <View style={styles.btnContainers}>
      <View style={styles.stBtnCon}>
      <GradientButton
      style={{ marginVertical: 8, marginLeft: 40 }}
      textStyle={{ fontSize: 15, fontFamily: 'made-evolve-thin' }}
      textStyle={{ fontSize: 15, fontFamily: 'made-evolve-thin' }}
      gradientBegin="#8e722e"
      gradientEnd="#e2dda4"
      gradientDirection="diagonal"
      height={30}
      width={90}
      radius={15}
      impact
      impactStyle='Light'
      text="Send"
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
      gradientBegin="#8e722e"
      gradientEnd="#e2dda4"
      gradientDirection="diagonal"
      height={30}
      width={90}
      radius={15}
      impact
      impactStyle='Light'
      text="Receive"
      onPressAction={() => this.props.navigation.navigate('Receive')}
    />
      </View>
      </View>
      <View style={styles.op2}>
      <Text style={[styles.ltTitle, {fontFamily: 'made-evolve-light'}]}>LATEST TRANSACTIONS</Text>
      <ScrollView style={styles.scroll}>
      {
        this.state.transactions.map((item, index) => (
          <TouchableOpacity
          key = {item.txid}
          style={styles.trasactionContainer}
          onPress = {() => this.openTx(item.txid)}>
          <Text style={styles.transaction}>
          <Text style={{fontFamily: 'made-evolve-light', fontSize: 20}}>{this.sendReceive(item.vin[0].addr)}</Text>
          </Text>
          <Text style={styles.transaction}>
          <Text>Time: </Text><Text style={{fontFamily: 'made-evolve-light'}}>{new Date(item.time * 1000).toLocaleString()}</Text>
          </Text>
          <Text style={styles.transaction}>
          <Text>ID: </Text><Text style={{fontFamily: 'made-evolve-light'}}>{item.txid}</Text>
          </Text>
          <Text style={styles.transaction}>
          <Text>Value: </Text><Text style={{fontFamily: 'made-evolve-light'}}>{item.vout[0].value}</Text>
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
