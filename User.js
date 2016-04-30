/**
 * This class defines the schema for user.
 */
'use strict';

const Realm = require('realm');

class User {}

User.schema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    email: 'string',
    password: 'string',
    newLoginTime: 'int',
    lastLoginTime: 'int',    
  }
}

module.exports = User;
