import {StyleSheet} from 'react-native';

let black = '#141414';
let dark_blue = '#353535';
let gray_blue = '#777777';
let green = '#4CAF50';
let red = '#f44336';
let light_green = '#e7ebee';
let white = '#ffffff';

let extra_large = 24;
let large = 20;
let medium = 16;
let small = 12;


export default StyleSheet.create({
  loadView: {
        flex: 1,
      backgroundColor: black,
      justifyContent: 'center',
  },

  scrollView: {
    flex: 1,
    backgroundColor: black,
  },

  tabNavigator: {
    backgroundColor: gray_blue,
    color: white,
    fontWeight: 'bold',
  },

  pageView: {
      flex: 1,
      backgroundColor: black,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
    },

  historyTouchable: {
    borderRadius: 4,
    padding: 10,
    margin: 10,
    backgroundColor: dark_blue,
    flex: 1
  },

  rowHistoryTouchable: {
      borderRadius: 4,
      padding: 10,
      margin: 10,
      backgroundColor: dark_blue,
      flexDirection: 'row',
    },

  historyTouchable: {
        borderRadius: 4,
        padding: 10,
        margin: 10,
        backgroundColor: dark_blue,
      },

  personTouchable: {
      borderRadius: 4,
      padding: 10,
      margin: 10,
      backgroundColor: gray_blue,
    },

  rowPersonTouchable: {
        borderRadius: 4,
        padding: 10,
        margin: 10,
        backgroundColor: gray_blue,
        flexDirection: 'row',
      },

  datePicker: {
    backgroundColor: light_green,
    borderRadius: 4,
    justifyContent: 'center',
    padding: 2,
  },

  datePickerView:{
    flexDirection: 'row',
    justifyContent: 'center',
  },

  centerView: {
    alignItems: 'center',
  },

  whiteTo: {
    color: white,
    padding: 10,
    fontSize: large,
  },

  whiteLabel: {
    color: white,
    fontSize: large,
    fontWeight: 'bold',
    paddingRight: 10,
  },

  smallerWhiteLabel: {
      color: white,
      fontSize: medium,
      fontWeight: 'bold',
      paddingRight: 10,
    },

  smallerRightWhiteLabel: {
        color: white,
        fontSize: medium,
        fontWeight: 'bold',
        paddingRight: 10,
        textAlign: 'right',
      },

  rowViewPadding: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
  },

  defaultPicker: {
    backgroundColor: light_green,
    borderRadius: 4,
    flex: 1,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  leftJustifyText:{
    flex:1,
    textAlign: 'right',
    color: white,
    fontSize: medium,
    fontWeight: 'bold',
  },

  saveBtn:{
    paddingTop: 10,
    paddingBottom: 10,
    margin: 5,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    backgroundColor: green,
    borderRadius: 4,
    flex: 1
  },

  saveBtnNoFlex:{
      paddingTop: 10,
      paddingBottom: 10,
      justifyContent: 'center',
      backgroundColor: green,
      borderRadius: 4,
    },

  cancelBtn:{
      paddingTop: 10,
      paddingBottom: 10,
      margin: 5,
      marginLeft: 10,
      marginRight: 10,
      justifyContent: 'center',
      backgroundColor: red,
      borderRadius: 4,
      flex: 1
    },

  removeBtn:{
    padding: 5,
    justifyContent: 'center',
    backgroundColor: red,
    borderRadius: 4,
  },

  removeText:{
    fontSize: small,
    textAlign: 'center',
    color: white,
  },

  btnText:{
    fontSize: large,
    textAlign: 'center',
    fontWeight: 'bold',
    color: white,
  },

  flexOneValue:{
    flex: 1,
    textAlign: 'center',
    fontSize: medium,
    fontWeight: 'bold',
    color: white,
  },

  flexOneWhiteLabel:{
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: large,
    color: white,
  },

  flexOneInput:{
    flex: 1,
    textAlign: 'center',
    fontSize: medium,
    backgroundColor: light_green,
    borderRadius: 4,
  },

  flexOneInputMargin:{
      flex: 1,
      textAlign: 'center',
      fontSize: medium,
      backgroundColor: light_green,
      marginLeft: 20,
      marginRight: 20,
      borderRadius: 4,
    },

  rowViewSpaceBetween:{
    flexDirection: 'row',
  },

  rowViewStats:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },

  bottomBtn:{
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: 30
    },

  container:{
    flex: 1,
  },

  errBox:{
    backgroundColor: red,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 4,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },

  errText:{
    textAlign: 'center',
    fontSize: medium,
    color: white,
  }

});