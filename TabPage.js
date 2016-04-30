/**
 * This is the add bill page
 * @flow
 */

'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  StyleSheet,
  Text,
  TabBarIOS,
  View,
} = ReactNative;
var Realm = require('realm');
var {PropTypes} = React;

const User = require('./User');
const Bill = require('./Bill');
const BillOwedUsers = require('./BillOwedUsers');

const AddBillPage = require('./AddBillPage');
const SummaryPage = require('./SummaryPage');
const OwedBillPage = require('./OwedBillPage');

var TabPage = React.createClass({

  propTypes: {
    navigator: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {
      selectedTab: 'summaryPageTab',
    };
  },

  render: function() {
    var realm = new Realm({schema: [Bill, BillOwedUsers, User]});
    var user = this.props.data.user;
    var notifCount = 0;
    var billOwedUsers = realm
      .objects('BillOwedUsers')
      .filtered(`owedBy="${user.email}" AND paid=false`);
    // Count new bills
    for (var i = 0; i< billOwedUsers.length; i++) {
      var billID = billOwedUsers[i].billTo;
      var bill = realm
        .objects('Bill')
        .filtered(`id="${billID}"`);
      if (bill === null || bill.length === 0) {
        continue;
      }
      if (bill[0].billDate > user.lastLoginTime) {
        notifCount++;
      }
    }
    // console.log(notifCount);
    return (
      <TabBarIOS
        tintColor="white"
        barTintColor="darkslateblue"
        style={styles.tabBar}>
        <TabBarIOS.Item
          title="Charges"
          icon={require('./charge.png')}
          selected={this.state.selectedTab === 'summaryPageTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'summaryPageTab',
            });
          }}>
          <View style={[styles.tabContent, {backgroundColor: '#F5FCFF'}]}>
            <SummaryPage {...this.props}/>
          </View>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Bills"
          badge={notifCount > 0 ? notifCount : undefined}
          icon={require('./bill.png')}
          selected={this.state.selectedTab === 'owedBillTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'owedBillTab',
            });
          }}>
          <OwedBillPage {...this.props}/>
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  },
});

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
  },
  tabBar: {
    marginTop: 40,
  },
  tabText: {
    color: 'white',
  },
});

module.exports = TabPage;
