/**
 * This is the add bill page
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

const AddBillPage = React.createClass({
  propTypes: {
    navigator: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
  },

  getInitialState: function() {
    var subject = '';
    var description = '';
    var totalAmount = 0;
    var billOwedUsers = [];
    if (this.props.data !== null && this.props.data.bill !== undefined) {
      var bill = this.props.data.bill;
      subject = bill.subject;
      description = bill.description;
      totalAmount = bill.totalAmount;
    }
    if (
      this.props.data !== null &&
      this.props.data.billOwedUsers !== undefined &&
      this.props.data.billOwedUsers.length > 0
    ) {
      billOwedUsers = this.props.data.billOwedUsers;
    }
    return {
      subject: subject,
      description: description,
      totalAmount: totalAmount,
      billOwedUsers: billOwedUsers,
    };
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.baseText}>
          Subject:
        </Text>
        <TextInput
          style={styles.baseTextInput}
          onChangeText={
            (subject) => this.setState({subject: subject})
          }
          value={this.state.subject}
        />
        <Text style={styles.baseText}>
          Description:
        </Text>
        <TextInput
          style={styles.baseTextInput}
          onChangeText={
            (description) => this.setState({description: description})
          }
          value={this.state.description}
        />
        <Text style={styles.baseText}>
          Total Amount:
        </Text>
        <TextInput
          style={styles.baseTextInput}
          onChangeText={
            (totalAmount) => this.setState({totalAmount: Number(totalAmount)})
          }
          value={this.state.totalAmount.toString()}
        />
        <Text
          style={styles.buttonText}
          onPress={() => this._showOwedUsers()}>
          {this.state.billOwedUsers.length} users have been added. click to view
        </Text>
        <Text></Text>
        <Text style={styles.buttonText} onPress={this._onAddBillPress}>
          Save Changes
        </Text>
      </View>
    );
  },

  _showOwedUsers: function() {
    var routeData = this.props.data;
    routeData.billOwedUsers = this.state.billOwedUsers;
    if (routeData.bill === null || routeData.bill === undefined) {
      routeData.bill = {
        subject: this.state.subject,
        description: this.state.description,
        totalAmount: this.state.totalAmount,
      };
    }
    var route = {
      scene: 'editOwedUsers',
      data: routeData,
    }
    this.props.navigator.push(route);
  },

  _onAddBillPress: function() {
    if (this.state.subject === null || this.state.subject === '') {
      AlertIOS.alert(
        'Failed to add user',
        'You must enter a subject',
      );
      return;
    }
    if (this.state.totalAmount <= 0) {
      AlertIOS.alert(
        'Failed operation',
        'Must input a positve number for bill amount',
      );
      return;
    }
    var totalOwedAmount = 0;
    for (var i = 0; i < this.state.billOwedUsers.length; i++) {
      totalOwedAmount += this.state.billOwedUsers[i].amount;
    }
    if (this.state.totalAmount < totalOwedAmount) {
      AlertIOS.alert(
        'Failed operation',
        'The amount to put must greater than total amount people owed',
      );
      return;
    }
    var realm = new Realm({schema: [Bill, BillOwedUsers, User]});
    var user = this.props.data.user;
    realm.write(() => {
      var timestamp = Date.now();
      var billID = `${timestamp}+${this.state.subject}`;
      if (
        this.props.data.bill !== null &&
        this.props.data.bill !== undefined &&
        this.props.data.bill.id !== null &&
        this.props.data.bill.id !== undefined
      ) {
        billID = this.props.data.bill.id;
      }
      var bill = realm.create(
        'Bill',
        {
          id: billID,
          subject: this.state.subject,
          description: this.state.description,
          paidBy: user.email,
          totalAmount: this.state.totalAmount,
          billDate: new Date(),
        },
        true
      );
      var billOwedUsers = this.state.billOwedUsers;
      for (var i = 0; i < billOwedUsers.length; i++) {
        var list = realm
          .objects('BillOwedUsers')
          .filtered(
            `owedBy="${billOwedUsers[i].owedBy}" AND billTo="${bill.id}"`
          );
        if (list !== null && list.length > 0) {
          var billOwedUser = list[0];
          billOwedUser.amount = billOwedUsers[i].amount;
        } else {
          realm.create(
            'BillOwedUsers',
            {
              owedBy: billOwedUsers[i].owedBy,
              billTo: bill.id,
              amount: billOwedUsers[i].amount,
              paid: false,
            },
          );
        }
      }
      // delete update
      if (
        this.props.data.deletedUser !== null &&
        this.props.data.deletedUser !== undefined
      ) {
        for (var i = 0; i < this.props.data.deletedUser.length; i++) {
          var devaredList = realm
            .objects('BillOwedUsers')
            .filtered(`owedBy="${this.props.data.deletedUser[i]}"`);
          realm.devare(devaredList);
        }
      }
    });
    AlertIOS.alert(
      'Change saved',
      `You have successfully saved your bill ${this.state.subject}.`
    );
    var route = {
      scene: 'main',
      data: this.props.data,
    };
    this.props.navigator.replacePrevious(route);
    this.props.navigator.pop();
  },
})

var styles = StyleSheet.create({
  container: {
    marginTop: 70,
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  baseText: {
    fontFamily: 'Cochin',
  },
  titvarext: {
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
    height: 40,
    width: 180,
  },
});

module.exports = AddBillPage;
