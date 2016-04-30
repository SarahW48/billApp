/**
 * This is the summary page
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
  ListView,
  TouchableHighlight,
  RecyclerViewBackedScrollView,
} = ReactNative;
var Realm = require('realm');
var {PropTypes} = React;

const User = require('./User');
const Bill = require('./Bill');
const BillOwedUsers = require('./BillOwedUsers');

const SummaryPage = React.createClass({
  propTypes: {
    data: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
  },

  render: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => 1 !== r2});
    var netValue = this._getBilledBalance()-this._getOwedBalance();
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.balanceText}>
            Current Balance (You need to pay): {this._getOwedBalance()}
          </Text>
          <Text style={styles.balanceText}>
            Current Bills (Others need to pay you): {this._getBilledBalance()}
          </Text>
          <Text style={styles.balanceText}>
            Total Balance: {netValue > 0 ? '+' : ''}{netValue}
          </Text>
        </View>
        <ListView
          dataSource={ds.cloneWithRows(this._genData())}
          renderRow={this._renderRow}
          contentInset={{bottom:40}}
          automaticallyAdjustContentInsets={false}
          enableEmptySections={true}
        />
      </View>
    );
  },

  // How much you need to pay others
  _getOwedBalance: function(): number {
    var realm = new Realm({schema: [Bill, BillOwedUsers, User]});
    var user = this.props.data.user;
    var totalOwed = 0;
    var billOwedUsers = realm
      .objects('BillOwedUsers')
      .filtered(`owedBy="${user.email}" AND paid=false`);
    billOwedUsers.forEach(
      (billOwedUser) => totalOwed += billOwedUser.amount
    );
    return totalOwed;
  },

  // How much others need to pay you
  _getBilledBalance: function(): number {
    var realm = new Realm({schema: [Bill, BillOwedUsers, User]});
    var user = this.props.data.user;
    var bills = realm
      .objects('Bill')
      .filtered(`paidBy="${user.email}"`);
    var totalOwed = 0;
    bills.forEach(
      (bill) => {
        var billOwedUsers = realm
          .objects('BillOwedUsers')
          .filtered(`billTo="${bill.id}" AND paid=false`);
        billOwedUsers.forEach(
          (billOwedUser) => totalOwed += billOwedUser.amount
        );
      }
    );
    return totalOwed;
  },

  _renderRow: function(rowData: Bill, sectionID: number, rowID: number) {
    return (
      <View>
        <TouchableHighlight onPress={() => {this._onRowPress(rowData)}}>
          <View style={styles.row}>
            <Text style={styles.rowText}>
              {rowData.subject} Amount: {rowData.totalAmount}
            </Text>
          </View>
        </TouchableHighlight>
        <View style={styles.separator} />
      </View>
    );
  },

  _onRowPress: function(bill: Bill) {
    var routeData = {};
    var realm = new Realm({schema: [Bill, BillOwedUsers, User]});
    var billOwedUsers = realm.objects('BillOwedUsers').filtered(
      `billTo="${bill.id}"`
    );
    routeData.user = this.props.data.user;
    routeData.bill = bill;
    routeData.billOwedUsers =
      Object.keys(billOwedUsers).map(key => billOwedUsers[key]);
    var route = {
      scene: 'addBill',
      data: routeData,
    };
    this.props.navigator.push(route);
  },

  _genData: function(): Array<Bill> {
    var realm = new Realm({schema: [Bill, BillOwedUsers, User]});
    var user = this.props.data.user;
    return realm
      .objects('Bill')
      .filtered(`paidBy="${user.email}"`)
      .sorted('billDate', 'desc');
  }
})

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#bda469',
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
  },
  rowText: {
    flex: 1,
  },
});

module.exports = SummaryPage;
