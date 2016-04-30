/**
 * This is the admin page
 * @flow
 */

'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  NavigatorIOS,
  StyleSheet,
  Text,
  View,
  AlertIOS
} = ReactNative;
var {PropTypes} = React;

const Realm = require('realm');
const User = require('./User');
const Bill = require('./Bill');
const BillOwedUsers = require('./BillOwedUsers');

const AdminPage = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.button} onPress={this._onClear}>
          <Text style={styles.buttonText}>
            Reset Everything
          </Text>
        </Text>
      </View>
    );
  },

  _onClear: function() {
    deleteAll();
    initUsers();
    AlertIOS.alert(
      'Reset success',
      'Reset everything! Have fun!',
    );
  }
});

function deleteAll(): void {
  let realm = new Realm({schema: [Bill, User, BillOwedUsers]});
  realm.write(() => {
    let allBillOwedUsers = realm.objects('BillOwedUsers');
    realm.delete(allBillOwedUsers);
    let allUsers = realm.objects('User');
    realm.delete(allUsers);
    let allBills = realm.objects('Bill');
    realm.delete(allBills);
  });
}

function initUsers(): void {
  let realm = new Realm({schema: [Bill, User, BillOwedUsers]});
  realm.write(() => {
    realm.create(
      'User',
      {
        id: 'Admin@oracle.com',
        name: 'Admin',
        email: 'Admin@oracle.com',
        lastLoginTime: 0,
        newLoginTime: 0,
        password: '12345'
      }
    );
    realm.create(
      'User',
      {
        id: 'User1@oracle.com',
        name: 'User1',
        email: 'User1@oracle.com',
        lastLoginTime: 0,
        newLoginTime: 0,
        password: '12345'
      }
    );
    realm.create(
      'User',
      {
        id: 'User2@oracle.com',
        name: 'User2',
        email: 'User2@oracle.com',
        lastLoginTime: 0,
        newLoginTime: 0,
        password: '12345'
      }
    );
    realm.create(
      'User',
      {
        id: 'User3@oracle.com',
        name: 'User3',
        email: 'User3@oracle.com',
        lastLoginTime: 0,
        newLoginTime: 0,
        password: '12345'
      }
    );
    realm.create(
      'User',
      {
        id: 'User4@oracle.com',
        name: 'User4',
        email: 'User4@oracle.com',
        lastLoginTime: 0,
        newLoginTime: 0,
        password: '12345'
      }
    );
    realm.create(
      'User',
      {
        id: 'User5@oracle.com',
        name: 'User5',
        email: 'User5@oracle.com',
        lastLoginTime: 0,
        newLoginTime: 0,
        password: '12345'
      }
    );
  });
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#bd43ab',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

module.exports = AdminPage;
