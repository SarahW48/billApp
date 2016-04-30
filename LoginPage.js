/**
 * This is the login page
 * @flow
 */

'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  NavigatorIOS,
  StyleSheet,
  Text,
  TextInput,
  View,
  AlertIOS
} = ReactNative;
var Realm = require('realm');
var {PropTypes} = React;

const User = require('./User');
const Bill = require('./Bill');
const BillOwedUsers = require('./BillOwedUsers');

const LoginPage = React.createClass({

  propTypes: {
    data: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
  },

  getInitialState: function() {
    var emailText = '';
    var passwordText = '';
    if (this.props.data !== null && this.props.data.user) {
      emailText = this.props.data.user.email;
      passwordText = this.props.data.user.password;
    }
    return {
      emailText: emailText,
      passwordText: passwordText,
    };
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.baseText}>
          Email:
        </Text>
        <TextInput
          style={styles.baseTextInput}
          onChangeText={(emailText) => this.setState({emailText: emailText})}
          value={this.state.emailText}
        />
        <Text style={styles.baseText}>
          Password:
        </Text>
        <TextInput
          style={styles.baseTextInput}
          secureTextEntry={true}
          onChangeText={
            (passwordText) => this.setState({passwordText: passwordText})
          }
          value={this.state.passwordText}
        />
        <Text style={styles.button} onPress={this._onLoginPress}>
          <Text style={styles.buttonText}>
            Login
          </Text>
        </Text>
      </View>
    );
  },

  _onLoginPress: function() {
    // search user
    var realm = new Realm({schema: [Bill, BillOwedUsers, User]});
    var emailText = this.state.emailText;
    var passwordText = this.state.passwordText;
    var users = realm
      .objects('User')
      .filtered(`email="${emailText}" AND password="${passwordText}"`);
    if (users === null || users.length === 0) {
      // No user found, show alert and return
      AlertIOS.alert(
        'Cannot find user',
        'Something is wrong with your login info',
      );
      return;
    }
    // update login time
    realm.write(() => {
      users[0].lastLoginTime = users[0].newLoginTime;
      users[0].newLoginTime = new Date();
    });
    var scene = 'main';
    if (users[0].email === 'Admin@oracle.com') {
      scene = 'admin';
    }
    var route = {
      scene: scene,
      data: {
        user: users[0],
      }
    }
    this.props.navigator.push(route);
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  baseText: {
    fontFamily: 'Cochin',
  },
  baseTextInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#bd43ab',
    height: 20,
    width: 50,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

module.exports = LoginPage;
