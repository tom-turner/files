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
  await db.createTable('files', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id:'string',
    user_file_name:'string',
    user_file_path: 'string',
    file_type:'string',
    file_ext:'string',
    file_size:'bigint',
    bytes_uploaded:'bigint',
    meta_data:'string',
    checksum:'string',
    last_modified:'string'
  })
  await db.createTable('directories', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id:'string',
    user_file_name:'string',
    user_file_path: 'string',
    last_modified:'string'
  })

  await db.createTable('users', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    username:'string',
    hashed_password:'string',
    created_at:'string'
  })

};

exports.down = async function(db) {
  await db.dropTable('files');
  await db.dropTable('users');
  await db.dropTable('directories');
};


exports._meta = {
  "version": 1
};
