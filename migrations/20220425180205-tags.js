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
  await db.createTable('tags', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id:'string',
    tag_name:'string',
    tag_colour:'string',
    created_at:'string'
  })

  await db.createTable('join_files_tags', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id:'string',
    tag_id:'string',
    file_id:'string',
    created_at:'string'
  })

};

exports.down = async function(db) {
  await db.dropTable('tags');

  await db.dropTable('join_files_tags');

};


exports._meta = {
  "version": 1
};
