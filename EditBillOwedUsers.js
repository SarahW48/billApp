/**
 * This is the edit owed users page for a bill
 * @flow
 */

 'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  AlertIOS,
  StyleSheet,
  Text,
  TabBarIOS,
  View,
  ListView,
  TextInput,
  TouchableHighlight
} = ReactNative;
var Realm = require('realm');
var {PropTypes} = React;

const User = require('./User');
const Bill = require('./Bill');
const BillOwedUsers = require('./BillOwedUsers');

const EditBillOwedUsers = React.createClass({
  propTypes: {
    data: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {
      billOwedUsers: this.props.data.billOwedUsers,
      owedUserName: '',
      owedAmount: 0,
    };
  },

  render: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => 1 !== r2});
    var len = this.state.billOwedUsers.length;
    console.log('len', len);
    return (
      <View style={styles.container}>
        <Text style={styles.baseText}>
          User:
        </Text>
        <TextInput
          style={styles.baseTextInput}
          onChangeText={
            (owedUserName) => this.setState({owedUserName: owedUserName})
          }
          value={this.state.owedUserName}
        />
        <Text style={styles.baseText}>
          Owed Amount:
        </Text>
        <TextInput
          style={styles.baseTextInput}
          onChangeText={
            (owedAmount) => this.setState({owedAmount: Number(owedAmount)})
          }
          value={this.state.owedAmount.toString()}
        />
        <Text style={styles.buttonText} onPress={this._onAddOwedUserPress}>
          Add User to Bill
        </Text>
        <Text style={styles.addedUserTextInput}>
          {this.state.billOwedUsers.length} users have been added.
        </Text>
        <Text style={styles.baseText}>
          {this.state.billOwedUsers.length > 0 ? 'Users owed your bill' : ''}
        </Text>
        <ListView
          dataSource={ds.cloneWithRows(this.state.billOwedUsers)}
          renderRow={this._renderRow}
          contentInset={{bottom:40}}
          automaticallyAdjustContentInsets={false}
          enableEmptySections={true}
        />
        <Text style={styles.buttonText} onPress={this._onSubmit}>
          Save Changes
        </Text>
      </View>
    );
  },

  _onSubmit: function() {
    var routeData = this.props.data;
    routeData.billOwedUsers = this.state.billOwedUsers;
    var route = {
      scene: 'addBill',
      data: routeData,
    }
    this.props.navigator.replacePrevious(route);
    this.props.navigator.pop();
  },

  _renderRow: function(
    billOwedUsers: BillOwedUsers, sectionID: number, rowID: number
  ) {
    var realm = new Realm({schema: [Bill, BillOwedUsers, User]});
    var users = realm
      .objects('User')
      .filtered(`email="${billOwedUsers.owedBy}"`);
    var paymentText = billOwedUsers.paid ? 'Paid' : 'Unpaid';
    var userText =
      `User name: ${users[0].name} Owed Amount: ${billOwedUsers.amount}`;
    return (
      <View>
        <TouchableHighlight onPress={() => {this._onRowPress(billOwedUsers)}}>
          <View style={styles.row}>
            <Text style={styles.rowText}>
              {`${userText} ${paymentText}`}
            </Text>
          </View>
        </TouchableHighlight>
        <View style={styles.separator} />
      </View>
    );
  },

  _onRowPress: function(billOwedUsers: BillOwedUsers) {
    if (billOwedUsers.paid === true) {
      AlertIOS.alert(
        'You cannot edit this',
        'This item has been paid',
      );
      return;
    }
    var routeData = this.props.data;
    routeData.billOwedUsers = this.state.billOwedUsers;
    routeData.billOwedUser = {
      owedBy : billOwedUsers.owedBy,
      amount : billOwedUsers.amount,
    };
    var route = {
      scene: 'editOwedUser',
      data: routeData,
    }
    this.props.navigator.push(route);
  },

  _onAddOwedUserPress: function() {
    var realm = new Realm({schema: [Bill, BillOwedUsers, User]});
    var userName = this.state.owedUserName;
    var users = realm.objects('User').filtered(`name="${userName}"`);
    if (users === null || users.length === 0) {
      AlertIOS.alert(
        'Failed to find user',
        `Cannot find user named as ${userName}`,
      );
      return;
    }
    if (users[0].email === this.props.data.user.email) {
      AlertIOS.alert(
        'Failed to add user',
        'You cannot add yourself into bill',
      );
      return;
    }

    // check total mount
    if (this.props.data.bill && this.props.data.bill.totalAmount) {
      var totalOwed = 0;
      for (var i = 0; i < this.state.billOwedUsers.length; i++) {
        totalOwed += this.state.billOwedUsers[i].amount;
      }
      totalOwed += this.state.owedAmount;
      if (totalOwed > this.props.data.bill.totalAmount) {
        AlertIOS.alert(
          'Failed to add user',
          'You entered a too large amount',
        );
        return;
      }
    }
    // check if user exist
    if (this.props.data.bill && this.props.data.bill.id) {
      var billID = this.props.data.bill.id;
      var list = realm
        .objects('BillOwedUsers')
        .filtered(`owedBy="${users[0].email}" AND billTo="${billID}"`);
      if (list !== null && list.length > 0) {
        AlertIOS.alert(
          'Failed to add user',
          'You have already added user into your bill',
        );
        return;
      }
    }

    var updateList = this.state.billOwedUsers;
    var bill = this.props.data.bill;
    var billTo = null;
    if (bill !== null && bill !== undefined) {
      billTo = bill.id;
    }
    updateList.push({
      owedBy: users[0].email,
      billTo: billTo,
      amount: this.state.owedAmount,
      paid: false,
    });
    this.setState({billOwedUsers: updateList});

    AlertIOS.alert(
      'Added user to bill',
      `Added new user ${userName} into bill`,
    );
  },
});

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
  },
  baseText: {
    fontFamily: 'Cochin',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#86DFFC',
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
  },
  rowText: {
    flex: 1,
  },
  baseTextInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
  },
  addedUserTextInput: {
    height: 30,
    borderColor: 'black',
    borderWidth: 1,
  },
  buttonText: {
    backgroundColor: '#ddbbbb',
    height: 25,
    width: 100,
  },
});

module.exports = EditBillOwedUsers;
