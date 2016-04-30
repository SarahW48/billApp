/**
 * The app entry
 * @flow
 */

'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableOpacity,
  Image
} from 'react-native';

const Realm = require('realm');
const User = require('./User');
const Bill = require('./Bill');
const BillOwedUsers = require('./BillOwedUsers');
const AddBillPage = require('./AddBillPage');
const SummaryPage = require('./SummaryPage');
const OwedBillPage = require('./OwedBillPage');
const TabPage = require('./TabPage');
const LoginPage = require('./LoginPage');
const EditBillOwedUsers = require('./EditBillOwedUsers');
const EditBillOwedUser = require('./EditBillOwedUser');
const PayBillPage = require('./PayBillPage');
const AdminPage = require('./AdminPage');

class BillApp extends Component {
  render() {
    initAdmin();
    return (
      <Navigator
        initialRoute={{
          scene: 'login',
          data: {},
        }}
        renderScene={this._navigatorRenderScene}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
            style={styles.navBar}
          />
        }
      />
    );
  }

  _navigatorRenderScene(route, navigator) {
    switch (route.scene) {
      case 'login':
        return (
          <LoginPage navigator={navigator} data={route.data} />
        );
      case 'main':
        return (
          <TabPage navigator={navigator} data={route.data} />
        );
      case 'addBill':
        return (
          <AddBillPage navigator={navigator} data={route.data} />
        );
      case 'editOwedUsers':
        return (
          <EditBillOwedUsers navigator={navigator} data={route.data} />
        );
      case 'editOwedUser':
        return (
          <EditBillOwedUser navigator={navigator} data={route.data} />
        );
      case 'payBill':
        return (
          <PayBillPage navigator={navigator} data={route.data} />
        );
      case 'admin':
        return (
          <AdminPage navigator={navigator} data={route.data} />
        );
    }
  }
}

var NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    var previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text>Back</Text>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    if (route.scene === 'main') {
      var routeData = {};
      routeData.user = route.data.user;
      return (
        <TouchableOpacity
          onPress={() => navigator.push({
            scene : 'addBill',
            data : routeData,
          })}
          style={styles.navBarRightButton}>
          <Text>New</Text>
        </TouchableOpacity>
      );
    }
  },

  Title: function(route, navigator, index, navState) {
    switch (route.scene) {
      case 'login':
        return;
      case 'main':
        return;
      case 'addBill':
        return <Text>Add Bill</Text>;
      case 'editOwedUsers':
        return <Text>Edit Users</Text>;
      case 'editOwedUser':
        return <Text>Edit User</Text>;
      case 'payBill':
        return <Text>Pay Bill</Text>;
    }
  },
};

var styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#7e66ba',
    height: 40,
    marginTop: 20,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight:10,
  },
});

function deleteAll(): void {
  var realm = new Realm({schema: [Bill, User, BillOwedUsers]});
  realm.write(() => {
    var allBillOwedUsers = realm.objects('BillOwedUsers');
    realm.delete(allBillOwedUsers);
    var allUsers = realm.objects('User');
    realm.delete(allUsers);
    var allBills = realm.objects('Bill');
    realm.delete(allBills);
  });
}

function initAdmin(): void {
  var realm = new Realm({schema: [Bill, User, BillOwedUsers]});
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
      },
      true,
    );
  });
}

function initUsers(): void {
  var realm = new Realm({schema: [Bill, User, BillOwedUsers]});
  realm.write(() => {
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

function deleteAll(): void {
  var realm = new Realm({schema: [Bill, User, BillOwedUsers]});
  realm.write(() => {
    var allBillOwedUsers = realm.objects('BillOwedUsers');
    realm.delete(allBillOwedUsers);
    var allUsers = realm.objects('User');
    realm.delete(allUsers);
    var allBills = realm.objects('Bill');
    realm.delete(allBills);
  });
}


AppRegistry.registerComponent('BillApp', () => BillApp);
