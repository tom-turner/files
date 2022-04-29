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

exports.up = async function(db) {
  await db.createTable('shares', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id:'int',
    url:'string',
    created_at:'string'
  })

  await db.createTable('join_shares_tags', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id:'int',
    tag_id:'int',
    share_id:'int',
    created_at:'string'
  })

};

exports.down = async function(db) {
  await db.dropTable('shares');

  await db.dropTable('join_shares_tags');

};


exports._meta = {
  "version": 1
};
