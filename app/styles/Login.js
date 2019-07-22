import StyleSheet from 'react-native';

export default {
  image: {
    width: '100%',
    height: '100%',
  },
  loginScreenButton:{
    marginRight:40,
    marginLeft:40,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'white',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  loginText:{
      color:'black',
      textAlign:'center',
      paddingLeft : 10,
      paddingRight : 10
  },
  logo: {
    width: 110,
    height: 110,
    marginTop: '75%'
  },
  logoWrapper: {
    alignItems: 'center'
  },
  input: {
    backgroundColor: '#202651',
    height: 30,
    width: 130,
    color: 'white'
  },
  backgroundOp: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    width: '100%',
    height: '50%',
    position: 'absolute',
    bottom: 0,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15
  },
  passwordWrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  password: {
    width: '90%',
    height: '60%',
    backgroundColor: '#202651',
    borderRadius: 30,
    padding: 30
  },
  register1: {
    color: 'white',
    fontFamily: 'made-evolve-light',
    textAlign: 'center',
    marginTop: 30
  },
  register2: {
    color: 'white',
    fontFamily: 'made-evolve-thin',
    textAlign: 'center',
    marginTop: 10
  },
  input1: {
    width: 170,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'white',
    marginTop: 20
  },
  inputWrapper: {
    alignItems: 'center',
    width: '100%'
  },
  biometricPromtView: {
    backgroundColor: 'white',
    borderRadius: 30,
    height: 200,
    width: 180,
    alignItems: 'center',
  },
  BMVwrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  biometricLogo: {
    width: 60,
    height: 60,
    marginTop: '25%'
  },
  registerTitle: {
    textAlign: 'center',
    fontFamily: 'made-evolve-light',
    marginTop: 30
  },
  input: {
    width: '70%',
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginTop: 20,
    borderRadius: 20
  }
}
