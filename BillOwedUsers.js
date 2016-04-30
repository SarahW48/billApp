/**
 * This class defines the schema for BillOwedUsers.
 */
'use strict';

const Realm = require('realm');

class BillOwedUsers {}

BillOwedUsers.schema = {
  name: 'BillOwedUsers',
  properties: {
    owedBy: 'string', // The people who owed the bill, uid, user who owed in the bill
    billTo: 'string', // The bill, bill id, the bill user need to pay
    amount: 'int',    // owed amount
    paid: 'bool',     // paid or not
  }
}

module.exports = BillOwedUsers;
