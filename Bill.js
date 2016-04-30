/**
 * This class defines the schema for bill.
 */
'use strict';

const Realm = require('realm');

class Bill {}

Bill.schema = {
  name: 'Bill',
  primaryKey: 'id',
  properties: {
    id: 'string',
    subject: 'string',
    description: 'string',
    paidBy: 'string',
    totalAmount: 'int',
    billDate: 'date',
  }
}

module.exports = Bill;
