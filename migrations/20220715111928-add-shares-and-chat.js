'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

// this migration makes the add-share-tags migration obsolete.

exports.up = async function(db) {
  await db.createTable('sharing', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id:'int',
    tag_id:'int',
    public:'int',
    share_slug:'string',
    created_at:'string'
  })
  await db.createTable('join_shares_users', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    share_id:'int',
    user_id:'int',
  })
  await db.createTable('chat_history', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    share_id:'int',
    message:'string',
    username:'string',
    created_at:'string'
  })
  

};

exports.down = async function(db) {
  await db.dropTable('sharing');
  await db.dropTable('join_shares_users');
  await db.dropTable('chat_history');

};

exports._meta = {
  "version": 1
};
