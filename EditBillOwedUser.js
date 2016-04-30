/**
 * This is the edit owed user page for a bill
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
  TextInput,
  TouchableHighlight
} = ReactNative;
var Realm = require('realm');
var {PropTypes} = React;

const User = require('./User');
const Bill = require('./Bill');
const BillOwedUsers = require('./BillOwedUsers');

const EditBillOwedUser = React.createClass({
  propTypes: {
    data: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {
      owedAmount: this.props.data.billOwedUser.amount,
    };
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.baseText}>
          User: {this._getName()}
        </Text>
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
        <Text
          style={styles.buttonText}
          onPress={() => {
            AlertIOS.alert(
              'Delete user',
              'Are you sure you want to Delete this user?',
              [
                {text: 'Cancel', onPress: () => {}},
                {text: 'OK', onPress: () => this._onDelete()},
              ],
            );
          }}>
          Delete user
        </Text>
        <Text style={styles.baseText}></Text>
        <Text style={styles.buttonText} onPress={this._onSubmit}>
          Save Changes
        </Text>
      </View>
    );
  },

  _getName: function() : string {
    var realm = new Realm({schema: [Bill, BillOwedUsers, User]});
    var users = realm
      .objects('User')
      .filtered(`email="${this.props.data.billOwedUser.owedBy}"`);
    return users[0].name;
  },

  _onSubmit: function() {
    // check total mount
    if (this.props.data.bill && this.props.data.bill.totalAmount) {
      var totalOwed = 0;
      for (var i = 0; i < this.props.data.billOwedUsers.length; i++) {
        totalOwed += this.props.data.billOwedUsers[i].amount;
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

    for (var i = 0; i < this.props.data.billOwedUsers.length; i++) {
      if (
        this.props.data.billOwedUsers[i].owedBy ===
        this.props.data.billOwedUser.owedBy
      ) {
        var updateList = JSON.parse(
          JSON.stringify(this.props.data.billOwedUsers)
        );
        updateList[i].amount = this.state.owedAmount;
        AlertIOS.alert(
          'Update success',
          `Updated for user: ${this.props.data.billOwedUser.owedBy}`,
        );
        var routeData = this.props.data;
        routeData.billOwedUsers = updateList;
        var route = {
          scene: 'editOwedUsers',
          data: routeData,
        }
        this.props.navigator.replacePrevious(route);
        this.props.navigator.pop();
        return;
      }
    }
  },

  _onDelete: function() {
    for (var i = 0; i < this.props.data.billOwedUsers.length; i++) {
      if (
        this.props.data.billOwedUsers[i].owedBy ===
        this.props.data.billOwedUser.owedBy
      ) {
        var updateList = this.props.data.billOwedUsers;
        updateList.splice(i, 1);
        AlertIOS.alert(
          'Delete user',
          `Delete user: ${this.props.data.billOwedUser.owedBy}`,
        );
        var routeData = this.props.data;
        routeData.billOwedUsers = updateList;
        if (
          routeData.DeletedUser === null || routeData.DeletedUser === undefined
        ) {
          routeData.DeletedUser = [];
          routeData.DeletedUser.push(this.props.data.billOwedUser.owedBy);
        }
        var route = {
          scene: 'editOwedUsers',
          data: routeData,
        }
        this.props.navigator.replacePrevious(route);
        this.props.navigator.pop();
        return;
      }
    }
    AlertIOS.alert(
      'Delete fail',
      'Something went wrong',
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
    backgroundColor: '#F5FCFF',
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
  buttonText: {
    backgroundColor: '#ddbbbb',
    height: 25,
    width: 100,
  },
});

module.exports = EditBillOwedUser;
