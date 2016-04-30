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
  ListView,
  TouchableHighlight,
  RecyclerViewBackedScrollView,
} = ReactNative;
var Realm = require('realm');
var {PropTypes} = React;

const User = require('./User');
const Bill = require('./Bill');
const BillOwedUsers = require('./BillOwedUsers');

const OwedBillPage = React.createClass({
  propTypes: {
    navigator: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
  },

  render: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => 1 !== r2});
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.balanceText}>
            Owed Bills:
          </Text>
        </View>
        <ListView
          dataSource={ds.cloneWithRows(this._genData())}
          renderRow={this._renderRow}
          automaticallyAdjustContentInsets={false}
          enableEmptySections={true}
        />
      </View>
    );
  },

  _renderRow: function(
    rowData: BillOwedUsers, sectionID: number, rowID: number
  ) {
    var realm = new Realm({schema: [Bill, BillOwedUsers, User]});
    var user = this.props.data.user;
    var billID = rowData.billTo;
    var bill = realm.objects('Bill').filtered(`id="${billID}"`);
    var rowStyle = styles.rowText;
    // new item.
    if (bill[0].billDate > user.lastLoginTime) {
      rowStyle = styles.newRowText;
    }
    return (
      <View>
        <TouchableHighlight onPress={() => this._onRowPress(rowData)}>
          <View style={styles.row}>
            <Text style={rowStyle}>
              {rowData.billTo.split('+')[1]} Owed Amount: {rowData.amount} Make a pay
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
        'Operation failed',
        'You already paid it',
      );
      return;
    } else {
      var realm = new Realm({schema: [Bill, BillOwedUsers, User]});
      var bill = realm.objects('Bill').filtered(
        `id="${billOwedUsers.billTo}"`
      );
      var routeData = {
        user : this.props.data.user,
        bill : bill[0],
        billOwedUsers : billOwedUsers,
      };
      this.props.navigator.push({
        scene : 'payBill',
        data : routeData,
      })
    }
  },

  _genData: function(): Array<BillOwedUsers> {
    var realm = new Realm({schema: [Bill, BillOwedUsers, User]});
    var user = this.props.data.user;
    return realm
      .objects('BillOwedUsers')
      .filtered(`owedBy="${user.email}" AND paid=false`);
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
    backgroundColor: '#86DFFC',
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
  },
  rowText: {
    flex: 1,
  },
  newRowText: {
    flex: 1,
    color: 'red',
  },
});

module.exports = OwedBillPage;
