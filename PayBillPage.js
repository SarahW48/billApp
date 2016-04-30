/**
 * This is the pay bill page
 * @flow
 */

 'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  AlertIOS,
  StyleSheet,
  Text,
  TextInput,
  View,
} = ReactNative;
var Realm = require('realm');
var {PropTypes} = React;

const User = require('./User');
const Bill = require('./Bill');
const BillOwedUsers = require('./BillOwedUsers');

const PayBillPage = React.createClass({
  propTypes: {
    navigator: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
  },

  render: function() {
    //console.log('render');
    //console.log(this.props.data);
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>
          Pay Bill
        </Text>
        <Text style={styles.baseText}>
          Bill Subject: {this.props.data.bill.subject}
        </Text>
        <Text style={styles.baseText}>
          Description: {this.props.data.bill.description}
        </Text>
        <Text style={styles.baseText}>
          Owed Amount: {this.props.data.billOwedUsers.amount}
        </Text>
        <Text
          style={styles.buttonText}
          onPress={() => {
            AlertIOS.alert(
              'Pay bill',
              'Are you sure you want to pay?',
              [
                {text: 'Cancel', onPress: () => {}},
                {text: 'OK', onPress: () => this._onPayBill()},
              ],
            );
          }}>
          Pay bill
        </Text>
      </View>
    );
  },

  _onPayBill: function() {
    let realm = new Realm({schema: [Bill, BillOwedUsers, User]});
    realm.write(() => {
      let owedBy = this.props.data.billOwedUsers.owedBy;
      let billTo = this.props.data.billOwedUsers.billTo;
      let billOwedUsers = realm.objects('BillOwedUsers').filtered(
        `owedBy="${owedBy}" AND billTo="${billTo}"`
      );
      billOwedUsers[0].paid = true;
    });
    AlertIOS.alert(
      'Payment success',
      'You paid your bill!',
    );
    this.props.navigator.pop();
  },
});

var styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  baseText: {
    fontFamily: 'Cochin',
  },
  titleText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  baseTextInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
  },
  buttonText: {
    backgroundColor: '#ddbbbb',
    height: 25,
    width: 100,
  },
});

module.exports = PayBillPage;
